from typing import List
from pydantic import BaseModel


class DocumentChunk(BaseModel):
    id: str
    course_id: str
    content: str

class InMemoryVectorStore:
    """
    Demo: không tính similarity thật, chỉ filter theo course_id.
    """

    def __init__(self):
        self.docs: List[DocumentChunk] = []
        self._seed()

    def _seed(self):
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
                    content="A list is defined with square brackets [], a tuple with parentheses ().",
                ),
            ]
        )

    async def retrieve_for_course(
        self, course_id: str, question: str, k: int = 5
    ) -> List[DocumentChunk]:
        return [d for d in self.docs if d.course_id == course_id][:k]