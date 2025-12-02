from __future__ import annotations

from dataclasses import dataclass
import os
from typing import List, Optional, Sequence

from rank_bm25 import BM25Okapi

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
        self.search_mode = os.getenv("SEARCH_MODE", "vector").lower()
        # Weight for vector vs BM25 when in hybrid mode
        self.hybrid_alpha = float(os.getenv("HYBRID_ALPHA", "0.6"))

    async def retrieve(
        self,
        question: str,
        params: RetrievalParams,
    ) -> List[DocumentChunk]:
        """
        Retrieve relevant chunks for the given question and filters.

        Modes (via SEARCH_MODE env):
        - vector: only vector store (default)
        - bm25: only BM25 over retrieved chunks
        - hybrid: combine vector + BM25 scores
        """
        # 1) Vector retrieval per course_id (top_k * 2 to give BM25 more room)
        per_course_k = params.top_k * 2
        vector_docs: List[DocumentChunk] = []
        for cid in params.course_ids:
            docs = await self.store.retrieve_for_course(cid, question, k=per_course_k)
            vector_docs.extend(docs)

        if not vector_docs:
            return []

        # Optional filtering by lesson_id / section (when metadata is available)
        filtered = []
        for d in vector_docs:
            if params.lesson_id and d.lesson_id != params.lesson_id:
                continue
            if params.section and d.section != params.section:
                continue
            filtered.append(d)
        vector_docs = filtered or vector_docs

        # vector-only mode
        mode = self.search_mode
        if mode == "vector":
            return vector_docs[: params.top_k]

        # 2) BM25 over text
        tokenized_corpus = [d.content.split() for d in vector_docs]
        bm25 = BM25Okapi(tokenized_corpus)
        bm25_scores = bm25.get_scores(question.split())

        # Attach BM25 scores as separate list aligned with vector_docs
        # and compute BM25-only ranking if requested.
        if mode == "bm25":
            scored = list(zip(vector_docs, bm25_scores))
            scored.sort(key=lambda x: float(x[1]), reverse=True)
            docs = [d for d, s in scored]
        elif mode == "hybrid":
            # 3) Hybrid: normalize both vector scores (if any) and BM25, combine.
            vec_scores = [d.score if d.score is not None else 0.0 for d in vector_docs]
            v_min, v_max = min(vec_scores), max(vec_scores) if vec_scores else (0.0, 0.0)
            b_min, b_max = float(min(bm25_scores)), float(max(bm25_scores))

            def norm(x: float, lo: float, hi: float) -> float:
                if hi <= lo:
                    return 0.0
                return (x - lo) / (hi - lo)

            combined = []
            for d, v, b in zip(vector_docs, vec_scores, bm25_scores):
                v_n = norm(float(v), v_min, v_max)
                b_n = norm(float(b), b_min, b_max)
                score = self.hybrid_alpha * v_n + (1.0 - self.hybrid_alpha) * b_n
                combined.append((d.copy(update={"score": score}), score))

            combined.sort(key=lambda x: float(x[1]), reverse=True)
            docs = [d for d, s in combined]
        else:
            # Fallback: behave like vector-only
            docs = vector_docs

        # Apply score_threshold if provided
        if params.score_threshold is not None:
            docs = [d for d in docs if (d.score or 0.0) >= params.score_threshold]

        return docs[: params.top_k]


