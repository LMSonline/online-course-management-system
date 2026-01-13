import time
import uuid
from contextvars import ContextVar
from typing import Callable

from fastapi import FastAPI, Request, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from app.api.v1 import (
    chat as chat_router,
    sessions as sessions_router,
    admin as admin_router,
    analytics as analytics_router,
)
from app.core import logging as core_logging
from app.core.settings import settings
from app.core.exceptions import ChatbotException
from app.services.context_manager import ensure_schema_initialized

logger = core_logging.logger

app = FastAPI(
    title="Chatbot Service",
    version="1.0.0",
    description="NLP chatbot for LMS (RAG + LLM + recommendations).",
)


class APIKeyAuthMiddleware(BaseHTTPMiddleware):
    """
    API key middleware (disabled for free-chat MVP).

    For this MVP, authentication is not enforced so that the chatbot
    can be called freely from the frontend without X-API-KEY.
    """

    async def dispatch(self, request: Request, call_next: Callable):
        # Auth check is intentionally disabled – always allow the request.
        return await call_next(request)


class RequestTimingMiddleware(BaseHTTPMiddleware):
    """Middleware to log request timing and set request ID."""

    async def dispatch(self, request: Request, call_next: Callable):
        # Generate request ID
        request_id = str(uuid.uuid4())
        core_logging.set_request_id(request_id)
        request.state.request_id = request_id

        # Record start time
        start_time = time.time()

        # Process request
        try:
            response = await call_next(request)
        except Exception as exc:
            # Log error
            core_logging.log_error(exc, context={"path": request.url.path})
            raise

        # Calculate latency
        latency_ms = (time.time() - start_time) * 1000

        # Extract user_id from query params or headers if available
        user_id = request.query_params.get("user_id") or request.headers.get("X-User-ID")

        # Log request
        core_logging.log_request(
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
            latency_ms=latency_ms,
            user_id=user_id,
        )

        # Add request ID to response header
        response.headers["X-Request-ID"] = request_id

        return response


# Add API key auth middleware first (before timing middleware)
app.add_middleware(APIKeyAuthMiddleware)
app.add_middleware(RequestTimingMiddleware)

# CORS Configuration: Parse allowed origins from settings
def get_cors_origins() -> list[str]:
    """Parse CORS_ALLOWED_ORIGINS from settings into a list."""
    origins_str = settings.CORS_ALLOWED_ORIGINS
    if not origins_str:
        return ["http://localhost:3000", "http://localhost:5173"]  # Default FE dev servers
    return [origin.strip() for origin in origins_str.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router.router, prefix="/api/v1", tags=["chatbot"])
app.include_router(sessions_router.router, prefix="/api/v1", tags=["sessions"])
app.include_router(admin_router.router, prefix="/api/v1", tags=["admin"])
app.include_router(analytics_router.router, prefix="/api/v1/chat", tags=["analytics"])


@app.exception_handler(ChatbotException)
async def chatbot_exception_handler(request: Request, exc: ChatbotException):
    """Handler for custom chatbot exceptions."""
    request_id = getattr(request.state, "request_id", None)
    core_logging.log_error(exc, context={"path": request.url.path, "error_code": exc.error_code})

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "error_code": exc.error_code,
                "message": exc.message,
                "details": exc.details,
                "request_id": request_id,
            }
        },
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler for unhandled errors."""
    request_id = getattr(request.state, "request_id", None)
    core_logging.log_error(exc, context={"path": request.url.path})

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "error_code": "INTERNAL_SERVER_ERROR",
                "message": "An internal error occurred. Please try again later.",
                "details": {},
                "request_id": request_id,
            }
        },
    )


@app.on_event("startup")
async def startup_event():
    """Initialize DB schema for chat_sessions and chat_messages on startup (skip if NO_DB_MODE)."""
    if settings.NO_DB_MODE:
        logger.info("NO_DB_MODE enabled: skipping database initialization")
        return
    
    try:
        await ensure_schema_initialized()
        # Logging is done inside ensure_schema_initialized()
    except Exception as exc:
        core_logging.log_error(exc, context={"event": "startup"})
        # Don't crash the service, but log the error


@app.get("/health")
async def health_check():
    """Health check endpoint that returns service status without leaking secrets."""
    return {
        "status": "ok",
        "service": settings.SERVICE_NAME,
        "demo_mode": settings.DEMO_MODE,
        "no_db_mode": settings.NO_DB_MODE,
        "db_connected": not settings.NO_DB_MODE,
        "llm_provider": "llama3",
        "llm_configured": bool(settings.LLAMA3_API_KEY and settings.LLAMA3_MODEL_NAME),
    }
