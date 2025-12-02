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

class ChatResponse(BaseModel):
    reply: str


@router.post("/chat/messages", response_model=ChatResponse)
async def post_message(
    req: ChatRequest,
    chat_service: ChatService = Depends(get_chat_service),
):
    reply = await chat_service.handle_message(
        session_id=req.session_id,
        user_id=req.user_id,
        text=req.text,
        current_course_id=req.current_course_id,
    )
    return ChatResponse(reply=reply)