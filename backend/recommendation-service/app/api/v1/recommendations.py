from typing import List

from fastapi import APIRouter, Depends, Query, HTTPException

from app.domain.models import Course
from app.services.recommendation_service import RecommendationService
from app.api.deps import get_recommendation_service

router = APIRouter()


@router.get(
    "/recommendations/home",
    response_model=List[Course],
    summary="Get home-page course recommendations for a user",
)
async def get_home_recommendations(
    user_id: str = Query(..., description="LMS user id"),
    service: RecommendationService = Depends(get_recommendation_service),
):
    """
    Trả về danh sách khóa học gợi ý cho user trên trang Home.
    """
    return await service.get_home_recommendations(user_id=user_id)


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
