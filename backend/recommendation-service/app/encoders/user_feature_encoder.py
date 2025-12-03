"""
User feature encoder: builds dense features from user profile & history.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import List


@dataclass
class UserFeatureEncoder:
    """
    Encode a user into a fixed-size feature vector.

    For now this is a very simple, deterministic encoder so that the service
    can run without any trained model. Later, this will be replaced / extended
    by a learned embedding model (the user tower of the two-tower network).
    """

    feature_dim: int = 16

    def encode(self, user_id: str) -> List[float]:
        """
        Encode user_id into a feature vector.

        TODO: In production, this should:
        - Load user profile from DB (age, preferences, etc.)
        - Aggregate interaction history (courses viewed, enrolled, completed)
        - Use learned embeddings from the user tower
        """
        # Simple hashed features based on user_id
        # (placeholder until we have real behavioral features).
        base = abs(hash(user_id))
        return [
            ((base >> i) & 0xFF) / 255.0 for i in range(self.feature_dim)
        ]

