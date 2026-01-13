import time
import uuid
import logging

from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel

from app.services.groq_client import groq_chat

router = APIRouter()

logger = logging.getLogger(__name__)


class FrontendChatRequest(BaseModel):
    """Frontend-friendly request model - only text is required."""
    text: str
    session_id: str | None = None
    # Optional fields (ignored in free-chat MVP but accepted for compatibility)
    user_id: str | None = None
    current_course_id: str | None = None


class ChatResponse(BaseModel):
    """Response model for free-chat MVP."""
    reply: str
    session_id: str
    debug: None = None  # Always None for free-chat MVP


@router.post("/chat/messages", response_model=ChatResponse)
async def post_message(
    req: FrontendChatRequest,
    request: Request,
):
    """
    Free-chat MVP endpoint - always calls Groq, no DB, no demo fallback.
    
    - Accepts minimal body: {"text": "..."}
    - Optional: session_id (generated if missing)
    - Always calls Groq and returns {"reply", "session_id"}
    - Returns 502 if Groq fails (with error details)
    """
    # Generate session_id if missing
    session_id = req.session_id or f"session_{uuid.uuid4().hex[:16]}"
    
    # Basic guard: text is required
    if not req.text or not req.text.strip():
        raise HTTPException(status_code=422, detail="Field 'text' is required")
    
    user_text = req.text.strip()
    
    # Get request_id for logging
    request_id = getattr(request.state, "request_id", None) or str(uuid.uuid4())
    start_time = time.monotonic()
    
    logger.info("Calling Groq chat/completions", extra={"request_id": request_id})
    
    try:
        # Call Groq directly - no DB, no context manager, no demo fallback
        reply = await groq_chat(user_text)
        
        latency_ms = (time.monotonic() - start_time) * 1000
        logger.info(
            "Groq OK",
            extra={"request_id": request_id, "latency_ms": latency_ms},
        )
        
        return ChatResponse(reply=reply, session_id=session_id)
        
    except HTTPException:
        # Re-raise HTTPException (502 from groq_chat) as-is
        latency_ms = (time.monotonic() - start_time) * 1000
        logger.error(
            "Groq failed",
            extra={
                "request_id": request_id,
                "latency_ms": latency_ms,
            },
        )
        raise
    except Exception as exc:
        # Unexpected error
        latency_ms = (time.monotonic() - start_time) * 1000
        logger.error(
            "Unexpected error in chat endpoint",
            extra={
                "request_id": request_id,
                "latency_ms": latency_ms,
                "error_type": type(exc).__name__,
            },
            exc_info=exc,
        )
        raise HTTPException(
            status_code=502,
            detail=f"Unexpected error: {exc}",
        ) from exc