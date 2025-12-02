"""Analytics API endpoints for recommendation system."""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Dict, Any
from app.services.analytics_service import AnalyticsService


router = APIRouter()


class UserStatsResponse(BaseModel):
    """User statistics response."""
    user_id: str
    num_recommendations: int
    num_clicks: int
    num_enrolls: int
    ctr: float
    top_categories: List[str]


class GlobalStatsResponse(BaseModel):
    """Global statistics response."""
    global_ctr: float
    most_popular_courses: List[Dict[str, Any]]
    strategy_distribution: List[Dict[str, Any]]
    daily_stats: List[Dict[str, Any]]


def get_analytics_service() -> AnalyticsService:
    """Dependency to get analytics service."""
    return AnalyticsService()


@router.get("/stats/user/{user_id}", response_model=UserStatsResponse)
async def get_user_stats(
    user_id: str,
    analytics_service: AnalyticsService = Depends(get_analytics_service),
):
    """Get statistics for a specific user."""
    stats = await analytics_service.get_user_stats(user_id)
    return UserStatsResponse(**stats)


@router.get("/stats/global", response_model=GlobalStatsResponse)
async def get_global_stats(
    analytics_service: AnalyticsService = Depends(get_analytics_service),
):
    """Get global statistics across all users."""
    stats = await analytics_service.get_global_stats()
    return GlobalStatsResponse(**stats)

