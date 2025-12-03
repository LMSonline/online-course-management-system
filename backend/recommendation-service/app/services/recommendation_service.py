from typing import List, Optional

from app.domain.models import Course, RecommendedCourse
from app.infra.repositories import InMemoryCourseRepository
from app.models.two_tower import TwoTowerModel
from app.encoders import UserFeatureEncoder, ItemFeatureEncoder
from app.candidate import CandidateGenerator
from app.ranking import RankingService
from app.logging import InteractionLogger
from app.services.recommender_factory import RecommenderFactory
from app.online.update import OnlineUpdateService


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
        online_update_service: Optional[OnlineUpdateService] = None,
    ) -> None:
        self.course_repo = course_repo
        self.model = model
        self.user_encoder = user_encoder
        self.item_encoder = item_encoder
        self.candidate_generator = candidate_generator
        self.ranking_service = ranking_service
        self.interaction_logger = interaction_logger
        self.online_update_service = online_update_service
        
        # Create recommender factory
        self.recommender_factory = RecommenderFactory(
            course_repo=course_repo,
            model=model,
            user_encoder=user_encoder,
            item_encoder=item_encoder,
        )

    async def get_home_recommendations(
        self,
        user_id: str,
        top_k: int = 5,
        explain: bool = False,
        strategy: Optional[str] = None,
    ) -> List[Course] | List[RecommendedCourse]:
        """
        Gợi ý khóa học cho trang Home.

        Args:
            user_id: LMS user ID
            top_k: Number of recommendations to return
            explain: If True, return RecommendedCourse with reasons
            strategy: Recommender strategy (two_tower, popularity, content, hybrid)

        Returns:
            List of Course or RecommendedCourse (if explain=True)
        """
        # Use new recommender system if strategy is provided, otherwise use legacy
        if strategy or self.online_update_service:
            # Select strategy (from bandit if online learning is enabled)
            if self.online_update_service:
                selected_strategy = await self.online_update_service.get_bandit_recommendation()
            else:
                selected_strategy = strategy
            
            # Get recommender
            recommender = self.recommender_factory.get_recommender(selected_strategy)
            
            # Get recommendations
            ranked = await recommender.get_home_recommendations(user_id, k=top_k)
            
            # Log with strategy metadata
            await self.interaction_logger.log_recommendations(
                user_id=user_id,
                courses=ranked,
                source="home",
                metadata={"strategy": selected_strategy},
            )
            
            if explain:
                return await self._explain_recommendations(user_id, ranked)
            return ranked
        else:
            # Legacy path (backward compatibility)
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

            if explain:
                return await self._explain_recommendations(user_id, ranked)
            return ranked

    async def _explain_recommendations(
        self, user_id: str, courses: List[Course]
    ) -> List[RecommendedCourse]:
        """
        Generate explainable reasons for recommendations.

        TODO: In production, this should:
        - Look at user's past interactions (courses viewed/enrolled)
        - Match course features (level, tags) with user preferences
        - Use learned signals from the model
        """
        # Simple heuristic-based explanation for now
        explained = []
        for course in courses:
            # Compute a simple score (placeholder)
            score = 0.5  # TODO: get actual score from model

            # Generate reason based on course features
            reasons = []
            if course.level == "beginner":
                reasons.append("suitable for beginners")
            if course.tags:
                reasons.append(f"covers topics: {', '.join(course.tags[:2])}")

            reason = (
                f"Recommended because it's {', '.join(reasons)}"
                if reasons
                else "Recommended based on your learning profile"
            )

            explained.append(
                RecommendedCourse(course=course, score=score, reason=reason)
            )

        return explained

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
