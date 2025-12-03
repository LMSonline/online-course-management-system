"""Two-tower model recommender."""

from typing import List
from app.recommenders.base import BaseRecommender
from app.domain.models import Course
from app.models.two_tower import TwoTowerModel
from app.infra.repositories import InMemoryCourseRepository


class TwoTowerRecommender(BaseRecommender):
    """Recommender using the two-tower model."""

    def __init__(
        self,
        model: TwoTowerModel,
        course_repo: InMemoryCourseRepository,
    ):
        self.model = model
        self.course_repo = course_repo

    async def get_home_recommendations(
        self, user_id: str, k: int = 5
    ) -> List[Course]:
        """Get recommendations using two-tower model."""
        all_courses = self.course_repo.list_courses()
        return await self.model.get_home_recommendations(user_id, all_courses)[:k]

    async def get_similar_courses(
        self, course_id: str, k: int = 5
    ) -> List[Course]:
        """Get similar courses using two-tower model."""
        target = self.course_repo.get_course(course_id)
        if not target:
            return []
        all_courses = self.course_repo.list_courses()
        return await self.model.get_similar_courses(target, all_courses)[:k]

