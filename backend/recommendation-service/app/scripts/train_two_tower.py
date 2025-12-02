"""
Offline training script for the two-tower recommendation model.

Usage (from repo root or recommendation-service folder):

    python -m app.scripts.train_two_tower

This script:
- Connects to Postgres using env vars:
    RS_DB_HOST, RS_DB_PORT, RS_DB_NAME, RS_DB_USER, RS_DB_PASSWORD
  (you can point these to the same LMS database or a dedicated RS DB).
- Reads interaction events from a table assumed to be:
    user_course_events(user_id TEXT, course_id TEXT, event_type TEXT, timestamp TIMESTAMPTZ)
  You can adjust the loader if your schema is different.
- Builds simple user & item feature vectors via UserFeatureEncoder / ItemFeatureEncoder.
- Trains a very small two-tower model in PyTorch on CPU.
- Saves model weights and item embeddings under `models/` by default.
"""

from __future__ import annotations

import asyncio
import os
from pathlib import Path
from typing import Dict, List, Tuple

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset

from app.domain.models import Course
from app.infra.datasets import PostgresInteractionLoader
from app.infra.feature_encoders import ItemFeatureEncoder, UserFeatureEncoder
from app.infra.repositories import InMemoryCourseRepository


MODELS_DIR = Path(os.getenv("RS_MODELS_DIR", "models"))
MODELS_DIR.mkdir(parents=True, exist_ok=True)


def build_postgres_dsn() -> str:
    host = os.getenv("RS_DB_HOST", "localhost")
    port = os.getenv("RS_DB_PORT", "5432")
    name = os.getenv("RS_DB_NAME", "lms")
    user = os.getenv("RS_DB_USER", "postgres")
    password = os.getenv("RS_DB_PASSWORD", "postgres")
    return f"postgresql://{user}:{password}@{host}:{port}/{name}"


class TwoTowerTorchModel(nn.Module):
    """
    Minimal two-tower PyTorch model.

    - user tower: simple MLP over user feature vector
    - item tower: simple MLP over item feature vector
    - training objective: dot-product similarity with negative sampling
    """

    def __init__(self, user_dim: int, item_dim: int, hidden_dim: int = 64, emb_dim: int = 32):
        super().__init__()
        self.user_tower = nn.Sequential(
            nn.Linear(user_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, emb_dim),
        )
        self.item_tower = nn.Sequential(
            nn.Linear(item_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, emb_dim),
        )

    def forward(self, user_x: torch.Tensor, pos_item_x: torch.Tensor, neg_item_x: torch.Tensor):
        user_emb = self.user_tower(user_x)
        pos_emb = self.item_tower(pos_item_x)
        neg_emb = self.item_tower(neg_item_x)

        pos_scores = (user_emb * pos_emb).sum(dim=-1)
        neg_scores = (user_emb * neg_emb).sum(dim=-1)
        return pos_scores, neg_scores


class InteractionDataset(Dataset):
    """
    Simple dataset of (user_id, positive_course_id).

    Negative items are sampled on the fly in the collate_fn.
    """

    def __init__(self, pairs: List[Tuple[str, str]], all_course_ids: List[str]):
        self.pairs = pairs
        self.all_course_ids = all_course_ids

    def __len__(self) -> int:
        return len(self.pairs)

    def __getitem__(self, idx: int) -> Tuple[str, str]:
        return self.pairs[idx]


def build_collate_fn(
    user_encoder: UserFeatureEncoder,
    item_encoder: ItemFeatureEncoder,
    courses_by_id: Dict[str, Course],
    all_course_ids: List[str],
):
    import random

    def collate(batch: List[Tuple[str, str]]):
        user_feats: List[List[float]] = []
        pos_feats: List[List[float]] = []
        neg_feats: List[List[float]] = []

        for user_id, pos_cid in batch:
            # Encode user
            user_feats.append(user_encoder.encode(user_id))

            # Positive item
            pos_course = courses_by_id.get(pos_cid)
            if not pos_course:
                continue
            pos_feats.append(item_encoder.encode(pos_course))

            # Negative item sampling: random course != pos
            neg_cid = pos_cid
            while neg_cid == pos_cid:
                neg_cid = random.choice(all_course_ids)
            neg_course = courses_by_id[neg_cid]
            neg_feats.append(item_encoder.encode(neg_course))

        return (
            torch.tensor(user_feats, dtype=torch.float32),
            torch.tensor(pos_feats, dtype=torch.float32),
            torch.tensor(neg_feats, dtype=torch.float32),
        )

    return collate


