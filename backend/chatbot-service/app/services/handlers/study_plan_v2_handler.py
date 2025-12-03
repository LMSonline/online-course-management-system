"""Handler for enhanced study plan intent with constraints."""

from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
from app.domain.models import ChatSession
from app.services.handlers.base import IntentHandler
from app.services.retrieval_service import RetrievalParams, RetrievalService
from app.infra.llm_client import LLMClient


class StudyPlanV2Handler(IntentHandler):
    """
    Handles enhanced study plan generation with constraints:
    - Exam date
    - Free days per week
    - Already completed lessons
    """

    def __init__(
        self,
        retrieval_service: RetrievalService,
        llm_primary: LLMClient,
        llm_fallback: Optional[LLMClient] = None,
    ):
        self.retrieval_service = retrieval_service
        self.llm_primary = llm_primary
        self.llm_fallback = llm_fallback

    async def handle(
        self,
        request_text: str,
        session: ChatSession,
        history_context: str = "",
        **kwargs
    ) -> tuple[str, Optional[Dict[str, Any]]]:
        """
        Generate enhanced study plan with constraints.
        
        Parameters:
        - exam_date: Target exam date (ISO format string)
        - free_days_per_week: Number of days available per week
        - completed_lessons: List of lesson IDs already completed
        """
        if not session.current_course_id:
            return (
                "To create a study plan, please specify which course you're studying.",
                None,
            )

        # Extract constraints
        exam_date_str = kwargs.get("exam_date")
        free_days = kwargs.get("free_days_per_week", 5)
        completed_lessons = kwargs.get("completed_lessons", [])

        # Calculate days until exam
        days_until_exam = None
        if exam_date_str:
            try:
                exam_date = datetime.fromisoformat(exam_date_str.replace('Z', '+00:00'))
                days_until_exam = (exam_date - datetime.now()).days
            except Exception:
                pass

        # Retrieve course content to understand structure
        params = RetrievalParams(
            course_ids=[session.current_course_id],
            top_k=20,  # Get more chunks to understand course structure
        )
        docs = await self.retrieval_service.retrieve(
            question="course structure lessons topics", params=params
        )
        course_content = "\n".join(d.content for d in docs[:10])  # Limit content

        # Build prompt with constraints
        constraints_text = []
        if days_until_exam:
            constraints_text.append(f"Exam date: {exam_date_str} ({days_until_exam} days from now)")
        constraints_text.append(f"Available days per week: {free_days}")
        if completed_lessons:
            constraints_text.append(f"Already completed lessons: {', '.join(completed_lessons)}")

        prompt = (
            f"Create a detailed study plan based on the following course content and constraints:\n\n"
            f"Constraints:\n" + "\n".join(f"- {c}" for c in constraints_text) + "\n\n"
            f"Course content overview:\n{course_content}\n\n"
            "Generate a day-by-day study plan with:\n"
            "- Specific topics/lessons for each day\n"
            "- Tags: 'review', 'new', 'quiz', or 'project'\n"
            "- Estimated time per day\n"
            "- Milestones/checkpoints\n\n"
            "Format as a structured plan that the student can follow step by step.\n\n"
            "Study plan:"
        )

        reply = await self._safe_generate(
            prompt,
            system_prompt=(
                "You are a study plan generator that creates realistic, achievable study plans "
                "based on time constraints and student progress. Be specific and practical."
            ),
            temperature=0.4,
            max_tokens=1200,
        )

        return reply, {
            "course_id": session.current_course_id,
            "days_until_exam": days_until_exam,
            "free_days_per_week": free_days,
            "completed_lessons": len(completed_lessons),
        }

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
            return "Sorry, I couldn't generate the study plan. Please try again later."

