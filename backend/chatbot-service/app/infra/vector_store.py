from __future__ import annotations

from abc import ABC, abstractmethod
import os
from typing import List, Optional

import numpy as np
from pydantic import BaseModel

from app.infra.embeddings import EmbeddingModel



class DocumentChunk(BaseModel):
    """
    Small unit of course content stored in the vector store.

    - `id`: unique id of the chunk inside the store
    - `course_id`: LMS course id the chunk belongs to
    - `content`: raw text used for retrieval + LLM context
    """

    id: str
    course_id: str
    content: str
    lesson_id: Optional[str] = None
    section: Optional[str] = None
    language: Optional[str] = None
    score: Optional[float] = None  # filled at query time (vector/BM25/hybrid)


class VectorStore(ABC):
    """
    Abstraction over different vector store backends (in-memory, Chroma, FAISS, ...).

    All backends must at least support:
    - adding a list of `DocumentChunk`
    - retrieving the top-k chunks for a given course + question.
    """

    @abstractmethod
    async def add_documents(
        self, chunks: List[DocumentChunk], embeddings: Optional[np.ndarray] | None = None
    ) -> None:
        """
        Ingest a list of chunks into the store.
        Implementations may perform embedding + indexing under the hood.
        """

    @abstractmethod
    async def retrieve_for_course(
        self, course_id: str, question: str, k: int = 5
    ) -> List[DocumentChunk]:
        """
        Retrieve the top-k relevant chunks for a specific course and question.
        """

    async def list_chunks_by_course(self, course_id: str) -> List[DocumentChunk]:
        """
        List all chunks for a given course_id (for admin/debug purposes).

        Default implementation: filter by course_id. Subclasses can override
        for more efficient implementations.
        """
        # This is a default implementation that subclasses can override
        raise NotImplementedError("Subclass must implement list_chunks_by_course")

    async def delete_chunks_by_course(self, course_id: str) -> int:
        """
        Delete all chunks for a given course_id.

        Returns the number of chunks deleted.

        Default implementation: not supported. Subclasses must override.
        """
        raise NotImplementedError("Subclass must implement delete_chunks_by_course")


class InMemoryVectorStore(VectorStore):
    """
    Very small demo implementation – no real similarity, just filters by `course_id`.

    Useful for tests and for running the service without any external dependency.
    """

    def __init__(self):
        self.docs: List[DocumentChunk] = []
        self._seed()

    def _seed(self) -> None:
        # Seed a couple of demo chunks so the chatbot works out-of-the-box.
        self.docs.extend(
            [
                DocumentChunk(
                    id="doc1",
                    course_id="course_python_basic",
                    content="In Python, a list is mutable while a tuple is immutable.",
                ),
                DocumentChunk(
                    id="doc2",
                    course_id="course_python_basic",
                    content=(
                        "A list is defined with square brackets [], "
                        "a tuple with parentheses ()."
                    ),
                ),
            ]
        )

    async def add_documents(
        self, chunks: List[DocumentChunk], embeddings: Optional[np.ndarray] | None = None
    ) -> None:
        self.docs.extend(chunks)

    async def retrieve_for_course(
        self, course_id: str, question: str, k: int = 5
    ) -> List[DocumentChunk]:
        # For now we ignore the question and only filter by course_id.
        return [d for d in self.docs if d.course_id == course_id][:k]

    async def list_chunks_by_course(self, course_id: str) -> List[DocumentChunk]:
        """List all chunks for a course."""
        return [d for d in self.docs if d.course_id == course_id]

    async def delete_chunks_by_course(self, course_id: str) -> int:
        """Delete all chunks for a course."""
        before = len(self.docs)
        self.docs = [d for d in self.docs if d.course_id != course_id]
        return before - len(self.docs)


class InMemoryEmbeddingVectorStore(VectorStore):
    """
    Simple in-memory vector store with real embeddings (for small demos/tests).

    It keeps all embeddings in RAM and does brute-force similarity search.
    """

    def __init__(self):
        self.docs: List[DocumentChunk] = []
        self.embeddings: Optional[np.ndarray] = None  # shape [N, D]

    async def add_documents(
        self, chunks: List[DocumentChunk], embeddings: Optional[np.ndarray] | None = None
    ) -> None:
        """
        Add documents with precomputed embeddings. If embeddings is None, the
        caller is expected to have encoded them elsewhere; in this simple
        implementation we only support the (chunks, embeddings) pair.
        """
        if embeddings is None:
            raise ValueError("InMemoryEmbeddingVectorStore requires embeddings array")

        if self.embeddings is None:
            self.embeddings = embeddings
        else:
            self.embeddings = np.concatenate([self.embeddings, embeddings], axis=0)
        self.docs.extend(chunks)

    async def retrieve_for_course(
        self, course_id: str, question: str, k: int = 5
    ) -> List[DocumentChunk]:
        # Fallback: if no embeddings yet, behave like simple filter
        filtered = [d for d in self.docs if d.course_id == course_id]
        return filtered[:k]

    async def list_chunks_by_course(self, course_id: str) -> List[DocumentChunk]:
        """List all chunks for a course."""
        return [d for d in self.docs if d.course_id == course_id]

    async def delete_chunks_by_course(self, course_id: str) -> int:
        """Delete all chunks for a course, and remove corresponding embeddings."""
        indices_to_keep = [
            i for i, d in enumerate(self.docs) if d.course_id != course_id
        ]
        deleted_count = len(self.docs) - len(indices_to_keep)

        if deleted_count > 0:
            self.docs = [self.docs[i] for i in indices_to_keep]
            if self.embeddings is not None:
                self.embeddings = self.embeddings[indices_to_keep]

        return deleted_count


