from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.api.v1 import (
    chat as chat_router,
    sessions as sessions_router,
    admin as admin_router,
)
from app.services.context_manager import ensure_schema_initialized

logger = logging.getLogger(__name__)

app = FastAPI(
    title="Chatbot Service",
    version="1.0.0",
    description="NLP chatbot for LMS (RAG + LLM + recommendations).",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # sau này có thể thu hẹp
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router.router, prefix="/api/v1", tags=["chatbot"])
app.include_router(sessions_router.router, prefix="/api/v1", tags=["sessions"])
app.include_router(admin_router.router, prefix="/api/v1", tags=["admin"])


@app.on_event("startup")
async def startup_event():
    """Initialize DB schema for chat_sessions and chat_messages on startup."""
    try:
        await ensure_schema_initialized()
        logger.info("Chat DB schema initialized successfully")
    except Exception as exc:
        logger.error("Failed to initialize chat DB schema: %s", exc)
        # Don't crash the service, but log the error


@app.get("/health")
async def health_check():
    return {"status": "ok"}
