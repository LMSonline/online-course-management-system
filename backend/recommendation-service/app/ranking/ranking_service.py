"""
Ranking service: re-ranks candidates using TwoTowerModel and extra signals.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import List

from app.domain.models import Course
from app.encoders.item_feature_encoder import ItemFeatureEncoder
from app.encoders.user_feature_encoder import UserFeatureEncoder
from app.models.two_tower import TwoTowerModel


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
        """
        Re-rank candidates for home page.

        TODO: Add re-ranker (heuristic or MLP) that considers:
        - Popularity signals
        - Recency
        - User preferences
        - Business rules
        """
        # Placeholder: return the candidates as-is (already ordered by model).
        return candidates[:top_k]

    async def rank_similar(
        self, target: Course, candidates: List[Course], top_k: int
    ) -> List[Course]:
        """Re-rank similar courses."""
        return candidates[:top_k]

