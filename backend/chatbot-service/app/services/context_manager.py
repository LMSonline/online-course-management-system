from datetime import datetime
from typing import Dict
from app.domain.models import ChatSession


class ContextManager:
    def __init__(self):
        self.sessions: Dict[str, ChatSession] = {}

    async def get_session(self, session_id: str, user_id: str) -> ChatSession:
        if session_id not in self.sessions:
            self.sessions[session_id] = ChatSession(
                id=session_id,
                user_id=user_id,
                created_at=datetime.utcnow(),
            )
        return self.sessions[session_id]

    async def update_session(self, session: ChatSession):
        self.sessions[session.id] = session
