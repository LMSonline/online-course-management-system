from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Dict

router = APIRouter()

# Dummy in-memory data for demo (replace with real DB query in production)
USER_LEARNING_LOGS = {
    # user_id: list of (datetime, minutes)
    "1": [
        (datetime(2026, 1, 5, 10, 0), 30),
        (datetime(2026, 1, 6, 11, 0), 20),
        (datetime(2026, 1, 7, 9, 0), 35),
    ],
    # ...
}

class LearningTimeResponse(BaseModel):
    user_id: str
    week_minutes: int
    week_goal: int = 120

@router.get("/learning-time/{user_id}", response_model=LearningTimeResponse)
def get_learning_time(user_id: str) -> LearningTimeResponse:
    now = datetime.utcnow()
    # Start of week (Monday)
    start_of_week = now - timedelta(days=now.weekday())
    logs = USER_LEARNING_LOGS.get(user_id, [])
    week_minutes = sum(
        minutes for dt, minutes in logs if dt >= start_of_week
    )
    return LearningTimeResponse(user_id=user_id, week_minutes=week_minutes, week_goal=120)
