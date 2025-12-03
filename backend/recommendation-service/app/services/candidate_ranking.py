from __future__ import annotations

from dataclasses import dataclass
from typing import List

from app.domain.models import Course
from app.infra.feature_encoders import ItemFeatureEncoder, UserFeatureEncoder
from app.infra.two_tower_model import TwoTowerModel


@dataclass
class CandidateGenerator:
    """
    Generate candidate courses for a user or for a "similar items" request.

    For now this is a very thin layer over the two-tower model and the
    in-memory course repository. Later we can plug in an ANN index (FAISS)
    and/or a separate candidate generation strategy.
    """

    model: TwoTowerModel
    user_encoder: UserFeatureEncoder
    item_encoder: ItemFeatureEncoder

    async def generate_for_home(
        self, user_id: str, all_courses: List[Course]
    ) -> List[Course]:
        # Delegate to the model; later this can use precomputed item vectors.
        return await self.model.get_home_recommendations(user_id, all_courses)

    async def generate_similar(
        self, target: Course, all_courses: List[Course]
    ) -> List[Course]:
        return await self.model.get_similar_courses(target, all_courses)


@dataclass
class RankingService:
    """
    Rank candidate courses according to the two-tower model.

    Right now this simply preserves the order from the underlying model, but
    the structure allows us to plug in more advanced scoring and business
    rules later without touching the FastAPI endpoints.
    """

    model: TwoTowerModel
    user_encoder: UserFeatureEncoder
    item_encoder: ItemFeatureEncoder

    async def rank_for_home(
        self, user_id: str, candidates: List[Course], top_k: int
    ) -> List[Course]:
        # Placeholder: return the candidates as-is (already ordered by model).
        return candidates[:top_k]

    async def rank_similar(
        self, target: Course, candidates: List[Course], top_k: int
    ) -> List[Course]:
        return candidates[:top_k]


@dataclass
class InteractionLogger:
    """
    Log basic recommendation interactions.

    Initially this just logs to stdout so we can see what the system is doing.
    Later this can be extended to write into Postgres (e.g. user_course_events
    table) to be used by the training pipeline.
    """

    def log_recommendations(self, user_id: str, courses: List[Course]) -> None:
        ids = [c.id for c in courses]
        print(f"[InteractionLogger] user={user_id} home_recs={ids}")

    def log_similar_view(self, course_id: str, courses: List[Course]) -> None:
        ids = [c.id for c in courses]
        print(f"[InteractionLogger] similar_for={course_id} results={ids}")


