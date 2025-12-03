"""Content-based recommender using course metadata similarity."""

from typing import List, Dict
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.recommenders.base import BaseRecommender
from app.domain.models import Course
from app.infra.repositories import InMemoryCourseRepository


class ContentBasedRecommender(BaseRecommender):
    """
    Recommender based on content similarity.
    
    Uses TF-IDF vectors of course metadata (title, description, tags) to compute similarity.
    """

    def __init__(
        self,
        course_repo: InMemoryCourseRepository,
    ):
        self.course_repo = course_repo
        self._vectorizer: TfidfVectorizer | None = None
        self._course_vectors: np.ndarray | None = None
        self._course_ids: List[str] = []

    def _build_course_text(self, course: Course) -> str:
        """Build text representation of course for TF-IDF."""
        parts = [course.title, course.description or ""]
        if course.tags:
            parts.extend(course.tags)
        return " ".join(parts)

    def _build_index(self) -> None:
        """Build TF-IDF index from all courses."""
        all_courses = self.course_repo.list_courses()
        if not all_courses:
            return
        
        # Build text representations
        texts = [self._build_course_text(course) for course in all_courses]
        self._course_ids = [course.id for course in all_courses]
        
        # Fit TF-IDF vectorizer
        self._vectorizer = TfidfVectorizer(max_features=100, stop_words='english')
        self._course_vectors = self._vectorizer.fit_transform(texts)

    async def get_home_recommendations(
        self, user_id: str, k: int = 5
    ) -> List[Course]:
        """
        Get recommendations based on content similarity.
        
        For home page, we use a simple heuristic: recommend courses similar to
        popular courses or courses with high average ratings.
        """
        if self._vectorizer is None or self._course_vectors is None:
            self._build_index()
        
        if not self._course_vectors or len(self._course_ids) == 0:
            # Fallback: return all courses
            return self.course_repo.list_courses()[:k]
        
        # Use average of all course vectors as a "general interest" vector
        avg_vector = self._course_vectors.mean(axis=0)
        
        # Compute similarity
        similarities = cosine_similarity(avg_vector, self._course_vectors)[0]
        
        # Get top-k
        top_indices = np.argsort(similarities)[::-1][:k]
        all_courses = self.course_repo.list_courses()
        course_dict = {c.id: c for c in all_courses}
        
        return [course_dict[self._course_ids[idx]] for idx in top_indices if self._course_ids[idx] in course_dict]

    async def get_similar_courses(
        self, course_id: str, k: int = 5
    ) -> List[Course]:
        """Get courses similar to a given course based on content."""
        target = self.course_repo.get_course(course_id)
        if not target:
            return []
        
        if self._vectorizer is None or self._course_vectors is None:
            self._build_index()
        
        if not self._course_vectors or len(self._course_ids) == 0:
            return []
        
        # Get target course vector
        target_text = self._build_course_text(target)
        target_vector = self._vectorizer.transform([target_text])
        
        # Compute similarity
        similarities = cosine_similarity(target_vector, self._course_vectors)[0]
        
        # Get top-k (excluding the target course itself)
        all_courses = self.course_repo.list_courses()
        course_dict = {c.id: c for c in all_courses}
        
        # Find target index
        try:
            target_idx = self._course_ids.index(course_id)
            similarities[target_idx] = -1  # Exclude target
        except ValueError:
            pass
        
        top_indices = np.argsort(similarities)[::-1][:k]
        return [
            course_dict[self._course_ids[idx]]
            for idx in top_indices
            if self._course_ids[idx] in course_dict and self._course_ids[idx] != course_id
        ]

