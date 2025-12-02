from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable, List, Optional, Sequence

from app.infra.vector_store import DocumentChunk, VectorStore


@dataclass
class RetrievalParams:
    course_ids: Sequence[str]
    lesson_id: Optional[str] = None
    section: Optional[str] = None
    top_k: int = 5
    score_threshold: Optional[float] = None


class RetrievalService:
    """
    High-level retrieval service that wraps the underlying VectorStore.

    This is where we centralize search parameters (course_ids, lesson_id,
    section, top_k, score_threshold) and, in the future, hybrid search logic
    (vector + BM25).
    """

    def __init__(self, store: VectorStore) -> None:
        self.store = store

    async def retrieve(
        self,
        question: str,
        params: RetrievalParams,
    ) -> List[DocumentChunk]:
        """
        Retrieve relevant chunks for the given question and filters.

        Currently this is a thin wrapper that:
        - calls the vector store per course_id
        - concatenates results and trims to top_k

        Later this will be extended with hybrid (BM25 + vector) search and
        proper scoring.
        """
        all_docs: List[DocumentChunk] = []

        for cid in params.course_ids:
            docs = await self.store.retrieve_for_course(cid, question, k=params.top_k)
            all_docs.extend(docs)

        # TODO: apply lesson_id / section / score_threshold filters once vector
        # store exposes this metadata and scoring.

        # For now, just cap to top_k.
        return all_docs[: params.top_k]


