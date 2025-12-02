from functools import lru_cache

from app.services.nlu import NLUService
from app.services.context_manager import ContextManager
from app.services.study_plan_service import StudyPlanService
from app.services.chat_service import ChatService
from app.infra.vector_store import InMemoryVectorStore
from app.infra.llm_client import DummyLLMClient
from app.infra.rs_client import RecommendationClient


@lru_cache
def get_nlu() -> NLUService:
    return NLUService()


@lru_cache
def get_context_manager() -> ContextManager:
    return ContextManager()


@lru_cache
def get_vector_store() -> InMemoryVectorStore:
    return InMemoryVectorStore()


@lru_cache
def get_llm_client() -> DummyLLMClient:
    return DummyLLMClient()


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
