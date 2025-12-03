"""Handler for lesson summarization intent."""

from typing import Optional, Dict, Any
from app.domain.models import ChatSession
from app.services.handlers.base import IntentHandler
from app.services.retrieval_service import RetrievalParams, RetrievalService
from app.infra.llm_client import LLMClient


class SummarizeLessonHandler(IntentHandler):
    """Handles ASK_SUMMARY intent - generates structured lesson summaries."""

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
        Generate structured summary for a lesson.
        
        Expected request: "Tóm tắt bài học này" or "Summarize this lesson"
        """
        if not session.current_course_id:
            return (
                "To summarize a lesson, please specify which course you're studying.",
                None,
            )

        # Extract lesson_id if mentioned
        lesson_id = kwargs.get("lesson_id") or self._extract_lesson_id(request_text)

        # Retrieve relevant content
        params = RetrievalParams(
            course_ids=[session.current_course_id],
            lesson_id=lesson_id,
            top_k=kwargs.get("top_k", 10),
        )
        docs = await self.retrieval_service.retrieve(
            question=request_text, params=params
        )
        context = "\n".join(d.content for d in docs)

        if not context:
            return "I couldn't find any content to summarize for this lesson.", None

        # Generate structured summary
        prompt = (
            f"Based on the following lesson content, create a structured summary with:\n\n"
            "1. Overview: A brief 2-3 sentence overview of the lesson\n"
            "2. Key Concepts: List the main concepts covered (bullet points)\n"
            "3. Common Mistakes: List common mistakes students make (if applicable)\n"
            "4. Takeaways: Key takeaways students should remember\n\n"
            f"Lesson content:\n{context}\n\n"
            "Generate the summary now:"
        )

        reply = await self._safe_generate(
            prompt,
            system_prompt=(
                "You are a teaching assistant that creates clear, structured summaries "
                "of educational content. Focus on clarity and learning outcomes."
            ),
            temperature=0.3,
            max_tokens=800,
        )

        return reply, {"lesson_id": lesson_id, "num_chunks": len(docs)}

    def _extract_lesson_id(self, text: str) -> Optional[str]:
        """Extract lesson ID from request (simple heuristic)."""
        import re
        # Look for patterns like "bài X", "lesson Y"
        patterns = [
            r'bài\s+(\w+)',
            r'lesson\s+(\w+)',
        ]
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        return None

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
            return "Sorry, I couldn't generate the summary. Please try again later."

