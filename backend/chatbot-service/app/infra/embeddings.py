from __future__ import annotations

import os
from dataclasses import dataclass
from typing import List

import numpy as np
from sentence_transformers import SentenceTransformer


@dataclass
class EmbeddingModel:
    """
    Thin wrapper around a local sentence-transformers model for text embeddings.

    The concrete model can be selected via env var:
    - CHATBOT_EMBEDDING_MODEL (default: 'all-MiniLM-L6-v2')
    """

    model_name: str | None = None
    _model: SentenceTransformer | None = None

    def _get_model(self) -> SentenceTransformer:
        if self._model is None:
            name = self.model_name or os.getenv(
                "CHATBOT_EMBEDDING_MODEL", "all-MiniLM-L6-v2"
            )
            self._model = SentenceTransformer(name)
        return self._model

    def encode(self, texts: List[str]) -> np.ndarray:
        model = self._get_model()
        return np.asarray(model.encode(texts, convert_to_numpy=True))


