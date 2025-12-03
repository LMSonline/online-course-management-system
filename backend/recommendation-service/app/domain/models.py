from typing import List, Optional
from pydantic import BaseModel


class Course(BaseModel):
    id: str
    title: str
    description: str
    level: str  # e.g. "beginner", "intermediate", "advanced"
    tags: List[str] = []


class RecommendedCourse(BaseModel):
    """Course recommendation with explainable reason."""
    course: Course
    score: float
    reason: str  # Human-readable explanation


class RecommendationResponse(BaseModel):
    """Response with explainable recommendations."""
    recommendations: List[RecommendedCourse]
