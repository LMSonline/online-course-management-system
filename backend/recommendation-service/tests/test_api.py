"""
FastAPI integration tests for recommendation service.
"""

import pytest
from httpx import AsyncClient

from app.main import app


@pytest.fixture
async def async_client():
    """Async test client."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client


@pytest.mark.asyncio
async def test_health_endpoint(async_client):
    """Test health check endpoint."""
    response = await async_client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "service" in data


@pytest.mark.asyncio
async def test_get_home_recommendations(async_client):
    """Test GET /api/v1/recommendations/home endpoint."""
    response = await async_client.get("/api/v1/recommendations/home?user_id=user1")
    assert response.status_code == 200
    
    data = response.json()
    assert isinstance(data, list)
    # Should have recommendations (at least from in-memory repo)
    assert len(data) > 0
    
    # Check structure
    course = data[0]
    assert "id" in course
    assert "title" in course
    assert "description" in course
    assert "level" in course


@pytest.mark.asyncio
async def test_get_home_recommendations_with_explain(async_client):
    """Test GET /api/v1/recommendations/home with explain=true."""
    response = await async_client.get(
        "/api/v1/recommendations/home?user_id=user1&explain=true"
    )
    assert response.status_code == 200
    
    data = response.json()
    assert "recommendations" in data
    assert isinstance(data["recommendations"], list)
    
    if len(data["recommendations"]) > 0:
        rec = data["recommendations"][0]
        assert "course" in rec
        assert "score" in rec
        assert "reason" in rec
        assert isinstance(rec["reason"], str)


@pytest.mark.asyncio
async def test_get_similar_courses(async_client):
    """Test GET /api/v1/recommendations/similar/{course_id} endpoint."""
    # Use a course ID that exists in InMemoryCourseRepository
    course_id = "course_python_basic"
    
    response = await async_client.get(f"/api/v1/recommendations/similar/{course_id}")
    assert response.status_code == 200
    
    data = response.json()
    assert isinstance(data, list)
    # Should have similar courses
    assert len(data) > 0
    
    # Check structure
    course = data[0]
    assert "id" in course
    assert course["id"] != course_id  # Should not include the target course


@pytest.mark.asyncio
async def test_recommendations_with_strategy(async_client):
    """Test GET /api/v1/recommendations/home with different strategies."""
    strategies = ["two_tower", "popularity", "content", "hybrid"]
    
    for strategy in strategies:
        response = await async_client.get(
            f"/api/v1/recommendations/home?user_id=user1&strategy={strategy}"
        )
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)


@pytest.mark.asyncio
async def test_analytics_user_stats(async_client):
    """Test GET /api/v1/recommendations/stats/user/{user_id} endpoint."""
    user_id = "user1"
    
    response = await async_client.get(f"/api/v1/recommendations/stats/user/{user_id}")
    assert response.status_code == 200
    
    data = response.json()
    assert "user_id" in data
    assert "num_recommendations" in data
    assert "num_clicks" in data
    assert "num_enrolls" in data
    assert "ctr" in data
    assert data["user_id"] == user_id


@pytest.mark.asyncio
async def test_analytics_global_stats(async_client):
    """Test GET /api/v1/recommendations/stats/global endpoint."""
    response = await async_client.get("/api/v1/recommendations/stats/global")
    assert response.status_code == 200
    
    data = response.json()
    assert "global_ctr" in data
    assert "most_popular_courses" in data
    assert "strategy_distribution" in data
    assert "daily_stats" in data


@pytest.mark.asyncio
async def test_admin_models_info(async_client):
    """Test GET /admin/recommendations/models endpoint."""
    response = await async_client.get("/admin/recommendations/models")
    assert response.status_code == 200
    
    data = response.json()
    assert "models_loaded" in data
    assert "embedding_dim" in data
    assert "num_indexed_items" in data
    assert "model_checkpoints" in data


@pytest.mark.asyncio
async def test_error_response_format(async_client):
    """Test that error responses follow standardized format."""
    # Try invalid endpoint
    response = await async_client.get("/api/v1/recommendations/home")
    
    # Should return error in standardized format
    if response.status_code >= 400:
        data = response.json()
        assert "error" in data
        assert "error_code" in data["error"]
        assert "message" in data["error"]
        assert "request_id" in data["error"]

