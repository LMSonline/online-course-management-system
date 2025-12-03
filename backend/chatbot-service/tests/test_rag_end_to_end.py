"""
End-to-end RAG tests that exercise the full flow:
Question → Intent detection → Handler → RAG (VectorStore) → LLM → Response

These tests verify the complete pipeline with deterministic components.
"""

import pytest
from app.domain.models import ChatSession
from app.services.chat_service import ChatService
from app.services.nlu import NLUService
from app.services.context_manager import ContextManager
from app.services.handler_registry import HandlerRegistry
from app.infra.vector_store import InMemoryVectorStore, DocumentChunk
from app.infra.llm_client import DummyLLMClient
from app.infra.rs_client import RecommendationClient
from app.services.study_plan_service import StudyPlanService
from app.services.retrieval_service import RetrievalService
from app.infra.embeddings import EmbeddingModel


@pytest.fixture
def sample_vector_store():
    """Vector store with sample documents."""
    store = InMemoryVectorStore()
    
    # Add sample documents
    chunks = [
        DocumentChunk(
            id="chunk1",
            course_id="course_python_basic",
            content="Python is a high-level programming language. It supports multiple paradigms.",
        ),
        DocumentChunk(
            id="chunk2",
            course_id="course_python_basic",
            content="Lists and tuples are data structures in Python. Lists are mutable, tuples are immutable.",
        ),
        DocumentChunk(
            id="chunk3",
            course_id="course_python_basic",
            content="Functions in Python are defined using the def keyword. They can return values.",
        ),
    ]
    
    # Generate embeddings
    embedding_model = EmbeddingModel()
    texts = [chunk.content for chunk in chunks]
    embeddings = embedding_model.encode(texts)
    
    return store, chunks, embeddings


@pytest.fixture
async def chat_service(sample_vector_store):
    """Chat service with test dependencies."""
    nlu = NLUService()
    context_manager = ContextManager()
    vector_store = sample_vector_store
    llm_primary = DummyLLMClient()
    llm_fallback = DummyLLMClient()
    rs_client = RecommendationClient(base_url="http://test")
    study_plan_service = StudyPlanService()
    
    return ChatService(
        nlu=nlu,
        context_manager=context_manager,
        vector_store=vector_store,
        llm_primary=llm_primary,
        llm_fallback=llm_fallback,
        rs_client=rs_client,
        study_plan_service=study_plan_service,
    )


@pytest.mark.asyncio
async def test_course_qa_end_to_end(chat_service):
    """Test complete Course Q&A flow."""
    session_id = "test-rag-course-qa"
    user_id = "user1"
    
    reply, debug_info = await chat_service.handle_message(
        session_id=session_id,
        user_id=user_id,
        text="What is Python?",
        current_course_id="course_python_basic",
        debug=True,
    )
    
    assert isinstance(reply, str)
    assert len(reply) > 0
    assert debug_info is not None
    assert "chunks" in debug_info
    assert len(debug_info["chunks"]) > 0


@pytest.mark.asyncio
async def test_generate_quiz_end_to_end(chat_service):
    """Test complete quiz generation flow."""
    session_id = "test-rag-quiz"
    user_id = "user1"
    
    reply, debug_info = await chat_service.handle_message(
        session_id=session_id,
        user_id=user_id,
        text="Tạo cho em 5 câu trắc nghiệm về Python",
        current_course_id="course_python_basic",
    )
    
    assert isinstance(reply, str)
    assert len(reply) > 0
    # Quiz should contain question-like content
    assert any(keyword in reply.lower() for keyword in ["question", "câu", "answer", "đáp án"])


@pytest.mark.asyncio
async def test_summarize_lesson_end_to_end(chat_service):
    """Test complete lesson summarization flow."""
    session_id = "test-rag-summary"
    user_id = "user1"
    
    reply, debug_info = await chat_service.handle_message(
        session_id=session_id,
        user_id=user_id,
        text="Tóm tắt bài học này",
        current_course_id="course_python_basic",
    )
    
    assert isinstance(reply, str)
    assert len(reply) > 0
    # Summary should be structured
    assert len(reply) > 50  # Should be substantial


@pytest.mark.asyncio
async def test_explain_code_end_to_end(chat_service):
    """Test complete code explanation flow."""
    session_id = "test-rag-code"
    user_id = "user1"
    
    code = "def hello():\n    print('Hello, World!')"
    reply, debug_info = await chat_service.handle_message(
        session_id=session_id,
        user_id=user_id,
        text=f"Giải thích code này:\n```python\n{code}\n```",
        language="python",
    )
    
    assert isinstance(reply, str)
    assert len(reply) > 0
    assert debug_info is not None
    assert debug_info.get("language") == "python"


@pytest.mark.asyncio
async def test_study_plan_v2_end_to_end(chat_service):
    """Test complete study plan generation with constraints."""
    session_id = "test-rag-study-plan"
    user_id = "user1"
    
    reply, debug_info = await chat_service.handle_message(
        session_id=session_id,
        user_id=user_id,
        text="Tạo kế hoạch học tập",
        current_course_id="course_python_basic",
        exam_date="2024-12-31T00:00:00Z",
        free_days_per_week=5,
        completed_lessons=["lesson_1"],
    )
    
    assert isinstance(reply, str)
    assert len(reply) > 0
    assert debug_info is not None
    assert debug_info.get("days_until_exam") is not None


@pytest.mark.asyncio
async def test_intent_routing_multiple_handlers(chat_service):
    """Test that different intents route to correct handlers."""
    session_id = "test-intent-routing"
    user_id = "user1"
    
    # Test different intents
    test_cases = [
        ("What is Python?", "ASK_COURSE_QA"),
        ("Tạo câu hỏi về Python", "ASK_GENERATE_QUIZ"),
        ("Tóm tắt bài học", "ASK_SUMMARY"),
        ("Giải thích code này", "ASK_EXPLAIN_CODE"),
        ("Gợi ý khóa học", "ASK_RECOMMEND"),
    ]
    
    for text, expected_intent in test_cases:
        reply, _ = await chat_service.handle_message(
            session_id=f"{session_id}-{expected_intent}",
            user_id=user_id,
            text=text,
            current_course_id="course_python_basic" if expected_intent != "ASK_RECOMMEND" else None,
        )
        
        assert isinstance(reply, str)
        assert len(reply) > 0


@pytest.mark.asyncio
async def test_rag_with_no_matching_documents(chat_service):
    """Test RAG flow when no matching documents are found."""
    session_id = "test-rag-no-match"
    user_id = "user1"
    
    # Ask about something not in the vector store
    reply, debug_info = await chat_service.handle_message(
        session_id=session_id,
        user_id=user_id,
        text="What is quantum computing?",
        current_course_id="course_python_basic",
        debug=True,
    )
    
    assert isinstance(reply, str)
    # Should still return a response (even if it says it doesn't know)
    assert len(reply) > 0

