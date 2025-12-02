"""
Tests for CandidateGenerator and RankingService.
"""

import pytest
from unittest.mock import AsyncMock

from app.candidate import CandidateGenerator
from app.ranking import RankingService
from app.models.two_tower import TwoTowerModel
from app.encoders import UserFeatureEncoder, ItemFeatureEncoder


@pytest.fixture
def candidate_generator(two_tower_model, user_encoder, item_encoder):
    """CandidateGenerator for testing."""
    return CandidateGenerator(
        model=two_tower_model,
        user_encoder=user_encoder,
        item_encoder=item_encoder,
    )


@pytest.fixture
def ranking_service(two_tower_model, user_encoder, item_encoder):
    """RankingService for testing."""
    return RankingService(
        model=two_tower_model,
        user_encoder=user_encoder,
        item_encoder=item_encoder,
    )


@pytest.mark.asyncio
async def test_candidate_generator_for_home(candidate_generator, sample_courses):
    """Test CandidateGenerator generates candidates for home page."""
    candidates = await candidate_generator.generate_for_home(
        user_id="user1", all_courses=sample_courses
    )
    
    assert isinstance(candidates, list)
    assert len(candidates) > 0
    assert all(c.id in [c.id for c in sample_courses] for c in candidates)


@pytest.mark.asyncio
async def test_candidate_generator_similar(candidate_generator, sample_courses):
    """Test CandidateGenerator generates similar courses."""
    target = sample_courses[0]
    
    similar = await candidate_generator.generate_similar(
        target=target, all_courses=sample_courses
    )
    
    assert isinstance(similar, list)
    # Target should not be in similar results
    assert all(c.id != target.id for c in similar)


@pytest.mark.asyncio
async def test_ranking_service_for_home(ranking_service, sample_courses):
    """Test RankingService ranks candidates."""
    candidates = sample_courses.copy()
    
    ranked = await ranking_service.rank_for_home(
        user_id="user1", candidates=candidates, top_k=2
    )
    
    assert isinstance(ranked, list)
    assert len(ranked) <= 2
    assert len(ranked) <= len(candidates)


@pytest.mark.asyncio
async def test_ranking_service_similar(ranking_service, sample_courses):
    """Test RankingService ranks similar courses."""
    target = sample_courses[0]
    candidates = [c for c in sample_courses if c.id != target.id]
    
    ranked = await ranking_service.rank_similar(
        target=target, candidates=candidates, top_k=2
    )
    
    assert isinstance(ranked, list)
    assert len(ranked) <= 2

