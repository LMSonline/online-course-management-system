"""Handler for course Q&A intent."""

from typing import Optional, Dict, Any
from app.domain.models import ChatSession
from app.services.handlers.base import IntentHandler
from app.services.retrieval_service import RetrievalParams, RetrievalService
from app.infra.llm_client import LLMClient


class CourseQAHandler(IntentHandler):
    """Handles ASK_COURSE_QA intent using RAG."""

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
        """Handle course Q&A using RAG."""
        debug = kwargs.get("debug", False)
        
        if not session.current_course_id:
            return (
                "Which course are you asking about? Please provide a course_id.",
                None,
            )
        
        params = RetrievalParams(
            course_ids=[session.current_course_id],
            top_k=kwargs.get("top_k", 5),
            score_threshold=kwargs.get("score_threshold"),
        )
        docs = await self.retrieval_service.retrieve(
            question=request_text, params=params
        )
        context = "\n".join(d.content for d in docs)
        
        prompt = (
            f"{history_context}\n\n"
            "Use the course content below to answer the question.\n\n"
            f"Course content:\n{context}\n\n"
            f"User question: {request_text}\n\n"
            "Assistant:"
        )
        
        reply = await self._safe_generate(
            prompt,
            system_prompt=(
                "You are an LMS teaching assistant. Only answer using the provided context. "
                "If the answer is not in the context, say you are not sure."
            ),
        )

        debug_info = None
        if debug:
            debug_info = {
                "chunks": [
                    {
                        "course_id": d.course_id,
                        "lesson_id": d.lesson_id,
                        "section": d.section,
                        "score": d.score,
                        "text_preview": (
                            d.content[:200] + "..." if len(d.content) > 200 else d.content
                        ),
                    }
                    for d in docs
                ]
            }

        return reply, debug_info

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

