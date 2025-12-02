"""
Offline training script for the two-tower recommendation model.

Usage:
    python -m app.scripts.train_two_tower --config configs/two_tower.yaml

Or use default config:
    python -m app.scripts.train_two_tower

This script:
- Loads config from YAML file
- Connects to Postgres using env vars or config
- Reads interaction events from user_course_events table
- Trains PyTorch two-tower model
- Saves model weights and item embeddings
"""

from __future__ import annotations

import asyncio
import os
import sys
from pathlib import Path
from typing import Dict, List, Tuple

import torch
import torch.nn as nn
import torch.optim as optim
import yaml
from torch.utils.data import DataLoader, Dataset

# Add parent to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from app.domain.models import Course
from app.encoders import ItemFeatureEncoder, UserFeatureEncoder
from app.infra.datasets import PostgresInteractionLoader
from app.infra.repositories import InMemoryCourseRepository
from app.models.two_tower import TwoTowerTorchModel


def load_config(config_path: str | None = None) -> dict:
    """Load YAML config file."""
    if config_path is None:
        config_path = Path(__file__).parent.parent.parent / "configs" / "two_tower.yaml"
    else:
        config_path = Path(config_path)

    if not config_path.exists():
        raise FileNotFoundError(f"Config file not found: {config_path}")

    with open(config_path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def build_postgres_dsn(config: dict) -> str:
    """Build Postgres DSN from config or env vars."""
    host = config.get("db_host") or os.getenv("RS_DB_HOST", "localhost")
    port = config.get("db_port") or os.getenv("RS_DB_PORT", "5432")
    name = config.get("db_name") or os.getenv("RS_DB_NAME", "lms")
    user = config.get("db_user") or os.getenv("RS_DB_USER", "postgres")
    password = config.get("db_password") or os.getenv("RS_DB_PASSWORD", "postgres")
    return f"postgresql://{user}:{password}@{host}:{port}/{name}"


class InteractionDataset(Dataset):
    """Dataset of (user_id, positive_course_id) pairs."""

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
    """Build collate function for DataLoader with negative sampling."""
    import random

    def collate(batch: List[Tuple[str, str]]):
        user_feats: List[List[float]] = []
        pos_feats: List[List[float]] = []
        neg_feats: List[List[float]] = []

        for user_id, pos_cid in batch:
            user_feats.append(user_encoder.encode(user_id))

            pos_course = courses_by_id.get(pos_cid)
            if not pos_course:
                continue
            pos_feats.append(item_encoder.encode(pos_course))

            # Negative sampling: random course != pos
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


async def async_main(config_path: str | None = None) -> None:
    """Main training loop."""
    config = load_config(config_path)
    model_cfg = config["model"]
    train_cfg = config["training"]
    data_cfg = config.get("data", {})
    output_cfg = config.get("output", {})

    models_dir = Path(
        os.getenv("RS_MODELS_DIR", output_cfg.get("models_dir", "models"))
    )
    models_dir.mkdir(parents=True, exist_ok=True)

    # 1) Load courses
    course_repo = InMemoryCourseRepository()
    courses: List[Course] = course_repo.list_courses()
    courses_by_id: Dict[str, Course] = {c.id: c for c in courses}
    all_course_ids = list(courses_by_id.keys())

    if not all_course_ids:
        print("No courses available – aborting training.")
        return

    # 2) Load interactions from Postgres
    dsn = build_postgres_dsn(data_cfg)
    loader = PostgresInteractionLoader(dsn=dsn)
    interactions = await loader.fetch_interactions()

    # Filter by event types if specified
    event_types = data_cfg.get("event_types", ["view", "click", "enroll"])
    interactions = [ev for ev in interactions if ev.event_type in event_types]

    if not interactions:
        print("No interaction data found – aborting training.")
        return

    # Build (user_id, course_id) pairs
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

    # 4) Model
    model = TwoTowerTorchModel(
        user_input_dim=model_cfg["user_input_dim"],
        item_input_dim=model_cfg["item_input_dim"],
        embedding_dim=model_cfg["embedding_dim"],
        hidden_dims=model_cfg["hidden_dims"],
    )

    # 5) Loss & optimizer
    loss_type = train_cfg.get("loss_type", "bce")
    if loss_type == "bce":
        criterion = nn.BCEWithLogitsLoss()
    else:
        raise ValueError(f"Unsupported loss_type: {loss_type}")

    optimizer = optim.Adam(model.parameters(), lr=train_cfg["learning_rate"])

    # 6) Dataset & DataLoader
    dataset = InteractionDataset(pairs=pairs, all_course_ids=all_course_ids)
    collate_fn = build_collate_fn(user_encoder, item_encoder, courses_by_id, all_course_ids)
    dataloader = DataLoader(
        dataset,
        batch_size=train_cfg["batch_size"],
        shuffle=True,
        collate_fn=collate_fn,
    )

    # 7) Training loop
    epochs = train_cfg["epochs"]
    model.train()
    for epoch in range(epochs):
        total_loss = 0.0
        num_batches = 0

        for user_x, pos_x, neg_x in dataloader:
            if user_x.size(0) == 0:
                continue

            pos_scores, neg_scores = model(user_x, pos_x, neg_x)
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

    # 8) Save model weights
    model_path = models_dir / "two_tower_model.pt"
    torch.save(model.state_dict(), model_path)
    print(f"Saved model weights to {model_path}")

    # 9) Precompute and save item embeddings
    model.eval()
    import numpy as np

    with torch.no_grad():
        item_matrix = []
        item_ids = []
        for cid, course in courses_by_id.items():
            feats = torch.tensor([item_encoder.encode(course)], dtype=torch.float32)
            emb = model.encode_item(feats)[0]
            item_matrix.append(emb.numpy())
            item_ids.append(cid)

    item_matrix_np = np.stack(item_matrix, axis=0)
    np.save(models_dir / "item_embeddings.npy", item_matrix_np)
    with open(models_dir / "item_ids.txt", "w", encoding="utf-8") as f:
        for cid in item_ids:
            f.write(cid + "\n")

    print(f"Saved item embeddings to {models_dir}")


def main() -> None:
    """CLI entry point."""
    import sys

    config_path = sys.argv[1] if len(sys.argv) > 1 else None
    asyncio.run(async_main(config_path))


if __name__ == "__main__":
    main()
