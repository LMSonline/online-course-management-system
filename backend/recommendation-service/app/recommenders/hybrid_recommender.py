"""Hybrid recommender that combines multiple strategies."""

from typing import List, Dict
from app.recommenders.base import BaseRecommender
from app.domain.models import Course
from app.recommenders.two_tower_recommender import TwoTowerRecommender
from app.recommenders.popularity_recommender import PopularityRecommender
from app.recommenders.content_based_recommender import ContentBasedRecommender


class HybridRecommender(BaseRecommender):
    """
    Hybrid recommender that combines multiple strategies with configurable weights.
    
    Combines:
    - Two-tower model (collaborative filtering)
    - Popularity-based
    - Content-based
    """

    def __init__(
        self,
        two_tower: TwoTowerRecommender,
        popularity: PopularityRecommender,
        content_based: ContentBasedRecommender,
        weights: Dict[str, float] | None = None,
    ):
        """
        Initialize hybrid recommender.
        
        Args:
            two_tower: Two-tower recommender
            popularity: Popularity recommender
            content_based: Content-based recommender
            weights: Weights for each strategy (default: equal weights)
        """
        self.two_tower = two_tower
        self.popularity = popularity
        self.content_based = content_based
        
        # Default weights
        default_weights = {
            "two_tower": 0.5,
            "popularity": 0.3,
            "content": 0.2,
        }
        self.weights = weights or default_weights
        
        # Normalize weights
        total = sum(self.weights.values())
        if total > 0:
            self.weights = {k: v / total for k, v in self.weights.items()}

    async def get_home_recommendations(
        self, user_id: str, k: int = 5
    ) -> List[Course]:
        """Get recommendations by combining multiple strategies."""
        # Get recommendations from each strategy
        two_tower_recs = await self.two_tower.get_home_recommendations(user_id, k=k * 2)
        popularity_recs = await self.popularity.get_home_recommendations(user_id, k=k * 2)
        content_recs = await self.content_based.get_home_recommendations(user_id, k=k * 2)
        
        # Score and combine
        course_scores: Dict[str, float] = {}
        
        # Score two-tower recommendations
        for i, course in enumerate(two_tower_recs):
            score = self.weights["two_tower"] * (len(two_tower_recs) - i) / len(two_tower_recs)
            course_scores[course.id] = course_scores.get(course.id, 0.0) + score
        
        # Score popularity recommendations
        for i, course in enumerate(popularity_recs):
            score = self.weights["popularity"] * (len(popularity_recs) - i) / len(popularity_recs)
            course_scores[course.id] = course_scores.get(course.id, 0.0) + score
        
        # Score content-based recommendations
        for i, course in enumerate(content_recs):
            score = self.weights["content"] * (len(content_recs) - i) / len(content_recs)
            course_scores[course.id] = course_scores.get(course.id, 0.0) + score
        
        # Sort by combined score
        all_courses = {c.id: c for c in two_tower_recs + popularity_recs + content_recs}
        scored = [(course_id, score) for course_id, score in course_scores.items()]
        scored.sort(key=lambda x: x[1], reverse=True)
        
        return [all_courses[course_id] for course_id, _ in scored[:k] if course_id in all_courses]

    async def get_similar_courses(
        self, course_id: str, k: int = 5
    ) -> List[Course]:
        """Get similar courses by combining multiple strategies."""
        # Get recommendations from each strategy
        two_tower_recs = await self.two_tower.get_similar_courses(course_id, k=k * 2)
        popularity_recs = await self.popularity.get_similar_courses(course_id, k=k * 2)
        content_recs = await self.content_based.get_similar_courses(course_id, k=k * 2)
        
        # Score and combine (same logic as home recommendations)
        course_scores: Dict[str, float] = {}
        
        for i, course in enumerate(two_tower_recs):
            score = self.weights["two_tower"] * (len(two_tower_recs) - i) / len(two_tower_recs)
            course_scores[course.id] = course_scores.get(course.id, 0.0) + score
        
        for i, course in enumerate(popularity_recs):
            score = self.weights["popularity"] * (len(popularity_recs) - i) / len(popularity_recs)
            course_scores[course.id] = course_scores.get(course.id, 0.0) + score
        
        for i, course in enumerate(content_recs):
            score = self.weights["content"] * (len(content_recs) - i) / len(content_recs)
            course_scores[course.id] = course_scores.get(course.id, 0.0) + score
        
        # Sort by combined score
        all_courses = {c.id: c for c in two_tower_recs + popularity_recs + content_recs}
        scored = [(course_id, score) for course_id, score in course_scores.items()]
        scored.sort(key=lambda x: x[1], reverse=True)
        
        return [all_courses[course_id] for course_id, _ in scored[:k] if course_id in all_courses]

