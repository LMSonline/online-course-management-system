from functools import lru_cache

from app.core.settings import settings
from app.services.nlu import NLUService
from app.services.context_manager import ContextManager
from app.services.study_plan_service import StudyPlanService
from app.services.chat_service import ChatService
from app.services.retrieval_service import RetrievalService
from app.infra.vector_store import (
    InMemoryVectorStore,
    VectorStore,
    FaissVectorStore,
)
from app.infra.llm_client import DummyLLMClient, LLMClient, Llama3Client
from app.infra.rs_client import RecommendationClient
from app.infra.chat_repositories import ChatMessageRepository, ChatSessionRepository


@lru_cache
def get_nlu() -> NLUService:
    return NLUService()


@lru_cache
def get_context_manager() -> ContextManager:
    return ContextManager()


@lru_cache
def get_vector_store() -> VectorStore:
    """
    Select vector store backend via settings:
    - VECTOR_STORE_BACKEND=inmemory (default)
    - VECTOR_STORE_BACKEND=faiss (FAISS + on-disk persistence)
    """
    backend = settings.VECTOR_STORE_BACKEND.lower()

    if backend == "inmemory":
        return InMemoryVectorStore()

    if backend == "faiss":
        return FaissVectorStore(persist_dir=settings.VECTOR_STORE_DIR)

    raise ValueError(f"Unsupported VECTOR_STORE_BACKEND: {backend}")


@lru_cache
def get_llm_clients() -> tuple[LLMClient, LLMClient]:
    """
    Select primary + fallback LLM clients via settings:
    - LLM_PROVIDER=dummy  -> (Dummy, Dummy)
    - LLM_PROVIDER=llama3 -> (Llama3, Dummy)
    """
    provider = settings.LLM_PROVIDER.lower()

    dummy = DummyLLMClient()

    if provider == "dummy":
        return dummy, dummy
    if provider == "llama3":
        return (
            Llama3Client(
                api_base=settings.LLAMA3_API_BASE,
                api_key=settings.LLAMA3_API_KEY,
                model_name=settings.LLAMA3_MODEL_NAME,
                timeout=settings.LLAMA3_TIMEOUT,
            ),
            dummy,
        )

    raise ValueError(f"Unsupported LLM_PROVIDER: {provider}")


@lru_cache
def get_rs_client() -> RecommendationClient:
    return RecommendationClient(base_url=settings.RS_BASE_URL)


@lru_cache
def get_retrieval_service() -> RetrievalService:
    return RetrievalService(store=get_vector_store())


@lru_cache
def get_session_repo() -> ChatSessionRepository:
    return ChatSessionRepository()


@lru_cache
def get_message_repo() -> ChatMessageRepository:
    return ChatMessageRepository()


@lru_cache
def get_chat_service() -> ChatService:
    llm_primary, llm_fallback = get_llm_clients()
    return ChatService(
        nlu=get_nlu(),
        context_manager=get_context_manager(),
        vector_store=get_vector_store(),
        llm_primary=llm_primary,
        llm_fallback=llm_fallback,
        rs_client=get_rs_client(),
        study_plan_service=StudyPlanService(),
    )
