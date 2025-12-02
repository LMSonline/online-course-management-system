from functools import lru_cache

from app.infra.repositories import InMemoryCourseRepository
from app.infra.two_tower_model import TwoTowerModel
from app.services.recommendation_service import RecommendationService