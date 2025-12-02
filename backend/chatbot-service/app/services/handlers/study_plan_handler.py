"""Handler for basic study plan intent."""

from typing import Optional, Dict, Any
from app.domain.models import ChatSession
from app.services.handlers.base import IntentHandler
from app.services.study_plan_service import StudyPlanService
from app.infra.llm_client import LLMClient


class StudyPlanHandler(IntentHandler):
    """Handles ASK_STUDY_PLAN intent - generates basic study plans."""

    def __init__(
        self,
        study_plan_service: StudyPlanService,
        llm_primary: LLMClient,
        llm_fallback: Optional[LLMClient] = None,
    ):
        self.study_plan_service = study_plan_service
        self.llm_primary = llm_primary
        self.llm_fallback = llm_fallback

    async def handle(
        self,
        request_text: str,
        session: ChatSession,
        history_context: str = "",
        **kwargs
    ) -> tuple[str, Optional[Dict[str, Any]]]:
        """Handle basic study plan generation."""
        if not session.current_course_id:
            return (
                "To create a study plan, please tell me which course you want to study (course_id).",
                None,
            )
        
        plan = await self.study_plan_service.generate_plan(
            course_id=session.current_course_id,
            days=kwargs.get("days", 7),
            hours_per_day=kwargs.get("hours_per_day", 1),
        )
        raw = "\n".join(
            f"Day {item.day}: {', '.join(item.lessons)}" for item in plan
        )
        prompt = (
            f"{history_context}\n\n"
            "Turn the following rough plan into a friendly study plan for the student:\n\n"
            f"{raw}\n\n"
            "Assistant:"
        )
        
        reply = await self._safe_generate(
            prompt,
            system_prompt="You turn rough study plans into friendly step-by-step plans.",
        )
        
        return reply, {"course_id": session.current_course_id, "days": len(plan)}

    async def _safe_generate(
        self,
        prompt: str,
        *,
        system_prompt: Optional[str] = None,
        temperature: float = 0.2,
        max_tokens: int = 512,
    ) -> str:
        """Call LLM with fallback."""
        try:
            return await self.llm_primary.generate(
                prompt,
                system_prompt=system_prompt,
                temperature=temperature,
                max_tokens=max_tokens,
            )
        except Exception:
            if self.llm_fallback is not None:
                try:
                    return await self.llm_fallback.generate(
                        prompt,
                        system_prompt=system_prompt,
                        temperature=temperature,
                        max_tokens=max_tokens,
                    )
                except Exception:
                    pass
            return "Sorry, the AI assistant is currently unavailable. Please try again later."