try:
    import faiss  # type: ignore
except ImportError:  # pragma: no cover - optional dependency
    faiss = None


class FaissVectorStore(VectorStore):
    """
    FAISS-backed vector store with on-disk persistence.

    - Embeddings are stored in a FAISS index + NumPy file.
    - Metadata (DocumentChunk) are stored as JSON.

    The directory is configured via VECTOR_STORE_DIR (default: ./vector_store).
    """

    def __init__(self, persist_dir: Optional[str] = None) -> None:
        if faiss is None:
            raise ImportError(
                "faiss is required for FaissVectorStore. Please install faiss-cpu."
            )

        from pathlib import Path
        import json

        self._json = json
        self._Path = Path

        self.persist_dir = self._Path(
            persist_dir or os.getenv("VECTOR_STORE_DIR", "./vector_store")
        )
        self.persist_dir.mkdir(parents=True, exist_ok=True)

        self.docs: List[DocumentChunk] = []
        self.embeddings: Optional[np.ndarray] = None
        self.index = None
        self._embedding_model = EmbeddingModel()

        self._load()

    def _meta_path(self):
        return self.persist_dir / "metadata.json"

    def _emb_path(self):
        return self.persist_dir / "embeddings.npy"

    def _index_path(self):
        return self.persist_dir / "faiss.index"

    def _load(self) -> None:
        # Load metadata
        mp = self._meta_path()
        if mp.exists():
            data = self._json.loads(mp.read_text(encoding="utf-8"))
            self.docs = [DocumentChunk(**d) for d in data]

        # Load embeddings
        ep = self._emb_path()
        if ep.exists():
            self.embeddings = np.load(ep)

        # Rebuild FAISS index
        if self.embeddings is not None and self.embeddings.size > 0:
            dim = self.embeddings.shape[1]
            self.index = faiss.IndexFlatIP(dim)
            self.index.add(self.embeddings.astype("float32"))

    def _save(self) -> None:
        # Persist metadata and embeddings
        mp = self._meta_path()
        ep = self._emb_path()

        mp.write_text(
            self._json.dumps([d.dict() for d in self.docs], ensure_ascii=False),
            encoding="utf-8",
        )

        if self.embeddings is not None:
            np.save(ep, self.embeddings)

        # Persist FAISS index (optional, we can rebuild from embeddings)
        if self.index is not None:
            faiss.write_index(self.index, str(self._index_path()))

    async def add_documents(
        self, chunks: List[DocumentChunk], embeddings: Optional[np.ndarray] | None = None
    ) -> None:
        if embeddings is None:
            raise ValueError("FaissVectorStore requires embeddings array")

        embeddings = embeddings.astype("float32")

        if self.embeddings is None:
            self.embeddings = embeddings
        else:
            self.embeddings = np.concatenate([self.embeddings, embeddings], axis=0)

        self.docs.extend(chunks)

        # Rebuild FAISS index
        dim = self.embeddings.shape[1]
        self.index = faiss.IndexFlatIP(dim)
        self.index.add(self.embeddings)

        self._save()

    async def retrieve_for_course(
        self, course_id: str, question: str, k: int = 5
    ) -> List[DocumentChunk]:
        if not self.docs or self.embeddings is None or self.index is None:
            return []

        # Embed the question
        q_vec = self._embedding_model.encode([question]).astype("float32")

        # Search top N globally, then filter by course_id
        top_n = min(len(self.docs), max(k * 5, k))
        scores, indices = self.index.search(q_vec, top_n)
        scores = scores[0]
        indices = indices[0]

        results: List[DocumentChunk] = []
        for idx, score in zip(indices, scores):
            if idx < 0 or idx >= len(self.docs):
                continue
            doc = self.docs[idx]
            if doc.course_id != course_id:
                continue
            # Attach score for downstream hybrid ranking / debugging.
            results.append(doc.copy(update={"score": float(score)}))
            if len(results) >= k:
                break

        return results

    async def list_chunks_by_course(self, course_id: str) -> List[DocumentChunk]:
        """List all chunks for a course."""
        return [d for d in self.docs if d.course_id == course_id]

    async def delete_chunks_by_course(self, course_id: str) -> int:
        """
        Delete all chunks for a course, rebuild index, and persist.

        This is a simple implementation: reload from metadata excluding the course,
        rebuild embeddings/index, and overwrite files.
        """
        indices_to_keep = [
            i for i, d in enumerate(self.docs) if d.course_id != course_id
        ]
        deleted_count = len(self.docs) - len(indices_to_keep)

        if deleted_count > 0:
            self.docs = [self.docs[i] for i in indices_to_keep]
            if self.embeddings is not None:
                self.embeddings = self.embeddings[indices_to_keep]
                # Rebuild FAISS index
                if len(self.embeddings) > 0:
                    dim = self.embeddings.shape[1]
                    self.index = faiss.IndexFlatIP(dim)
                    self.index.add(self.embeddings.astype("float32"))
                else:
                    self.index = None
                    self.embeddings = None

            # Persist changes
            self._save()

        return deleted_count


# NOTE: Real vector store implementations (e.g. Chroma / FAISS) will live here too,
# implementing the same `VectorStore` interface and being selected via env vars.