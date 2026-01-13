"""
Context manager that persists chat sessions and messages in Postgres.

This replaces the in-memory implementation with a DB-backed one that:
- Loads sessions from Postgres
- Loads recent chat history to provide context to LLM
- Updates session state (current_course_id, last_intent) in DB
"""

from __future__ import annotations

import os
from typing import List, Optional

import asyncpg

from app.domain.models import ChatMessage, ChatSession
from app.infra.chat_repositories import (
    ChatMessageRepository,
    ChatSessionRepository,
    init_chat_schema,
)


class ContextManager:
    """
    DB-backed context manager for chat sessions.

    Loads sessions and recent messages from Postgres, and provides them
    to ChatService for building LLM context.
    """

    def __init__(
        self,
        session_repo: Optional[ChatSessionRepository] = None,
        message_repo: Optional[ChatMessageRepository] = None,
        history_limit: int = 10,
    ):
        self.session_repo = session_repo or ChatSessionRepository()
        self.message_repo = message_repo or ChatMessageRepository()
        self.history_limit = int(os.getenv("CHAT_HISTORY_LIMIT", history_limit))

    async def get_session(self, session_id: str, user_id: str) -> ChatSession:
        """
        Get or create a session.

        If session_id exists in DB, load it. Otherwise, create a new one.
        """
        session = await self.session_repo.get_session(session_id)
        if session:
            return session
        # Create new session
        return await self.session_repo.create_session(user_id=user_id)

    async def get_recent_messages(
        self, session_id: str, limit: Optional[int] = None
    ) -> List[ChatMessage]:
        """Get recent messages for building LLM context."""
        return await self.message_repo.get_recent_messages(
            session_id, limit=limit or self.history_limit
        )

    async def update_session(self, session: ChatSession) -> None:
        """Update session state in DB."""
        await self.session_repo.update_session(session)

    async def add_message(
        self,
        session_id: str,
        sender: str,
        text: str,
        metadata: Optional[dict] = None,
    ) -> ChatMessage:
        """Add a message to the session (helper for ChatService)."""
        from app.domain.enums import Sender

        sender_enum = Sender(sender) if isinstance(sender, str) else sender
        return await self.message_repo.add_message(
            session_id=session_id, sender=sender_enum, text=text, metadata=metadata
        )

    async def close(self) -> None:
        """Close DB connections."""
        await self.session_repo.close()
        await self.message_repo.close()


async def ensure_schema_initialized(max_retries: int = 30, retry_delay: float = 1.0) -> None:
    """
    Initialize chat_sessions and chat_messages tables with retry logic for Docker Compose.

    Retries connection up to max_retries times with exponential backoff.
    Call this once at service startup (e.g., in main.py startup event).
    """
    import asyncio
    from app.infra.chat_repositories import build_chat_db_dsn, get_db_host
    from app.core import logging as core_logging
    from app.core.settings import settings

    logger = core_logging.logger
    db_host = get_db_host()
    dsn = build_chat_db_dsn()
    db_port = settings.CHAT_DB_PORT if settings.CHAT_DB_PORT else settings.LMS_DB_PORT
    
    logger.info(f"Initializing chat DB schema (host: {db_host}, port: {db_port})")
    
    for attempt in range(1, max_retries + 1):
        try:
            conn = await asyncio.wait_for(asyncpg.connect(dsn), timeout=5.0)
            try:
                await init_chat_schema(conn)
                logger.info(f"Chat DB schema initialized successfully (host: {db_host})")
                return
            finally:
                await conn.close()
        except (asyncpg.exceptions.InvalidPasswordError, asyncpg.exceptions.InvalidCatalogNameError) as e:
            # These are configuration errors, don't retry
            logger.error(f"DB configuration error: {e}")
            raise
        except Exception as e:
            if attempt < max_retries:
                wait_time = retry_delay * (2 ** (attempt - 1))  # Exponential backoff
                logger.warning(f"DB connection attempt {attempt}/{max_retries} failed (host: {db_host}): {e}. Retrying in {wait_time:.1f}s...")
                await asyncio.sleep(wait_time)
            else:
                logger.error(f"Failed to connect to DB after {max_retries} attempts (host: {db_host}): {e}")
                raise
