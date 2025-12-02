"""Popularity-based recommender."""

from typing import List, Dict
import asyncpg
from app.recommenders.base import BaseRecommender
from app.domain.models import Course
from app.infra.repositories import InMemoryCourseRepository
from app.core.settings import settings


class PopularityRecommender(BaseRecommender):
    """
    Recommender based on popularity/trending.
    
    Uses interaction counts (views, enrolls) to rank courses.
    """

    def __init__(
        self,
        course_repo: InMemoryCourseRepository,
    ):
        self.course_repo = course_repo
        self._popularity_scores: Dict[str, float] = {}
        self._dsn = self._build_dsn()

    def _build_dsn(self) -> str:
        """Build PostgreSQL connection string."""
        return (
            f"postgresql://{settings.RS_DB_USER}:{settings.RS_DB_PASSWORD}"
            f"@{settings.RS_DB_HOST}:{settings.RS_DB_PORT}/{settings.RS_DB_NAME}"
        )

    async def _load_popularity_scores(self) -> Dict[str, float]:
        """Load popularity scores from interaction events."""
        try:
            conn = await asyncpg.connect(self._dsn)
            try:
                # Count interactions per course
                rows = await conn.fetch("""
                    SELECT course_id, COUNT(*) as interaction_count
                    FROM user_course_events
                    WHERE event_type IN ('view', 'enroll', 'click')
                    GROUP BY course_id
                    ORDER BY interaction_count DESC
                """)
                scores = {row["course_id"]: float(row["interaction_count"]) for row in rows}
                return scores
            finally:
                await conn.close()
        except Exception:
            # If DB is not available, return empty dict
            return {}

    async def get_home_recommendations(
        self, user_id: str, k: int = 5
    ) -> List[Course]:
        """Get recommendations based on popularity."""
        # Load popularity scores if not cached
        if not self._popularity_scores:
            self._popularity_scores = await self._load_popularity_scores()
        
        all_courses = self.course_repo.list_courses()
        
        # Sort by popularity score
        scored_courses = [
            (course, self._popularity_scores.get(course.id, 0.0))
            for course in all_courses
        ]
        scored_courses.sort(key=lambda x: x[1], reverse=True)
        
        return [course for course, _ in scored_courses[:k]]

    async def get_similar_courses(
        self, course_id: str, k: int = 5
    ) -> List[Course]:
        """Get similar courses based on popularity (fallback to same level/tags)."""
        target = self.course_repo.get_course(course_id)
        if not target:
            return []
        
        all_courses = self.course_repo.list_courses()
        
        # Filter by same level or overlapping tags
        similar = []
        for course in all_courses:
            if course.id == course_id:
                continue
            if course.level == target.level:
                similar.append(course)
            elif set(course.tags) & set(target.tags):
                similar.append(course)
        
        # Sort by popularity
        scored = [
            (c, self._popularity_scores.get(c.id, 0.0)) for c in similar
        ]
        scored.sort(key=lambda x: x[1], reverse=True)
        
        return [c for c, _ in scored[:k]]

