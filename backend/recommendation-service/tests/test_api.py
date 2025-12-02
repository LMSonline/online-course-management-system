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

