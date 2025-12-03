"""Tests for recommender algorithms."""

import pytest
from app.recommenders.popularity_recommender import PopularityRecommender
from app.recommenders.content_based_recommender import ContentBasedRecommender
from app.recommenders.hybrid_recommender import HybridRecommender
from app.recommenders.two_tower_recommender import TwoTowerRecommender
from app.infra.repositories import InMemoryCourseRepository
from app.domain.models import Course
from app.models.two_tower import TwoTowerModel
from app.encoders import UserFeatureEncoder, ItemFeatureEncoder


@pytest.fixture
def course_repo():
    """Course repository with sample courses."""
    repo = InMemoryCourseRepository()
    # Add sample courses
    repo.courses = [
        Course(
            id="course1",
            title="Python Basics",
            description="Learn Python programming",
            level="beginner",
            tags=["python", "programming"],
        ),
        Course(
            id="course2",
            title="Advanced Python",
            description="Advanced Python concepts",
            level="advanced",
            tags=["python", "advanced"],
        ),
        Course(
            id="course3",
            title="Java Basics",
            description="Learn Java programming",
            level="beginner",
            tags=["java", "programming"],
        ),
    ]
    return repo


@pytest.fixture
def two_tower_model():
    """Two-tower model for testing."""
    return TwoTowerModel(
        user_encoder=UserFeatureEncoder(),
        item_encoder=ItemFeatureEncoder(),
    )


@pytest.mark.asyncio
async def test_popularity_recommender(course_repo):
    """Test popularity-based recommender."""
    recommender = PopularityRecommender(course_repo=course_repo)
    
    recommendations = await recommender.get_home_recommendations("user1", k=2)
    
    assert isinstance(recommendations, list)
    assert len(recommendations) <= 2


@pytest.mark.asyncio
async def test_content_based_recommender(course_repo):
    """Test content-based recommender."""
    recommender = ContentBasedRecommender(course_repo=course_repo)
    
    recommendations = await recommender.get_home_recommendations("user1", k=2)
    
    assert isinstance(recommendations, list)
    assert len(recommendations) <= 2
    
    # Test similar courses
    similar = await recommender.get_similar_courses("course1", k=2)
    assert isinstance(similar, list)
    assert len(similar) <= 2


@pytest.mark.asyncio
async def test_hybrid_recommender(course_repo, two_tower_model):
    """Test hybrid recommender."""
    two_tower = TwoTowerRecommender(
        model=two_tower_model,
        course_repo=course_repo,
    )
    popularity = PopularityRecommender(course_repo=course_repo)
    content = ContentBasedRecommender(course_repo=course_repo)
    
    hybrid = HybridRecommender(
        two_tower=two_tower,
        popularity=popularity,
        content_based=content,
    )
    
    recommendations = await hybrid.get_home_recommendations("user1", k=2)
    
    assert isinstance(recommendations, list)
    assert len(recommendations) <= 2

