from __future__ import annotations

import os
import hashlib
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import List

import numpy as np

from app.core.settings import settings


class EmbeddingBackend(ABC):
    """Abstract base class for embedding backends."""
    
    @abstractmethod
    def encode(self, texts: List[str]) -> np.ndarray:
        """Encode texts into embeddings."""
        pass


class DummyEmbeddingBackend(EmbeddingBackend):
    """
    Dummy embedding backend that generates deterministic embeddings without network calls.
    
    Uses a hash-based approach to generate reproducible embeddings for demo/offline use.
    """
    
    def __init__(self, embedding_dim: int = 384):
        """
        Initialize dummy embedding backend.
        
        Args:
            embedding_dim: Dimension of embeddings (default: 384, matches all-MiniLM-L6-v2)
        """
        self.embedding_dim = embedding_dim
    
    def encode(self, texts: List[str]) -> np.ndarray:
        """
        Generate deterministic embeddings from text using hash-based approach.
        
        Args:
            texts: List of text strings to encode
            
        Returns:
            numpy array of shape (len(texts), embedding_dim)
        """
        embeddings = []
        for text in texts:
            # Use hash to generate deterministic but pseudo-random vector
            # Hash the text to get a seed
            text_hash = hashlib.sha256(text.encode('utf-8')).digest()
            
            # Use first 4 bytes as seed for reproducibility
            seed = int.from_bytes(text_hash[:4], byteorder='big')
            np.random.seed(seed)
            
            # Generate normalized random vector
            vec = np.random.randn(self.embedding_dim).astype(np.float32)
            # Normalize to unit length (common for embeddings)
            vec = vec / (np.linalg.norm(vec) + 1e-8)
            
            embeddings.append(vec)
        
        return np.asarray(embeddings)


class SentenceTransformerBackend(EmbeddingBackend):
    """
    Sentence-transformers based embedding backend.
    
    Requires network access to download models from HuggingFace on first use.
    """
    
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        """
        Initialize sentence-transformers backend.
        
        Args:
            model_name: Name of the sentence-transformers model
        """
        self.model_name = model_name
        self._model = None
    
    def _get_model(self):
        """Lazy load the sentence-transformers model."""
        if self._model is None:
            try:
                from sentence_transformers import SentenceTransformer
                self._model = SentenceTransformer(self.model_name)
            except Exception as e:
                raise RuntimeError(
                    f"Failed to load sentence-transformers model '{self.model_name}'. "
                    f"This requires network access to download the model from HuggingFace. "
                    f"Error: {e}\n"
                    f"To use offline mode, set EMBEDDING_BACKEND=dummy"
                ) from e
        return self._model
    
    def encode(self, texts: List[str]) -> np.ndarray:
        """
        Encode texts using sentence-transformers.
        
        Args:
            texts: List of text strings to encode
            
        Returns:
            numpy array of embeddings
        """
        model = self._get_model()
        return np.asarray(model.encode(texts, convert_to_numpy=True))


@dataclass
class EmbeddingModel:
    """
    Embedding model that supports multiple backends.
    
    Backends:
    - dummy: Offline, deterministic embeddings (no network required)
    - sentence_transformers: Uses sentence-transformers library (requires network for first download)
    
    Configure via EMBEDDING_BACKEND env var (default: "dummy" in dev mode).
    """

    backend: EmbeddingBackend | None = None
    model_name: str | None = None

    def __post_init__(self):
        """Initialize the embedding backend based on settings."""
        # Only initialize if backend was not explicitly provided
        if self.backend is None:
            backend_type = settings.EMBEDDING_BACKEND.lower()
            
            if backend_type == "dummy":
                self.backend = DummyEmbeddingBackend(
                    embedding_dim=settings.EMBEDDING_DIM
                )
            elif backend_type == "sentence_transformers":
                model_name = self.model_name or settings.CHATBOT_EMBEDDING_MODEL
                self.backend = SentenceTransformerBackend(model_name=model_name)
            else:
                raise ValueError(
                    f"Unknown EMBEDDING_BACKEND: {backend_type}. "
                    f"Supported values: 'dummy', 'sentence_transformers'"
                )

    def encode(self, texts: List[str]) -> np.ndarray:
        """Encode texts using the configured backend."""
        return self.backend.encode(texts)


