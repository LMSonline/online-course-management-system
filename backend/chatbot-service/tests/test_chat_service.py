"""
Tests for ChatService and intent routing.
"""

import pytest
from unittest.mock import AsyncMock, MagicMock

from app.domain.enums import Intent, Sender
from app.domain.models import ChatSession
from app.services.chat_service import ChatService
from app.services.nlu import NLUService
from app.services.context_manager import ContextManager
from app.infra.vector_store import InMemoryVectorStore
from app.infra.llm_client import DummyLLMClient
from app.infra.rs_client import RecommendationClient
from app.services.study_plan_service import StudyPlanService


@pytest.fixture
def mock_context_manager():
    """Mock context manager."""
    manager = AsyncMock(spec=ContextManager)
    from datetime import datetime
    session = ChatSession(
        id="test-session",
        user_id="user1",
        current_course_id="course1",
        created_at=datetime.utcnow(),
    )
    manager.get_session = AsyncMock(return_value=session)
    manager.get_recent_messages = AsyncMock(return_value=[])
    manager.add_message = AsyncMock()
    manager.update_session = AsyncMock()
    return manager


@pytest.fixture
def mock_nlu():
    """Mock NLU service."""
    nlu = MagicMock(spec=NLUService)
    return nlu


@pytest.fixture
def mock_llm():
    """Mock LLM client."""
    llm = AsyncMock(spec=DummyLLMClient)
    llm.generate = AsyncMock(return_value="Test response")
    return llm


@pytest.fixture
def chat_service(mock_nlu, mock_context_manager, mock_llm):
    """ChatService with mocked dependencies."""
    vector_store = InMemoryVectorStore()
    rs_client = AsyncMock(spec=RecommendationClient)
    study_plan_service = AsyncMock(spec=StudyPlanService)
    
    return ChatService(
        nlu=mock_nlu,
        context_manager=mock_context_manager,
        vector_store=vector_store,
        llm_primary=mock_llm,
        llm_fallback=mock_llm,
        rs_client=rs_client,
        study_plan_service=study_plan_service,
    )


@pytest.mark.asyncio
async def test_chat_service_ask_course_qa(chat_service, mock_nlu, mock_llm):
    """Test ASK_COURSE_QA intent routes to course QA handler."""
    mock_nlu.detect_intent.return_value = Intent.ASK_COURSE_QA
    
    result = await chat_service.handle_message(
        session_id="test-session",
        user_id="user1",
        text="What is Python?",
        current_course_id="course1",
    )
    
    assert isinstance(result, str)
    # Verify LLM was called (for RAG response)
    assert mock_llm.generate.called


@pytest.mark.asyncio
async def test_chat_service_ask_general_qa(chat_service, mock_nlu, mock_llm):
    """Test ASK_GENERAL_QA intent routes to general QA handler."""
    mock_nlu.detect_intent.return_value = Intent.ASK_GENERAL_QA
    
    result = await chat_service.handle_message(
        session_id="test-session",
        user_id="user1",
        text="Explain machine learning",
    )
    
    assert isinstance(result, str)
    assert mock_llm.generate.called


@pytest.mark.asyncio
async def test_chat_service_ask_recommend(chat_service, mock_nlu, mock_llm):
    """Test ASK_RECOMMEND intent routes to recommend handler."""
    mock_nlu.detect_intent.return_value = Intent.ASK_RECOMMEND
    
    # Mock RS client response
    from app.domain.models import Course
    chat_service.rs_client.get_home_recommendations = AsyncMock(
        return_value=[
            Course(id="c1", title="Course 1", description="Desc 1", level="beginner", tags=[])
        ]
    )
    
    result = await chat_service.handle_message(
        session_id="test-session",
        user_id="user1",
        text="Recommend courses",
    )
    
    assert isinstance(result, str)
    assert chat_service.rs_client.get_home_recommendations.called


@pytest.mark.asyncio
async def test_chat_service_ask_study_plan(chat_service, mock_nlu, mock_llm):
    """Test ASK_STUDY_PLAN intent routes to study plan handler."""
    mock_nlu.detect_intent.return_value = Intent.ASK_STUDY_PLAN
    
    from app.domain.models import StudyPlanItem
    chat_service.study_plan_service.generate_plan = AsyncMock(
        return_value=[
            StudyPlanItem(day=1, lessons=["Lesson 1", "Lesson 2"])
        ]
    )
    
    result = await chat_service.handle_message(
        session_id="test-session",
        user_id="user1",
        text="Create study plan",
        current_course_id="course1",
    )
    
    assert isinstance(result, str)
    assert chat_service.study_plan_service.generate_plan.called


@pytest.mark.asyncio
async def test_chat_service_saves_messages(chat_service, mock_context_manager):
    """Test that ChatService saves user and bot messages."""
    await chat_service.handle_message(
        session_id="test-session",
        user_id="user1",
        text="Hello",
    )
    
    # Verify messages were saved
    assert mock_context_manager.add_message.call_count == 2  # user + bot
    # First call should be user message
    first_call = mock_context_manager.add_message.call_args_list[0]
    assert first_call[1]["sender"] == Sender.USER
    assert first_call[1]["text"] == "Hello"
    
    # Second call should be bot reply
    second_call = mock_context_manager.add_message.call_args_list[1]
    assert second_call[1]["sender"] == Sender.BOT

