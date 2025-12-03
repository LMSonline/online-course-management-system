"""
API endpoints for chat sessions and messages.

GET /api/v1/chat/sessions - list sessions for a user
GET /api/v1/chat/sessions/{session_id} - get session details + messages
"""

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel

from app.domain.models import ChatMessage, ChatSession
from app.infra.chat_repositories import ChatMessageRepository, ChatSessionRepository
from app.api.deps import get_session_repo, get_message_repo

router = APIRouter()


class SessionResponse(BaseModel):
    """Response model for a single session."""
    id: str
    user_id: str
    current_course_id: Optional[str]
    last_intent: Optional[str]
    created_at: str  # ISO format


class MessageResponse(BaseModel):
    """Response model for a single message."""
    id: str
    session_id: str
    sender: str
    text: str
    timestamp: str  # ISO format


class SessionDetailResponse(BaseModel):
    """Response model for session with messages."""
    session: SessionResponse
    messages: List[MessageResponse]


@router.get("/chat/sessions", response_model=List[SessionResponse])
async def list_sessions(
    user_id: str = Query(..., description="LMS user ID"),
    limit: int = Query(50, ge=1, le=100, description="Max number of sessions to return"),
    session_repo: ChatSessionRepository = Depends(get_session_repo),
):
    """
    List chat sessions for a given user, ordered by created_at DESC.
    """
    sessions = await session_repo.list_sessions(user_id, limit=limit)
    return [
        SessionResponse(
            id=s.id,
            user_id=s.user_id,
            current_course_id=s.current_course_id,
            last_intent=s.last_intent,
            created_at=s.created_at.isoformat(),
        )
        for s in sessions
    ]


@router.get("/chat/sessions/{session_id}", response_model=SessionDetailResponse)
async def get_session_detail(
    session_id: str,
    session_repo: ChatSessionRepository = Depends(get_session_repo),
    message_repo: ChatMessageRepository = Depends(get_message_repo),
):
    """
    Get a session by ID, including all messages.
    """
    session = await session_repo.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    messages = await message_repo.get_recent_messages(session_id, limit=100)

    return SessionDetailResponse(
        session=SessionResponse(
            id=session.id,
            user_id=session.user_id,
            current_course_id=session.current_course_id,
            last_intent=session.last_intent,
            created_at=session.created_at.isoformat(),
        ),
        messages=[
            MessageResponse(
                id=m.id,
                session_id=m.session_id,
                sender=m.sender.value,
                text=m.text,
                timestamp=m.timestamp.isoformat(),
            )
            for m in messages
        ],
    )

