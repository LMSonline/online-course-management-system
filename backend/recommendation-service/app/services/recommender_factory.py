"""Factory for creating recommender instances."""

from typing import Optional
from app.recommenders.base import BaseRecommender
from app.recommenders.two_tower_recommender import TwoTowerRecommender
from app.recommenders.popularity_recommender import PopularityRecommender
from app.recommenders.content_based_recommender import ContentBasedRecommender
from app.recommenders.hybrid_recommender import HybridRecommender
from app.models.two_tower import TwoTowerModel
from app.infra.repositories import InMemoryCourseRepository
from app.encoders import UserFeatureEncoder, ItemFeatureEncoder
from app.core.settings import settings


class RecommenderFactory:
    """Factory for creating recommender instances."""

    def __init__(
        self,
        course_repo: InMemoryCourseRepository,
        model: TwoTowerModel,
        user_encoder: UserFeatureEncoder,
        item_encoder: ItemFeatureEncoder,
    ):
        self.course_repo = course_repo
        self.model = model
        self.user_encoder = user_encoder
        self.item_encoder = item_encoder
        
        # Cache recommenders
        self._recommenders: dict[str, BaseRecommender] = {}

    def get_recommender(self, strategy: Optional[str] = None) -> BaseRecommender:
        """
        Get recommender by strategy name.
        
        Args:
            strategy: Strategy name (two_tower, popularity, content, hybrid)
                    If None, uses DEFAULT_RECOMMENDER from settings
        
        Returns:
            BaseRecommender instance
        """
        strategy = strategy or settings.DEFAULT_RECOMMENDER
        
        if strategy in self._recommenders:
            return self._recommenders[strategy]
        
        # Create recommender
        if strategy == "two_tower":
            recommender = TwoTowerRecommender(
                model=self.model,
                course_repo=self.course_repo,
            )
        elif strategy == "popularity":
            recommender = PopularityRecommender(
                course_repo=self.course_repo,
            )
        elif strategy == "content":
            recommender = ContentBasedRecommender(
                course_repo=self.course_repo,
            )
        elif strategy == "hybrid":
            # Create component recommenders
            two_tower = TwoTowerRecommender(
                model=self.model,
                course_repo=self.course_repo,
            )
            popularity = PopularityRecommender(
                course_repo=self.course_repo,
            )
            content = ContentBasedRecommender(
                course_repo=self.course_repo,
            )
            
            # Create hybrid with configurable weights
            recommender = HybridRecommender(
                two_tower=two_tower,
                popularity=popularity,
                content_based=content,
                weights={
                    "two_tower": settings.HYBRID_WEIGHTS_TWO_TOWER,
                    "popularity": settings.HYBRID_WEIGHTS_POPULARITY,
                    "content": settings.HYBRID_WEIGHTS_CONTENT,
                },
            )
        else:
            raise ValueError(f"Unknown strategy: {strategy}")
        
        self._recommenders[strategy] = recommender
        return recommender

