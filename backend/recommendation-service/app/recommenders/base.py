"""Base class for recommender algorithms."""

from abc import ABC, abstractmethod
from typing import List
from app.domain.models import Course


class BaseRecommender(ABC):
    """
    Abstract base class for recommender algorithms.
    
    Each recommender implements a different strategy for generating recommendations.
    """

    @abstractmethod
    async def get_home_recommendations(
        self, user_id: str, k: int = 5
    ) -> List[Course]:
        """
        Get home page recommendations for a user.
        
        Args:
            user_id: User ID
            k: Number of recommendations to return
            
        Returns:
            List of recommended courses
        """
        pass

    @abstractmethod
    async def get_similar_courses(
        self, course_id: str, k: int = 5
    ) -> List[Course]:
        """
        Get courses similar to a given course.
        
        Args:
            course_id: Course ID
            k: Number of recommendations to return
            
        Returns:
            List of similar courses
        """
        pass

