"""
Shared utilities for LLM calls with proper error handling.
"""

import logging
from typing import Optional
from app.core.settings import settings
from app.infra.llm_client import LLMClient, DummyLLMClient

logger = logging.getLogger(__name__)


async def safe_llm_generate(
    llm_primary: LLMClient,
    llm_fallback: Optional[LLMClient],
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
    try:
        return await llm_primary.generate(
            prompt,
            system_prompt=system_prompt,
            temperature=temperature,
            max_tokens=max_tokens,
        )
    except Exception as exc:
        # Only use fallback if DEMO_MODE=True or if primary is already DummyLLMClient
        is_demo_mode = settings.DEMO_MODE
        is_primary_dummy = isinstance(llm_primary, DummyLLMClient)
        
        if is_demo_mode or is_primary_dummy:
            # Safe to fall back to dummy in demo mode or when already using dummy
            logger.warning("Primary LLM call failed, falling back to dummy: %s", exc)
            if llm_fallback is not None:
                try:
                    return await llm_fallback.generate(
                        prompt,
                        system_prompt=system_prompt,
                        temperature=temperature,
                        max_tokens=max_tokens,
                    )
                except Exception as exc2:
                    logger.error("Fallback LLM call also failed: %s", exc2)
            return "Sorry, the AI assistant is currently unavailable. Please try again later."
        else:
            # LLM is configured but failed - log error and re-raise as 5xx
            logger.error("Configured LLM (llama3) call failed: %s", exc, exc_info=True)
            raise RuntimeError(f"LLM API call failed: {exc}") from exc

