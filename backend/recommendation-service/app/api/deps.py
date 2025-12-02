from functools import lru_cache

from app.infra.repositories import InMemoryCourseRepository
from app.infra.two_tower_model import TwoTowerModel
from app.services.recommendation_service import RecommendationService


@lru_cache
def get_course_repo() -> InMemoryCourseRepository:
    return InMemoryCourseRepository()


@lru_cache
def get_two_tower_model() -> TwoTowerModel:
    return TwoTowerModel()


@lru_cache
def get_recommendation_service() -> RecommendationService:
    return RecommendationService(
        course_repo=get_course_repo(),
        model=get_two_tower_model(),
    )
