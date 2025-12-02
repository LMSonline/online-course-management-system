from typing import List, Union

from fastapi import APIRouter, Depends, Query, HTTPException

from app.domain.models import Course, RecommendedCourse, RecommendationResponse
from app.services.recommendation_service import RecommendationService
from app.api.deps import get_recommendation_service

router = APIRouter()


@router.get(
    "/recommendations/home",
    response_model=Union[List[Course], RecommendationResponse],
    summary="Get home-page course recommendations for a user",
)
async def get_home_recommendations(
    user_id: str = Query(..., description="LMS user id"),
    explain: bool = Query(False, description="Include explainable reasons"),
    strategy: str | None = Query(None, description="Recommender strategy (two_tower|popularity|content|hybrid)"),
    service: RecommendationService = Depends(get_recommendation_service),
):
    """
    Trả về danh sách khóa học gợi ý cho user trên trang Home.

    If explain=True, returns RecommendedCourse objects with human-readable reasons.
    """
    result = await service.get_home_recommendations(
        user_id=user_id, top_k=5, explain=explain, strategy=strategy
    )
    if explain:
        return RecommendationResponse(recommendations=result)
    return result


@router.get(
    "/recommendations/similar/{course_id}",
    response_model=List[Course],
    summary="Get courses similar to a given course",
)
async def get_similar_courses(
    course_id: str,
    service: RecommendationService = Depends(get_recommendation_service),
):
    """
    Trả về danh sách khóa học tương tự `course_id`.
    """
    courses = await service.get_similar_courses(course_id=course_id)
    if courses is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return courses
