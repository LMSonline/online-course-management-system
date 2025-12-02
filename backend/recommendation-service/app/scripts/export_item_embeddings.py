"""
Export item embeddings and build FAISS index for fast ANN search.

Usage:
    python -m app.scripts.export_item_embeddings

This script:
- Loads trained model weights and item embeddings
- Builds a FAISS index (Flat or IVF) for fast similarity search
- Saves index + metadata to models_dir
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

import numpy as np

# Add parent to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

try:
    import faiss
except ImportError:
    print("Error: faiss-cpu is required. Install with: pip install faiss-cpu")
    sys.exit(1)

from app.encoders import ItemFeatureEncoder
from app.infra.repositories import InMemoryCourseRepository
from app.models.two_tower import TwoTowerTorchModel, TwoTowerModel
import torch


def main() -> None:
    """Export embeddings and build FAISS index."""
    models_dir = Path(os.getenv("RS_MODELS_DIR", "models"))

    # Check if model exists
    weights_path = models_dir / "two_tower_model.pt"
    embeddings_path = models_dir / "item_embeddings.npy"
    ids_path = models_dir / "item_ids.txt"

    if not weights_path.exists() or not embeddings_path.exists() or not ids_path.exists():
        print("Error: Trained model not found. Please run train_two_tower.py first.")
        sys.exit(1)

    # Load item embeddings
    item_embeddings = np.load(embeddings_path)
    with open(ids_path, "r", encoding="utf-8") as f:
        item_ids = [line.strip() for line in f if line.strip()]

    print(f"Loaded {len(item_ids)} item embeddings (dim={item_embeddings.shape[1]})")

    # Build FAISS index
    dim = item_embeddings.shape[1]
    # Use Flat index for small datasets, IVF for larger ones
    if len(item_ids) < 1000:
        index = faiss.IndexFlatIP(dim)  # Inner product (for cosine similarity)
    else:
        # IVF index for larger datasets
        nlist = min(100, len(item_ids) // 10)
        quantizer = faiss.IndexFlatIP(dim)
        index = faiss.IndexIVFFlat(quantizer, dim, nlist)
        index.train(item_embeddings.astype("float32"))
        index.nprobe = 10

    # Normalize embeddings for cosine similarity
    faiss.normalize_L2(item_embeddings.astype("float32"))
    index.add(item_embeddings.astype("float32"))

    # Save FAISS index
    index_path = models_dir / "item_index.faiss"
    faiss.write_index(index, str(index_path))
    print(f"Saved FAISS index to {index_path}")

    # Save metadata
    import json

    metadata = {
        "num_items": len(item_ids),
        "embedding_dim": dim,
        "index_type": "Flat" if len(item_ids) < 1000 else "IVF",
    }
    with open(models_dir / "item_index_metadata.json", "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    print("Export complete!")


if __name__ == "__main__":
    main()