async def async_main(epochs: int = 5, batch_size: int = 64) -> None:
    # 1) Load courses from repo (for now still in-memory; later this can be a DB-backed repo)
    course_repo = InMemoryCourseRepository()
    courses: List[Course] = course_repo.list_courses()
    courses_by_id: Dict[str, Course] = {c.id: c for c in courses}
    all_course_ids = list(courses_by_id.keys())

    if not all_course_ids:
        print("No courses available – aborting training.")
        return

    # 2) Load interactions from Postgres
    dsn = build_postgres_dsn()
    loader = PostgresInteractionLoader(dsn=dsn)
    interactions = await loader.fetch_interactions()
    if not interactions:
        print("No interaction data found in user_course_events – aborting training.")
        return

    # Build (user_id, course_id) pairs; ignore events for unknown courses
    pairs: List[Tuple[str, str]] = []
    for ev in interactions:
        if ev.course_id in courses_by_id:
            pairs.append((ev.user_id, ev.course_id))

    if not pairs:
        print("No interactions match known courses – aborting training.")
        return

    print(f"Loaded {len(pairs)} interactions for training over {len(courses)} courses.")

    # 3) Encoders
    user_encoder = UserFeatureEncoder()
    item_encoder = ItemFeatureEncoder()

    user_dim = user_encoder.feature_dim
    item_dim = item_encoder.feature_dim

    # 4) Model, loss, optimizer
    model = TwoTowerTorchModel(user_dim=user_dim, item_dim=item_dim)
    criterion = nn.BCEWithLogitsLoss()
    optimizer = optim.Adam(model.parameters(), lr=1e-3)

    # 5) Dataset & DataLoader
    dataset = InteractionDataset(pairs=pairs, all_course_ids=all_course_ids)
    collate_fn = build_collate_fn(user_encoder, item_encoder, courses_by_id, all_course_ids)
    dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True, collate_fn=collate_fn)

    # 6) Training loop
    model.train()
    for epoch in range(epochs):
        total_loss = 0.0
        num_batches = 0

        for user_x, pos_x, neg_x in dataloader:
            if user_x.size(0) == 0:
                continue

            pos_scores, neg_scores = model(user_x, pos_x, neg_x)
            # Labels: 1 for positive, 0 for negative
            y_pos = torch.ones_like(pos_scores)
            y_neg = torch.zeros_like(neg_scores)

            loss = criterion(pos_scores, y_pos) + criterion(neg_scores, y_neg)

            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            total_loss += loss.item()
            num_batches += 1

        avg_loss = total_loss / max(num_batches, 1)
        print(f"Epoch {epoch + 1}/{epochs} - loss={avg_loss:.4f}")

    # 7) Save model weights
    model_path = MODELS_DIR / "two_tower_model.pt"
    torch.save(model.state_dict(), model_path)
    print(f"Saved model weights to {model_path}")

    # 8) Precompute and save item embeddings
    model.eval()
    with torch.no_grad():
        item_matrix = []
        item_ids = []
        for cid, course in courses_by_id.items():
            feats = torch.tensor([item_encoder.encode(course)], dtype=torch.float32)
            emb = model.item_tower(feats)[0]
            item_matrix.append(emb.numpy())
            item_ids.append(cid)

    import numpy as np

    item_matrix_np = np.stack(item_matrix, axis=0)
    np.save(MODELS_DIR / "item_embeddings.npy", item_matrix_np)
    with open(MODELS_DIR / "item_ids.txt", "w", encoding="utf-8") as f:
        for cid in item_ids:
            f.write(cid + "\n")

    print(f"Saved item embeddings to {MODELS_DIR}")


def main() -> None:
    asyncio.run(async_main())


if __name__ == "__main__":
    main()


