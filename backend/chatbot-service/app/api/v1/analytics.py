"""Analytics API endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from app.services.analytics_service import AnalyticsService
from app.api.deps import get_session_repo, get_message_repo
from app.core.settings import settings
from app.demo.chatbot_demo_responses import get_demo_user_stats, get_demo_global_stats


router = APIRouter()


class UserStatsResponse(BaseModel):
    """User statistics response."""
    user_id: str
    num_sessions: int
    num_messages: int
    intent_distribution: Dict[str, int]


class GlobalStatsResponse(BaseModel):
    """Global statistics response."""
    total_sessions: int
    total_messages: int
    top_intents: List[Dict[str, Any]]
    most_asked_courses: List[Dict[str, Any]]
    time_series: List[Dict[str, Any]]


class SessionSearchResult(BaseModel):
    """Session search result."""
    session_id: str
    created_at: str | None
    current_course_id: str | None
    last_intent: str | None
    matching_messages: List[Dict[str, Any]]


def get_analytics_service() -> AnalyticsService:
    """Dependency to get analytics service."""
    return AnalyticsService(
        session_repo=get_session_repo(),
        message_repo=get_message_repo(),
    )


@router.get("/stats/user/{user_id}", response_model=UserStatsResponse)
async def get_user_stats(
    user_id: str,
    analytics_service: AnalyticsService = Depends(get_analytics_service),
):
    """Get statistics for a specific user."""
    # DEMO_MODE: Return hardcoded stats
    if settings.DEMO_MODE:
        stats = get_demo_user_stats(user_id)
        return UserStatsResponse(**stats)
    
    # Normal mode: Use real analytics service
    stats = await analytics_service.get_user_stats(user_id)
    return UserStatsResponse(**stats)


@router.get("/stats/global", response_model=GlobalStatsResponse)
async def get_global_stats(
    analytics_service: AnalyticsService = Depends(get_analytics_service),
):
    """Get global statistics across all users."""
    # DEMO_MODE: Return hardcoded stats
    if settings.DEMO_MODE:
        stats = get_demo_global_stats()
        return GlobalStatsResponse(**stats)
    
    # Normal mode: Use real analytics service
    stats = await analytics_service.get_global_stats()
    return GlobalStatsResponse(**stats)


@router.get("/sessions/search", response_model=List[SessionSearchResult])
async def search_sessions(
    user_id: str,
    q: str,
    limit: int = 20,
    analytics_service: AnalyticsService = Depends(get_analytics_service),
):
    """Search sessions by message content."""
    if not q:
        raise HTTPException(status_code=400, detail="Query parameter 'q' is required")
    
    results = await analytics_service.search_sessions(user_id, q, limit=limit)
    return [SessionSearchResult(**r) for r in results]

