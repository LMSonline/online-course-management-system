from typing import List

from app.domain.models import Course
from app.infra.repositories import InMemoryCourseRepository
from app.infra.two_tower_model import TwoTowerModel


class RecommendationService:
    """
    Entry point cho business logic của Recommendation System.
    """

    def __init__(self, course_repo: InMemoryCourseRepository, model: TwoTowerModel):
        self.course_repo = course_repo
        self.model = model

    async def get_home_recommendations(
        self, user_id: str, top_k: int = 5
    ) -> List[Course]:
        """
        Gợi ý khóa học cho trang Home.
        """
        all_courses = self.course_repo.list_courses()
        ordered = await self.model.get_home_recommendations(user_id, all_courses)
        return ordered[:top_k]

    async def get_similar_courses(
        self, course_id: str, top_k: int = 5
    ) -> List[Course]:
        """
        Gợi ý khóa học tương tự một course đang xem.
        """
        target = self.course_repo.get_course(course_id)
        if not target:
            return []

        all_courses = self.course_repo.list_courses()
        similar = await self.model.get_similar_courses(target, all_courses)
        return similar[:top_k]
