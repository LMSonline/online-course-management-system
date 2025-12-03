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


async def ensure_schema_initialized() -> None:
    """
    Initialize chat_sessions and chat_messages tables.

    Call this once at service startup (e.g., in main.py startup event).
    """
    from app.infra.chat_repositories import build_chat_db_dsn

    dsn = build_chat_db_dsn()
    conn = await asyncpg.connect(dsn)
    try:
        await init_chat_schema(conn)
    finally:
        await conn.close()
