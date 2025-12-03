"""
Item (course) feature encoder: builds features from course metadata.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List

from app.domain.models import Course


@dataclass
class ItemFeatureEncoder:
    """
    Encode a course into a fixed-size feature vector.

    This is also a simple deterministic encoder that uses title length, level
    and tags. It gives us a consistent representation that a real two-tower
    model can learn over once we add PyTorch training.
    """

    feature_dim: int = 32

    def encode(self, course: Course) -> List[float]:
        """
        Encode course into a feature vector.

        TODO: In production, this should:
        - Use course metadata (title, description, instructor, ratings)
        - Include content embeddings (from NLP pipeline)
        - Use learned embeddings from the item tower
        """
        values: List[float] = []

        # Title length (normalized)
        values.append(min(len(course.title) / 100.0, 1.0))

        # Description length (rough proxy for content richness)
        values.append(min(len(course.description) / 500.0, 1.0))

        # Level one-hot-ish encoding
        level_map: Dict[str, List[float]] = {
            "beginner": [1.0, 0.0, 0.0],
            "intermediate": [0.0, 1.0, 0.0],
            "advanced": [0.0, 0.0, 1.0],
        }
        values.extend(level_map.get(course.level, [0.0, 0.0, 0.0]))

        # Tags count & diversity
        num_tags = len(course.tags)
        values.append(min(num_tags / 10.0, 1.0))

        # Simple tag hashing to fill remaining dims
        remaining = self.feature_dim - len(values)
        tag_hash = abs(hash(" ".join(sorted(course.tags)))) if course.tags else 0
        for i in range(max(remaining, 0)):
            values.append(((tag_hash >> (i * 2)) & 0xFF) / 255.0)

        # Trim in case we overshoot
        return values[: self.feature_dim]

