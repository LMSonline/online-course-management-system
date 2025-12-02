from functools import lru_cache

from app.encoders import ItemFeatureEncoder, UserFeatureEncoder
from app.infra.repositories import InMemoryCourseRepository
from app.models.two_tower import TwoTowerModel
from app.candidate import CandidateGenerator
from app.ranking import RankingService
from app.logging import InteractionLogger
from app.services.recommendation_service import RecommendationService


@lru_cache
def get_course_repo() -> InMemoryCourseRepository:
    return InMemoryCourseRepository()


@lru_cache
def get_user_encoder() -> UserFeatureEncoder:
    return UserFeatureEncoder()


@lru_cache
def get_item_encoder() -> ItemFeatureEncoder:
    return ItemFeatureEncoder()


@lru_cache
def get_two_tower_model() -> TwoTowerModel:
    model = TwoTowerModel(
        user_encoder=get_user_encoder(),
        item_encoder=get_item_encoder(),
    )
    # Try to load trained item embeddings if they exist on disk.
    model.load_artifacts_if_available()
    return model


@lru_cache
def get_candidate_generator() -> CandidateGenerator:
    return CandidateGenerator(
        model=get_two_tower_model(),
        user_encoder=get_user_encoder(),
        item_encoder=get_item_encoder(),
    )


@lru_cache
def get_ranking_service() -> RankingService:
    return RankingService(
        model=get_two_tower_model(),
        user_encoder=get_user_encoder(),
        item_encoder=get_item_encoder(),
    )


@lru_cache
def get_interaction_logger() -> InteractionLogger:
    return InteractionLogger()


@lru_cache
def get_recommendation_service() -> RecommendationService:
    return RecommendationService(
        course_repo=get_course_repo(),
        model=get_two_tower_model(),
        user_encoder=get_user_encoder(),
        item_encoder=get_item_encoder(),
        candidate_generator=get_candidate_generator(),
        ranking_service=get_ranking_service(),
        interaction_logger=get_interaction_logger(),
    )
