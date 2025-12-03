"""
PyTorch implementation of two-tower recommendation model.

User tower: MLP that takes user features -> user embedding
Item tower: MLP that takes item features -> item embedding
Similarity: dot product between user and item embeddings
"""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import List, Optional

import numpy as np
import torch
import torch.nn as nn

from app.domain.models import Course
from app.encoders.item_feature_encoder import ItemFeatureEncoder
from app.encoders.user_feature_encoder import UserFeatureEncoder


class UserTower(nn.Module):
    """User tower: MLP that maps user features to embedding."""

    def __init__(self, input_dim: int, embedding_dim: int, hidden_dims: List[int]):
        super().__init__()
        layers = []
        prev_dim = input_dim
        for hidden_dim in hidden_dims:
            layers.extend([nn.Linear(prev_dim, hidden_dim), nn.ReLU()])
            prev_dim = hidden_dim
        layers.append(nn.Linear(prev_dim, embedding_dim))
        self.net = nn.Sequential(*layers)

    def forward(self, user_features: torch.Tensor) -> torch.Tensor:
        return self.net(user_features)


class ItemTower(nn.Module):
    """Item tower: MLP that maps item features to embedding."""

    def __init__(self, input_dim: int, embedding_dim: int, hidden_dims: List[int]):
        super().__init__()
        layers = []
        prev_dim = input_dim
        for hidden_dim in hidden_dims:
            layers.extend([nn.Linear(prev_dim, hidden_dim), nn.ReLU()])
            prev_dim = hidden_dim
        layers.append(nn.Linear(prev_dim, embedding_dim))
        self.net = nn.Sequential(*layers)

    def forward(self, item_features: torch.Tensor) -> torch.Tensor:
        return self.net(item_features)


class TwoTowerTorchModel(nn.Module):
    """
    PyTorch two-tower model for training.

    This is the trainable model used in training scripts.
    """

    def __init__(
        self,
        user_input_dim: int,
        item_input_dim: int,
        embedding_dim: int = 64,
        hidden_dims: List[int] = [128, 64],
    ):
        super().__init__()
        self.user_tower = UserTower(user_input_dim, embedding_dim, hidden_dims)
        self.item_tower = ItemTower(item_input_dim, embedding_dim, hidden_dims)
        self.embedding_dim = embedding_dim

    def encode_user(self, user_features: torch.Tensor) -> torch.Tensor:
        """Encode user features to embedding."""
        return self.user_tower(user_features)

    def encode_item(self, item_features: torch.Tensor) -> torch.Tensor:
        """Encode item features to embedding."""
        return self.item_tower(item_features)

    def score(self, user_vec: torch.Tensor, item_vec: torch.Tensor) -> torch.Tensor:
        """Compute similarity score (dot product)."""
        return (user_vec * item_vec).sum(dim=-1)


