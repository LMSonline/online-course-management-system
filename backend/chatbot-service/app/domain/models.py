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