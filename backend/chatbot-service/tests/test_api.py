"""
FastAPI integration tests.
"""

import pytest
from httpx import AsyncClient
from fastapi.testclient import TestClient

from app.main import app
from app.core.settings import settings


@pytest.fixture
def test_client():
    """Test client for FastAPI app."""
    return TestClient(app)


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
async def test_post_chat_message(async_client):
    """Test POST /api/v1/chat/messages endpoint."""
    payload = {
        "session_id": "test-session-123",
        "user_id": "user1",
        "text": "Hello, what is Python?",
        "current_course_id": None,
        "debug": False,
    }
    
    response = await async_client.post("/api/v1/chat/messages", json=payload)
    assert response.status_code == 200
    
    data = response.json()
    assert "reply" in data
    assert isinstance(data["reply"], str)
    # Debug should not be present if debug=False
    assert "debug" not in data or data["debug"] is None


@pytest.mark.asyncio
async def test_post_chat_message_with_debug(async_client):
    """Test POST /api/v1/chat/messages with debug=True."""
    payload = {
        "session_id": "test-session-456",
        "user_id": "user1",
        "text": "What is Python?",
        "current_course_id": "course_python_basic",
        "debug": True,
    }
    
    response = await async_client.post("/api/v1/chat/messages", json=payload)
    assert response.status_code == 200
    
    data = response.json()
    assert "reply" in data
    # Debug info should be present if debug=True and intent is ASK_COURSE_QA
    # (may or may not be present depending on intent detection)


@pytest.mark.asyncio
async def test_get_sessions(async_client):
    """Test GET /api/v1/chat/sessions endpoint."""
    # First create a session by sending a message
    await async_client.post(
        "/api/v1/chat/messages",
        json={
            "session_id": "test-session-sessions",
            "user_id": "user1",
            "text": "Hello",
        },
    )
    
    # Then fetch sessions
    response = await async_client.get("/api/v1/chat/sessions?user_id=user1")
    assert response.status_code == 200
    
    data = response.json()
    assert isinstance(data, list)
    # Should have at least one session
    assert len(data) > 0
    assert "id" in data[0]
    assert "user_id" in data[0]


@pytest.mark.asyncio
async def test_get_session_detail(async_client):
    """Test GET /api/v1/chat/sessions/{session_id} endpoint."""
    session_id = "test-session-detail"
    
    # Create session with messages
    await async_client.post(
        "/api/v1/chat/messages",
        json={
            "session_id": session_id,
            "user_id": "user1",
            "text": "Hello",
        },
    )
    
    # Fetch session detail
    response = await async_client.get(f"/api/v1/chat/sessions/{session_id}")
    assert response.status_code == 200
    
    data = response.json()
    assert "session" in data
    assert "messages" in data
    assert data["session"]["id"] == session_id
    assert isinstance(data["messages"], list)
    # Should have at least 2 messages (user + bot)
    assert len(data["messages"]) >= 2

