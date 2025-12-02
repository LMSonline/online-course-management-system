from __future__ import annotations

from abc import ABC, abstractmethod
from typing import List

from pydantic import BaseModel


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


class VectorStore(ABC):
    """
    Abstraction over different vector store backends (in-memory, Chroma, FAISS, ...).

    All backends must at least support:
    - adding a list of `DocumentChunk`
    - retrieving the top-k chunks for a given course + question.
    """

    @abstractmethod
    async def add_documents(self, chunks: List[DocumentChunk]) -> None:
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

    async def add_documents(self, chunks: List[DocumentChunk]) -> None:
        self.docs.extend(chunks)

    async def retrieve_for_course(
        self, course_id: str, question: str, k: int = 5
    ) -> List[DocumentChunk]:
        # For now we ignore the question and only filter by course_id.
        return [d for d in self.docs if d.course_id == course_id][:k]


# NOTE: Real vector store implementations (e.g. Chroma / FAISS) will live here too,
# implementing the same `VectorStore` interface and being selected via env vars.