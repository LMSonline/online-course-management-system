import os
from functools import lru_cache

from app.services.nlu import NLUService
from app.services.context_manager import ContextManager
from app.services.study_plan_service import StudyPlanService
from app.services.chat_service import ChatService
from app.infra.vector_store import InMemoryVectorStore, VectorStore
from app.infra.llm_client import DummyLLMClient, LLMClient, Llama3Client
from app.infra.rs_client import RecommendationClient


@lru_cache
def get_nlu() -> NLUService:
    return NLUService()


@lru_cache
def get_context_manager() -> ContextManager:
    return ContextManager()


@lru_cache
def get_vector_store() -> VectorStore:
    """
    Select vector store backend via env:
    - VECTOR_STORE_BACKEND=inmemory (default)
    In the future, additional backends (e.g. chroma, faiss) can be plugged in here.
    """
    backend = os.getenv("VECTOR_STORE_BACKEND", "inmemory").lower()

    if backend == "inmemory":
        return InMemoryVectorStore()

    # Placeholder for future implementations such as Chroma / FAISS.
    raise ValueError(f"Unsupported VECTOR_STORE_BACKEND: {backend}")


@lru_cache
def get_llm_client() -> LLMClient:
    """
    Select LLM provider via env:
    - LLM_PROVIDER=dummy  (default, echo client)
    - LLM_PROVIDER=llama3 (real remote Llama 3 API)
    """
    provider = os.getenv("LLM_PROVIDER", "dummy").lower()

    if provider == "dummy":
        return DummyLLMClient()
    if provider == "llama3":
        return Llama3Client()

    raise ValueError(f"Unsupported LLM_PROVIDER: {provider}")


@lru_cache
def get_rs_client() -> RecommendationClient:
    return RecommendationClient()


@lru_cache
def get_chat_service() -> ChatService:
    return ChatService(
        nlu=get_nlu(),
        context_manager=get_context_manager(),
        vector_store=get_vector_store(),
        llm=get_llm_client(),
        rs_client=get_rs_client(),
        study_plan_service=StudyPlanService(),
    )
