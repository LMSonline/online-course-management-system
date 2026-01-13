"""
Postgres repositories for chat sessions and messages.

This module provides async repositories to persist chat conversations in Postgres,
replacing the in-memory ContextManager.
"""

from __future__ import annotations

import os
from datetime import datetime
from typing import List, Optional
from uuid import uuid4

import asyncpg

from app.domain.models import ChatMessage, ChatSession
from app.domain.enums import Sender


def build_chat_db_dsn() -> str:
    """Build Postgres DSN from settings (supports Docker Compose with 'postgres' host)."""
    from app.core.settings import settings
    
    # Use CHAT_DB_* if set, otherwise fall back to LMS_DB_*
    host = settings.CHAT_DB_HOST or settings.LMS_DB_HOST
    port = settings.CHAT_DB_PORT if settings.CHAT_DB_PORT else settings.LMS_DB_PORT
    name = settings.CHAT_DB_NAME or settings.LMS_DB_NAME
    user = settings.CHAT_DB_USER or settings.LMS_DB_USER
    password = settings.CHAT_DB_PASSWORD or settings.LMS_DB_PASSWORD
    
    return f"postgresql://{user}:{password}@{host}:{port}/{name}"


def get_db_host() -> str:
    """Get the database host being used (for logging, no secrets)."""
    from app.core.settings import settings
    host = settings.CHAT_DB_HOST or settings.LMS_DB_HOST
    return host


async def init_chat_schema(conn: asyncpg.Connection) -> None:
    """
    Create chat_sessions and chat_messages tables if they don't exist.

    This should be called once at service startup (or via a migration script).
    """
    await conn.execute("""
        CREATE TABLE IF NOT EXISTS chat_sessions (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            current_course_id TEXT,
            language TEXT,
            last_intent TEXT,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
    """)
    await conn.execute("""
        CREATE TABLE IF NOT EXISTS chat_messages (
            id TEXT PRIMARY KEY,
            session_id TEXT NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
            sender TEXT NOT NULL,
            text TEXT NOT NULL,
            metadata JSONB,
            timestamp TIMESTAMP NOT NULL DEFAULT NOW()
        )
    """)
    await conn.execute("""
        CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id 
        ON chat_messages(session_id, timestamp DESC)
    """)
    await conn.execute("""
        CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id 
        ON chat_sessions(user_id, created_at DESC)
    """)


class ChatSessionRepository:
    """Repository for chat_sessions table."""

    def __init__(self, dsn: str | None = None):
        self.dsn = dsn or build_chat_db_dsn()
        self._pool: Optional[asyncpg.Pool] = None

    async def _get_pool(self) -> asyncpg.Pool:
        """Lazy initialization of connection pool."""
        if self._pool is None:
            self._pool = await asyncpg.create_pool(self.dsn, min_size=1, max_size=10)
        return self._pool

    async def close(self) -> None:
        """Close the connection pool."""
        if self._pool:
            await self._pool.close()
            self._pool = None

    async def create_session(
        self,
        user_id: str,
        current_course_id: Optional[str] = None,
        language: Optional[str] = None,
    ) -> ChatSession:
        """Create a new chat session."""
        session_id = str(uuid4())
        now = datetime.utcnow()
        pool = await self._get_pool()
        async with pool.acquire() as conn:
            await conn.execute(
                """
                INSERT INTO chat_sessions (id, user_id, current_course_id, language, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6)
                """,
                session_id,
                user_id,
                current_course_id,
                language,
                now,
                now,
            )
        return ChatSession(
            id=session_id,
            user_id=user_id,
            current_course_id=current_course_id,
            last_intent=None,
            created_at=now,
        )

    async def get_session(self, session_id: str) -> Optional[ChatSession]:
        """Get a session by ID."""
        pool = await self._get_pool()
        async with pool.acquire() as conn:
            row = await conn.fetchrow(
                """
                SELECT id, user_id, current_course_id, language, last_intent, created_at, updated_at
                FROM chat_sessions
                WHERE id = $1
                """,
                session_id,
            )
        if not row:
            return None
        return ChatSession(
            id=row["id"],
            user_id=row["user_id"],
            current_course_id=row["current_course_id"],
            last_intent=row["last_intent"],
            created_at=row["created_at"],
        )

    async def list_sessions(self, user_id: str, limit: int = 50) -> List[ChatSession]:
        """List sessions for a user, ordered by created_at DESC."""
        pool = await self._get_pool()
        async with pool.acquire() as conn:
            rows = await conn.fetch(
                """
                SELECT id, user_id, current_course_id, language, last_intent, created_at, updated_at
                FROM chat_sessions
                WHERE user_id = $1
                ORDER BY created_at DESC
                LIMIT $2
                """,
                user_id,
                limit,
            )
        return [
            ChatSession(
                id=r["id"],
                user_id=r["user_id"],
                current_course_id=r["current_course_id"],
                last_intent=r["last_intent"],
                created_at=r["created_at"],
            )
            for r in rows
        ]

    async def update_session(self, session: ChatSession) -> None:
        """Update session fields (current_course_id, last_intent, etc.)."""
        pool = await self._get_pool()
        async with pool.acquire() as conn:
            await conn.execute(
                """
                UPDATE chat_sessions
                SET current_course_id = $1, last_intent = $2, updated_at = $3
                WHERE id = $4
                """,
                session.current_course_id,
                session.last_intent,
                datetime.utcnow(),
                session.id,
            )


class ChatMessageRepository:
    """Repository for chat_messages table."""

    def __init__(self, dsn: str | None = None):
        self.dsn = dsn or build_chat_db_dsn()
        self._pool: Optional[asyncpg.Pool] = None

    async def _get_pool(self) -> asyncpg.Pool:
        """Lazy initialization of connection pool."""
        if self._pool is None:
            self._pool = await asyncpg.create_pool(self.dsn, min_size=1, max_size=10)
        return self._pool

    async def close(self) -> None:
        """Close the connection pool."""
        if self._pool:
            await self._pool.close()
            self._pool = None

    async def add_message(
        self,
        session_id: str,
        sender: Sender,
        text: str,
        metadata: Optional[dict] = None,
    ) -> ChatMessage:
        """Add a message to a session."""
        message_id = str(uuid4())
        now = datetime.utcnow()
        pool = await self._get_pool()
        async with pool.acquire() as conn:
            await conn.execute(
                """
                INSERT INTO chat_messages (id, session_id, sender, text, metadata, timestamp)
                VALUES ($1, $2, $3, $4, $5, $6)
                """,
                message_id,
                session_id,
                sender.value,
                text,
                metadata,
                now,
            )
        return ChatMessage(
            id=message_id,
            session_id=session_id,
            sender=sender,
            text=text,
            timestamp=now,
        )

    async def get_recent_messages(
        self, session_id: str, limit: int = 20
    ) -> List[ChatMessage]:
        """Get recent messages for a session, ordered by timestamp ASC."""
        pool = await self._get_pool()
        async with pool.acquire() as conn:
            rows = await conn.fetch(
                """
                SELECT id, session_id, sender, text, timestamp
                FROM chat_messages
                WHERE session_id = $1
                ORDER BY timestamp ASC
                LIMIT $2
                """,
                session_id,
                limit,
            )
        return [
            ChatMessage(
                id=r["id"],
                session_id=r["session_id"],
                sender=Sender(r["sender"]),
                text=r["text"],
                timestamp=r["timestamp"],
            )
            for r in rows
        ]

