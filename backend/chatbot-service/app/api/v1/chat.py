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