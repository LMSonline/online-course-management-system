"""Tests for intent handlers."""

import pytest
from app.services.handlers.generate_quiz_handler import GenerateQuizHandler
from app.services.handlers.summarize_lesson_handler import SummarizeLessonHandler
from app.services.handlers.explain_code_handler import ExplainCodeHandler
from app.services.handlers.course_qa_handler import CourseQAHandler
from app.infra.llm_client import DummyLLMClient
from app.services.retrieval_service import RetrievalService
from app.infra.vector_store import InMemoryVectorStore
from app.domain.models import ChatSession
from app.ingestion.loaders.base import ContentDocument, DocumentChunk


@pytest.fixture
def dummy_llm():
    """Dummy LLM client for testing."""
    return DummyLLMClient()


@pytest.fixture
def retrieval_service():
    """Retrieval service with in-memory vector store."""
    store = InMemoryVectorStore()
    return RetrievalService(store=store)


@pytest.fixture
def sample_session():
    """Sample chat session."""
    return ChatSession(
        id="test-session",
        user_id="test-user",
        current_course_id="course_python_basic",
    )


@pytest.mark.asyncio
async def test_generate_quiz_handler(dummy_llm, retrieval_service, sample_session):
    """Test quiz generation handler."""
    handler = GenerateQuizHandler(
        retrieval_service=retrieval_service,
        llm_primary=dummy_llm,
        llm_fallback=dummy_llm,
    )
    
    reply, debug_info = await handler.handle(
        request_text="Tạo cho em 5 câu trắc nghiệm về Python",
        session=sample_session,
    )
    
    assert isinstance(reply, str)
    assert len(reply) > 0


@pytest.mark.asyncio
async def test_summarize_lesson_handler(dummy_llm, retrieval_service, sample_session):
    """Test lesson summarization handler."""
    handler = SummarizeLessonHandler(
        retrieval_service=retrieval_service,
        llm_primary=dummy_llm,
        llm_fallback=dummy_llm,
    )
    
    reply, debug_info = await handler.handle(
        request_text="Tóm tắt bài học này",
        session=sample_session,
    )
    
    assert isinstance(reply, str)
    assert len(reply) > 0


@pytest.mark.asyncio
async def test_explain_code_handler(dummy_llm, sample_session):
    """Test code explanation handler."""
    handler = ExplainCodeHandler(
        llm_primary=dummy_llm,
        llm_fallback=dummy_llm,
    )
    
    code = "def hello():\n    print('Hello, World!')"
    reply, debug_info = await handler.handle(
        request_text=f"Giải thích code này:\n```python\n{code}\n```",
        session=sample_session,
    )
    
    assert isinstance(reply, str)
    assert len(reply) > 0
    assert debug_info is not None
    assert debug_info["language"] == "python"


@pytest.mark.asyncio
async def test_course_qa_handler(dummy_llm, retrieval_service, sample_session):
    """Test course Q&A handler."""
    handler = CourseQAHandler(
        retrieval_service=retrieval_service,
        llm_primary=dummy_llm,
        llm_fallback=dummy_llm,
    )
    
    reply, debug_info = await handler.handle(
        request_text="What is Python?",
        session=sample_session,
        debug=True,
    )
    
    assert isinstance(reply, str)
    assert len(reply) > 0

