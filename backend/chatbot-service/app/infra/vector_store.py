from typing import List
from pydantic import BaseModel


class DocumentChunk(BaseModel):
    id: str
    course_id: str
    content: str