@dataclass
class TwoTowerModel:
    """
    Wrapper around trained two-tower model for online inference.

    Loads PyTorch weights and precomputed item embeddings, and provides
    methods for scoring and similarity search.
    """

    user_encoder: UserFeatureEncoder
    item_encoder: ItemFeatureEncoder
    models_dir: Path = field(default_factory=lambda: Path("models"))

    # Optional loaded artifacts from offline training
    _torch_model: Optional[TwoTowerTorchModel] = field(
        default=None, init=False, repr=False
    )
    _item_embeddings: Optional[np.ndarray] = field(
        default=None, init=False, repr=False
    )
    _item_ids: Optional[List[str]] = field(default=None, init=False, repr=False)

    def load_artifacts_if_available(self) -> None:
        """
        Lazily load trained artifacts (PyTorch weights + item embeddings) if present.

        This is safe to call multiple times; it will only load once.
        The online service can start even if no model has been trained yet.
        """
        if self._item_embeddings is not None:
            return

        emb_path = self.models_dir / "item_embeddings.npy"
        ids_path = self.models_dir / "item_ids.txt"
        weights_path = self.models_dir / "two_tower_model.pt"

        if not emb_path.exists() or not ids_path.exists():
            # No trained model yet – keep running with heuristic fallbacks.
            return

        self._item_embeddings = np.load(emb_path)
        with open(ids_path, "r", encoding="utf-8") as f:
            self._item_ids = [line.strip() for line in f if line.strip()]

        # Load PyTorch model if weights exist
        if weights_path.exists():
            user_input_dim = self.user_encoder.feature_dim
            item_input_dim = self.item_encoder.feature_dim
            embedding_dim = self._item_embeddings.shape[1]

            self._torch_model = TwoTowerTorchModel(
                user_input_dim=user_input_dim,
                item_input_dim=item_input_dim,
                embedding_dim=embedding_dim,
            )
            self._torch_model.load_state_dict(torch.load(weights_path, map_location="cpu"))
            self._torch_model.eval()

    async def get_home_recommendations(
        self, user_id: str, all_courses: List[Course]
    ) -> List[Course]:
        """
        Recommend courses for the home page using trained embeddings.
        """
        user_features = np.asarray(
            self.user_encoder.encode(user_id), dtype=np.float32
        )

        if self._item_embeddings is None or self._item_ids is None:
            # Fallback: simple sort by title
            return sorted(all_courses, key=lambda c: c.title)

        # Encode user via PyTorch model if available, else use feature vector directly
        if self._torch_model is not None:
            with torch.no_grad():
                user_tensor = torch.FloatTensor(user_features).unsqueeze(0)
                user_emb = self._torch_model.encode_user(user_tensor).numpy()[0]
        else:
            # Fallback: use feature vector as embedding (not ideal, but works)
            user_emb = user_features

        # Map course_id -> index in embedding matrix
        id_to_idx = {cid: idx for idx, cid in enumerate(self._item_ids)}

        # Build matrix of candidate embeddings
        cand_indices = [id_to_idx[c.id] for c in all_courses if c.id in id_to_idx]
        if not cand_indices:
            return sorted(all_courses, key=lambda c: c.title)

        cand_embs = self._item_embeddings[cand_indices]  # shape [N, D]

        # Compute dot-product scores
        scores = cand_embs @ user_emb

        # Pair each course with its score
        scored = list(
            zip(
                [c for c in all_courses if c.id in id_to_idx],
                scores,
            )
        )
        scored.sort(key=lambda x: float(x[1]), reverse=True)
        return [c for c, _ in scored]

    async def get_similar_courses(
        self, target: Course, all_courses: List[Course]
    ) -> List[Course]:
        """
        Find courses similar to a target course using item embeddings.
        """
        target_features = np.asarray(
            self.item_encoder.encode(target), dtype=np.float32
        )

        if self._item_embeddings is None or self._item_ids is None:
            # Heuristic fallback
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

        # Encode target via PyTorch model if available
        if self._torch_model is not None:
            with torch.no_grad():
                target_tensor = torch.FloatTensor(target_features).unsqueeze(0)
                target_emb = self._torch_model.encode_item(target_tensor).numpy()[0]
        else:
            target_emb = target_features

        # Similarity in embedding space
        id_to_idx = {cid: idx for idx, cid in enumerate(self._item_ids)}
        cand_courses: List[Course] = []
        cand_embs: List[np.ndarray] = []

        for c in all_courses:
            if c.id == target.id:
                continue
            idx = id_to_idx.get(c.id)
            if idx is None:
                continue
            cand_courses.append(c)
            cand_embs.append(self._item_embeddings[idx])

        if not cand_courses:
            return []

        cand_matrix = np.stack(cand_embs, axis=0)
        scores = cand_matrix @ target_emb
        scored = list(zip(cand_courses, scores))
        scored.sort(key=lambda x: float(x[1]), reverse=True)
        return [c for c, _ in scored]

