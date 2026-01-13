"""
In-memory context manager for NO_DB_MODE.

Provides lightweight fallback that doesn't require database connections.
"""

from __future__ import annotations

from datetime import datetime
from typing import List, Optional
from uuid import uuid4

from app.domain.models import ChatMessage, ChatSession
from app.domain.enums import Sender


class InMemoryContextManager:
    """
    In-memory context manager for chat sessions (NO_DB_MODE).
    
    Stores sessions and messages in memory only. No persistence.
    """

    def __init__(self, history_limit: int = 10):
        self.history_limit = history_limit
        self._sessions: dict[str, ChatSession] = {}
        self._messages: dict[str, List[ChatMessage]] = {}  # session_id -> messages

    async def get_session(self, session_id: str, user_id: str) -> ChatSession:
        """
        Get or create a session (in-memory only).
        
        If session_id exists, return it. Otherwise, create a new one.
        """
        if session_id in self._sessions:
            return self._sessions[session_id]
        
        # Create new session
        now = datetime.utcnow()
        session = ChatSession(
            id=session_id,
            user_id=user_id,
            current_course_id=None,
            last_intent=None,
            created_at=now,
        )
        self._sessions[session_id] = session
        self._messages[session_id] = []
        return session

    async def get_recent_messages(
        self, session_id: str, limit: Optional[int] = None
    ) -> List[ChatMessage]:
        """Get recent messages for building LLM context (in-memory only)."""
        messages = self._messages.get(session_id, [])
        limit = limit or self.history_limit
        return messages[-limit:] if len(messages) > limit else messages

    async def update_session(self, session: ChatSession) -> None:
        """Update session state (in-memory only)."""
        if session.id in self._sessions:
            self._sessions[session.id] = session

    async def add_message(
        self,
        session_id: str,
        sender: Sender | str,
        text: str,
        metadata: Optional[dict] = None,
    ) -> ChatMessage:
        """Add a message to the session (in-memory only)."""
        sender_enum = Sender(sender) if isinstance(sender, str) else sender
        message_id = str(uuid4())
        now = datetime.utcnow()
        
        message = ChatMessage(
            id=message_id,
            session_id=session_id,
            sender=sender_enum,
            text=text,
            timestamp=now,
        )
        
        if session_id not in self._messages:
            self._messages[session_id] = []
        self._messages[session_id].append(message)
        
        return message

    async def close(self) -> None:
        """No-op for in-memory manager."""
        pass

