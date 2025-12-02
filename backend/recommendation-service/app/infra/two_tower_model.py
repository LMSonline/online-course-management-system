from __future__ import annotations

from dataclasses import dataclass
from typing import List

from app.domain.models import Course
from app.infra.feature_encoders import ItemFeatureEncoder, UserFeatureEncoder


@dataclass
class TwoTowerModel:
    """
    Two-tower recommendation model (user tower + item tower).

    In this phase, the implementation is still heuristic-based, but the public
    interface matches what a real PyTorch model will expose so that we can
    swap in a trained model later without changing the rest of the service.
    """

    user_encoder: UserFeatureEncoder
    item_encoder: ItemFeatureEncoder

    async def get_home_recommendations(
        self, user_id: str, all_courses: List[Course]
    ) -> List[Course]:
        """
        Recommend courses for the home page.

        Currently: simple sort by title as a placeholder, but the method
        signature is already aligned with a learned model that scores courses
        based on user/item embeddings.
        """
        # TODO: use encoded features + learned weights once the PyTorch model exists.
        _ = self.user_encoder.encode(user_id)
        return sorted(all_courses, key=lambda c: c.title)

    async def get_similar_courses(
        self, target: Course, all_courses: List[Course]
    ) -> List[Course]:
        """
        Find courses similar to a target course.

        Currently: heuristic based on level + overlapping tags.
        Later: similarity will be computed via item-tower embeddings.
        """
        _ = self.item_encoder.encode(target)

        result: List[Course] = []
        target_tags = set(target.tags)

        for course in all_courses:
            if course.id == target.id:
                continue
            same_level = course.level == target.level
            shared_tags = len(target_tags & set(course.tags)) > 0
            if same_level or shared_tags:
                result.append(course)

        return result
