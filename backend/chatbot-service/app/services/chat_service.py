from typing import Optional, Dict, Any, Union
import logging
from app.domain.enums import Intent, Sender
from app.domain.models import ChatSession
from app.services.nlu import NLUService
from app.services.context_manager import ContextManager
from app.services.in_memory_context_manager import InMemoryContextManager
from app.services.study_plan_service import StudyPlanService
from app.services.retrieval_service import RetrievalService
from app.services.handler_registry import HandlerRegistry
from app.infra.vector_store import VectorStore
from app.infra.llm_client import LLMClient
from app.infra.rs_client import RecommendationClient


logger = logging.getLogger(__name__)


class ChatService:
    """Main chat service that orchestrates intent detection and handling."""

    def __init__(
        self,
        nlu: NLUService,
        context_manager: Union[ContextManager, InMemoryContextManager],
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
        
        # Initialize handler registry
        self.handler_registry = HandlerRegistry(
            retrieval_service=self.retrieval_service,
            llm_primary=llm_primary,
            llm_fallback=llm_fallback,
            rs_client=rs_client,
            study_plan_service=study_plan_service,
        )

    async def handle_message(
        self,
        session_id: str,
        user_id: str,
        text: str,
        current_course_id: Optional[str] = None,
        debug: bool = False,
        **kwargs
    ) -> tuple[str, Optional[Dict[str, Any]]]:
        """
        Handle a chat message by detecting intent and routing to appropriate handler.
        
        Args:
            session_id: Chat session ID
            user_id: User ID
            text: Message text
            current_course_id: Optional course context
            debug: Whether to include debug info
            **kwargs: Additional parameters (language, lesson_id, exam_date, etc.)
        """
        session = await self.context_manager.get_session(session_id, user_id)
        if current_course_id:
            session.current_course_id = current_course_id

        # Save user message to DB
        await self.context_manager.add_message(
            session_id=session.id, sender=Sender.USER, text=text
        )

        # Load recent conversation history for context
        history = await self.context_manager.get_recent_messages(session.id, limit=10)
        history_context = self._build_history_context(history)

        # Detect intent
        intent = self.nlu.detect_intent(text)

        # Route to handler
        handler = self.handler_registry.get_handler(intent)
        
        if handler:
            # Prepare handler kwargs
            handler_kwargs = {
                "debug": debug,
                **kwargs,  # Pass through additional params (language, lesson_id, etc.)
            }
            
            # Special case: use V2 handler for study plan if exam_date is provided
            if intent == Intent.ASK_STUDY_PLAN and kwargs.get("exam_date"):
                from app.services.handlers.study_plan_v2_handler import StudyPlanV2Handler
                handler = StudyPlanV2Handler(
                    retrieval_service=self.retrieval_service,
                    llm_primary=self.llm_primary,
                    llm_fallback=self.llm_fallback,
                )
            
            reply, debug_info = await handler.handle(
                request_text=text,
                session=session,
                history_context=history_context,
                **handler_kwargs
            )
        else:
            # Fallback: use generic LLM response
            reply = await self._safe_generate(
                f"{history_context}\n\nUser: {text}\n\nAssistant:",
                system_prompt="You are a helpful tutor for online courses.",
            )
            debug_info = None

        # Save bot reply to DB
        await self.context_manager.add_message(
            session_id=session.id, sender=Sender.BOT, text=reply
        )

        session.last_intent = intent.value
        await self.context_manager.update_session(session)
        return reply, debug_info

    def _build_history_context(self, history: list) -> str:
        """Build a conversation history string from recent messages."""
        if not history:
            return ""
        lines = []
        for msg in history[-10:]:  # Last 10 messages
            role = "User" if msg.sender == Sender.USER else "Assistant"
            lines.append(f"{role}: {msg.text}")
        return "\n".join(lines)

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
        
        Only falls back to dummy if DEMO_MODE=True or LLM is not configured.
        Otherwise, errors are propagated as 5xx.
        """
        from app.services.llm_utils import safe_llm_generate
        return await safe_llm_generate(
            self.llm_primary,
            self.llm_fallback,
            prompt,
            system_prompt=system_prompt,
            temperature=temperature,
            max_tokens=max_tokens,
        )


