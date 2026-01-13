"""Handler for course recommendation intent."""

from typing import Optional, Dict, Any
from app.domain.models import ChatSession
from app.services.handlers.base import IntentHandler
from app.infra.rs_client import RecommendationClient
from app.infra.llm_client import LLMClient


class RecommendHandler(IntentHandler):
    """Handles ASK_RECOMMEND intent - recommends courses."""

    def __init__(
        self,
        rs_client: RecommendationClient,
        llm_primary: LLMClient,
        llm_fallback: Optional[LLMClient] = None,
    ):
        self.rs_client = rs_client
        self.llm_primary = llm_primary
        self.llm_fallback = llm_fallback

    async def handle(
        self,
        request_text: str,
        session: ChatSession,
        history_context: str = "",
        **kwargs
    ) -> tuple[str, Optional[Dict[str, Any]]]:
        """Handle course recommendation."""
        user_id = session.user_id
        courses = await self.rs_client.get_home_recommendations(user_id)
        
        if not courses:
            return "I don't have any courses to recommend yet.", None

        summary = "\n".join(
            f"- {c.title}: {c.description}" for c in courses
        )
        prompt = (
            f"{history_context}\n\n"
            "Based on the recommended courses below, suggest 2–3 options and explain briefly why they are suitable.\n\n"
            f"Recommended courses:\n{summary}\n\n"
            f"User: {request_text}\n\n"
            "Assistant:"
        )
        
        reply = await self._safe_generate(
            prompt,
            system_prompt=(
                "You are a course advisor that helps students choose suitable courses."
            ),
        )
        
        return reply, {"num_recommendations": len(courses)}

    async def _safe_generate(
        self,
        prompt: str,
        *,
        system_prompt: Optional[str] = None,
        temperature: float = 0.2,
        max_tokens: int = 512,
    ) -> str:
        """Call LLM with fallback."""
        from app.services.llm_utils import safe_llm_generate
        return await safe_llm_generate(
            self.llm_primary,
            self.llm_fallback,
            prompt,
            system_prompt=system_prompt,
            temperature=temperature,
            max_tokens=max_tokens,
        )

