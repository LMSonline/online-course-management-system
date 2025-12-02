from typing import Optional
import logging
from app.domain.enums import Intent
from app.domain.models import ChatSession
from app.services.nlu import NLUService
from app.services.context_manager import ContextManager
from app.services.study_plan_service import StudyPlanService
from app.services.retrieval_service import RetrievalParams, RetrievalService
from app.infra.vector_store import VectorStore
from app.infra.llm_client import LLMClient
from app.infra.rs_client import RecommendationClient


logger = logging.getLogger(__name__)


class ChatService:
    def __init__(
        self,
        nlu: NLUService,
        context_manager: ContextManager,
        vector_store: VectorStore,
        llm_primary: LLMClient,
        llm_fallback: Optional[LLMClient],
        rs_client: RecommendationClient,
        study_plan_service: StudyPlanService,
    ):
        self.nlu = nlu
        self.context_manager = context_manager
        self.vector_store = vector_store
        self.retrieval_service = RetrievalService(store=vector_store)
        self.llm_primary = llm_primary
        self.llm_fallback = llm_fallback
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
            reply = await self._safe_generate(
                f"Answer in a friendly way: {text}",
                system_prompt="You are a helpful tutor for online courses.",
            )

        session.last_intent = intent.value
        await self.context_manager.update_session(session)
        return reply
    
    async def _handle_course_qa(self, session: ChatSession, question: str) -> str:
        if not session.current_course_id:
            return "Which course are you asking about? Please provide a course_id."
        params = RetrievalParams(course_ids=[session.current_course_id], top_k=5)
        docs = await self.retrieval_service.retrieve(question=question, params=params)
        context = "\n".join(d.content for d in docs)
        prompt = (
            "You are a teaching assistant. Use the context below to answer the question.\n\n"
            f"Context:\n{context}\n\nQuestion: {question}\n\n"
            "Answer in a short, clear way."
        )
        return await self._safe_generate(
            prompt,
            system_prompt=(
                "You are an LMS teaching assistant. Only answer using the provided context. "
                "If the answer is not in the context, say you are not sure."
            ),
        )
    
    async def _handle_general_qa(self, question: str) -> str:
        prompt = (
            "Explain the following concept to a beginner student:\n\n"
            f"{question}\n\nUse simple language."
        )
        return await self._safe_generate(
            prompt,
            system_prompt="You explain technical concepts to beginners in a concise way.",
        )
    
    async def _handle_recommend(self, user_id: str, text: str) -> str:
        courses = await self.rs_client.get_home_recommendations(user_id)
        if not courses:
            return "I don't have any courses to recommend yet."

        summary = "\n".join(
            f"- {c.title}: {c.description}" for c in courses
        )
        prompt = (
            "You are a course advisor. Based on the recommended courses below, "
            "suggest 2–3 options and explain briefly why they are suitable.\n\n"
            f"{summary}"
        )
        return await self._safe_generate(
            prompt,
            system_prompt=(
                "You are a course advisor that helps students choose suitable courses."
            ),
        )
    
    async def _handle_study_plan(self, session: ChatSession, text: str) -> str:
        if not session.current_course_id:
            return "To create a study plan, please tell me which course you want to study (course_id)."
        plan = await self.study_plan_service.generate_plan(
            course_id=session.current_course_id, days=7, hours_per_day=1
        )
        raw = "\n".join(
            f"Day {item.day}: {', '.join(item.lessons)}" for item in plan
        )
        prompt = (
            "Turn the following rough plan into a friendly study plan for the student:\n\n"
            f"{raw}"
        )
        return await self._safe_generate(
            prompt,
            system_prompt="You turn rough study plans into friendly step-by-step plans.",
        )

    async def _safe_generate(
        self,
        prompt: str,
        *,
        system_prompt: Optional[str] = None,
        temperature: float = 0.2,
        max_tokens: int = 512,
    ) -> str:
        """
        Call the primary LLM, and gracefully fall back if it fails.
        """
        try:
            return await self.llm_primary.generate(
                prompt,
                system_prompt=system_prompt,
                temperature=temperature,
                max_tokens=max_tokens,
            )
        except Exception as exc:  # pragma: no cover - defensive
            logger.error("Primary LLM call failed, falling back: %s", exc)
            if self.llm_fallback is not None:
                try:
                    return await self.llm_fallback.generate(
                        prompt,
                        system_prompt=system_prompt,
                        temperature=temperature,
                        max_tokens=max_tokens,
                    )
                except Exception as exc2:  # pragma: no cover
                    logger.error("Fallback LLM call also failed: %s", exc2)
            return "Sorry, the AI assistant is currently unavailable. Please try again later."


