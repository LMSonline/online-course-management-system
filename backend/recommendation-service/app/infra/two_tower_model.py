from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import List, Optional

import numpy as np
import torch

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
    models_dir: Path = field(default_factory=lambda: Path("models"))

    # Optional loaded artifacts from offline training
    _item_embeddings: Optional[np.ndarray] = field(default=None, init=False, repr=False)
    _item_ids: Optional[List[str]] = field(default=None, init=False, repr=False)
    _torch_state_dict: Optional[dict] = field(default=None, init=False, repr=False)

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

        if not emb_path.exists() or not ids_path.exists():
            # No trained model yet – keep running with heuristic fallbacks.
            return

        self._item_embeddings = np.load(emb_path)
        with open(ids_path, "r", encoding="utf-8") as f:
            self._item_ids = [line.strip() for line in f if line.strip()]

    async def get_home_recommendations(
        self, user_id: str, all_courses: List[Course]
    ) -> List[Course]:
        """
        Recommend courses for the home page.

        Currently: simple sort by title as a placeholder, but the method
        signature is already aligned with a learned model that scores courses
        based on user/item embeddings.
        """
        # If we don't have trained embeddings yet, fall back to simple sort.
        user_vec = np.asarray(self.user_encoder.encode(user_id), dtype=np.float32)

        if self._item_embeddings is None or self._item_ids is None:
            return sorted(all_courses, key=lambda c: c.title)

        # Map course_id -> index in embedding matrix
        id_to_idx = {cid: idx for idx, cid in enumerate(self._item_ids)}

        # Build matrix of candidate embeddings for the provided courses
        cand_indices = [id_to_idx[c.id] for c in all_courses if c.id in id_to_idx]
        if not cand_indices:
            return sorted(all_courses, key=lambda c: c.title)

        cand_embs = self._item_embeddings[cand_indices]  # shape [N, D]

        # Compute dot-product scores
        scores = cand_embs @ user_vec

        # Pair each course with its score
        scored = list(zip([all_courses[i] for i, c in enumerate(all_courses) if c.id in id_to_idx], scores))
        scored.sort(key=lambda x: float(x[1]), reverse=True)
        return [c for c, _ in scored]

    async def get_similar_courses(
        self, target: Course, all_courses: List[Course]
    ) -> List[Course]:
        """
        Find courses similar to a target course.

        Currently: heuristic based on level + overlapping tags.
        Later: similarity will be computed via item-tower embeddings.
        """
        target_vec = np.asarray(self.item_encoder.encode(target), dtype=np.float32)

        if self._item_embeddings is None or self._item_ids is None:
            # Heuristic fallback based on level + tags
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

        # Similarity in embedding space (cosine or dot-product, here dot-product)
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
        scores = cand_matrix @ target_vec
        scored = list(zip(cand_courses, scores))
        scored.sort(key=lambda x: float(x[1]), reverse=True)
        return [c for c, _ in scored]
