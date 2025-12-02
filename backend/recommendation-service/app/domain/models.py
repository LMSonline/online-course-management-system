from typing import List
from pydantic import BaseModel


class Course(BaseModel):
    id: str
    title: str
    description: str
    level: str  # e.g. "beginner", "intermediate", "advanced"
    tags: List[str] = []
