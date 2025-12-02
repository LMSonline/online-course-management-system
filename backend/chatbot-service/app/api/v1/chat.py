from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.services.chat_service import ChatService
from app.api.deps import get_chat_service

router = APIRouter()


class ChatRequest(BaseModel):
    session_id: str
    user_id: str
    text: str
    current_course_id: str | None = None
    debug: bool = False  # If True, include debug info (chunks used for RAG)


class ChunkDebugInfo(BaseModel):
    """Debug info for a single chunk."""
    course_id: str
    lesson_id: str | None
    section: str | None
    score: float | None
    text_preview: str


class DebugInfo(BaseModel):
    """Debug information for RAG responses."""
    chunks: list[ChunkDebugInfo]


class ChatResponse(BaseModel):
    reply: str
    debug: DebugInfo | None = None  # Only present if debug=True in request


@router.post("/chat/messages", response_model=ChatResponse)
async def post_message(
    req: ChatRequest,
    chat_service: ChatService = Depends(get_chat_service),
):
    reply, debug_info = await chat_service.handle_message(
        session_id=req.session_id,
        user_id=req.user_id,
        text=req.text,
        current_course_id=req.current_course_id,
        debug=req.debug,
    )

    response = ChatResponse(reply=reply)
    if debug_info and req.debug:
        response.debug = DebugInfo(
            chunks=[
                ChunkDebugInfo(**chunk) for chunk in debug_info["chunks"]
            ]
        )

    return response