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

    async def handle_message(
        self,
        session_id: str,
        user_id: str,
        text: str,
        current_course_id: Optional[str] = None,
    ) -> str:
        session = await self.context_manager.get_session(session_id, user_id)
        if current_course_id:
            session.current_course_id = current_course_id

        intent = self.nlu.detect_intent(text)

        if intent == Intent.ASK_COURSE_QA:
            reply = await self._handle_course_qa(session, text)
        elif intent == Intent.ASK_GENERAL_QA:
            reply = await self._handle_general_qa(text)
        elif intent == Intent.ASK_RECOMMEND:
            reply = await self._handle_recommend(user_id, text)
        elif intent == Intent.ASK_STUDY_PLAN:
            reply = await self._handle_study_plan(session, text)
        else:
            reply = await self.llm.generate(f"Answer in a friendly way: {text}")

        session.last_intent = intent.value
        await self.context_manager.update_session(session)
        return reply


