"""Handler for general Q&A intent."""

from typing import Optional, Dict, Any
from app.domain.models import ChatSession
from app.services.handlers.base import IntentHandler
from app.infra.llm_client import LLMClient


class GeneralQAHandler(IntentHandler):
    """Handles ASK_GENERAL_QA intent - general questions without course context."""

    def __init__(
        self,
        llm_primary: LLMClient,
        llm_fallback: Optional[LLMClient] = None,
    ):
        self.llm_primary = llm_primary
        self.llm_fallback = llm_fallback

    async def handle(
        self,
        request_text: str,
        session: ChatSession,
        history_context: str = "",
        **kwargs
    ) -> tuple[str, Optional[Dict[str, Any]]]:
        """Handle general Q&A."""
        prompt = (
            f"{history_context}\n\n"
            "Explain the following concept to a beginner student:\n\n"
            f"User: {request_text}\n\n"
            "Assistant:"
        )
        
        reply = await self._safe_generate(
            prompt,
            system_prompt="You explain technical concepts to beginners in a concise way.",
        )
        
        return reply, None

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

