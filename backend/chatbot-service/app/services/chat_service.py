from typing import Optional
from app.domain.enums import Intent
from app.domain.models import ChatSession
from app.services.nlu import NLUService
from app.services.context_manager import ContextManager
from app.services.study_plan_service import StudyPlanService
from app.infra.vector_store import InMemoryVectorStore
from app.infra.llm_client import LLMClient
from app.infra.rs_client import RecommendationClient


class ChatService:
    def __init__(
        self,
        nlu: NLUService,
        context_manager: ContextManager,
        vector_store: InMemoryVectorStore,
        llm: LLMClient,
        rs_client: RecommendationClient,
        study_plan_service: StudyPlanService,
    ):
        self.nlu = nlu
        self.context_manager = context_manager
        self.vector_store = vector_store
        self.llm = llm
        self.rs_client = rs_client
        self.study_plan_service = study_plan_service


