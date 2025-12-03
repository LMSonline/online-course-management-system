"""
Candidate generator: uses item embeddings and ANN index to propose candidates.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import List

from app.domain.models import Course
from app.encoders.item_feature_encoder import ItemFeatureEncoder
from app.encoders.user_feature_encoder import UserFeatureEncoder
from app.models.two_tower import TwoTowerModel


@dataclass
class CandidateGenerator:
    """
    Generate candidate courses for a user or for a "similar items" request.

    For now this is a thin layer over the two-tower model.
    Later we can plug in an ANN index (FAISS) for faster retrieval.
    """

    model: TwoTowerModel
    user_encoder: UserFeatureEncoder
    item_encoder: ItemFeatureEncoder

    async def generate_for_home(
        self, user_id: str, all_courses: List[Course]
    ) -> List[Course]:
        """
        Generate candidates for home page recommendations.

        TODO: Use FAISS ANN index for faster retrieval when we have many courses.
        """
        return await self.model.get_home_recommendations(user_id, all_courses)

    async def generate_similar(
        self, target: Course, all_courses: List[Course]
    ) -> List[Course]:
        """Generate similar courses for a target course."""
        return await self.model.get_similar_courses(target, all_courses)

