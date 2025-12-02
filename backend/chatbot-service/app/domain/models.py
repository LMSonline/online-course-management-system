from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel
from .enums import Sender


class ChatSession(BaseModel):
    id: str
    user_id: str
    current_course_id: Optional[str] = None
    last_intent: Optional[str] = None
    created_at: datetime

class ChatMessage(BaseModel):
    id: str
    session_id: str
    sender: Sender
    text: str
    timestamp: datetime


class Course(BaseModel):
    id: str
    title: str
    description: str
    level: str
    tags: List[str] = []