from typing import List

from app.domain.models import Course
from app.infra.repositories import InMemoryCourseRepository
from app.models.two_tower import TwoTowerModel
from app.encoders import UserFeatureEncoder, ItemFeatureEncoder
from app.candidate import CandidateGenerator
from app.ranking import RankingService
from app.logging import InteractionLogger


class RecommendationService:
    """
    Entry point cho business logic của Recommendation System.

    Lớp này chủ yếu orchestrate các component con:
    - CandidateGenerator: sinh danh sách ứng viên
    - RankingService: xếp hạng
    - InteractionLogger: ghi log tương tác (sau này dùng cho training)
    """

    def __init__(
        self,
        course_repo: InMemoryCourseRepository,
        model: TwoTowerModel,
        user_encoder: UserFeatureEncoder,
        item_encoder: ItemFeatureEncoder,
        candidate_generator: CandidateGenerator,
        ranking_service: RankingService,
        interaction_logger: InteractionLogger,
    ) -> None:
        self.course_repo = course_repo
        self.model = model
        self.user_encoder = user_encoder
        self.item_encoder = item_encoder
        self.candidate_generator = candidate_generator
        self.ranking_service = ranking_service
        self.interaction_logger = interaction_logger

    async def get_home_recommendations(
        self, user_id: str, top_k: int = 5
    ) -> List[Course]:
        """
        Gợi ý khóa học cho trang Home.
        """
        all_courses = self.course_repo.list_courses()
        candidates = await self.candidate_generator.generate_for_home(
            user_id=user_id, all_courses=all_courses
        )
        ranked = await self.ranking_service.rank_for_home(
            user_id=user_id, candidates=candidates, top_k=top_k
        )
        await self.interaction_logger.log_recommendations(
            user_id=user_id, courses=ranked, source="home"
        )
        return ranked

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
        candidates = await self.candidate_generator.generate_similar(
            target=target, all_courses=all_courses
        )
        ranked = await self.ranking_service.rank_similar(
            target=target, candidates=candidates, top_k=top_k
        )
        self.interaction_logger.log_similar_view(course_id=course_id, courses=ranked)
        return ranked
