"""
Direct Groq API client for free-chat MVP.
"""

import httpx
import logging
from fastapi import HTTPException

from app.core.settings import settings

logger = logging.getLogger(__name__)


async def groq_chat(user_text: str) -> str:
    """
    Call Groq chat/completions API and return the reply text.
    
    Args:
        user_text: User's message text
        
    Returns:
        LLM reply text from choices[0].message.content
        
    Raises:
        HTTPException(502): If Groq API call fails (non-2xx or parse error)
    """
    api_base = settings.LLAMA3_API_BASE or "https://api.groq.com/openai/v1"
    api_key = settings.LLAMA3_API_KEY
    model_name = settings.LLAMA3_MODEL_NAME
    
    if not api_key:
        raise HTTPException(
            status_code=502,
            detail="LLAMA3_API_KEY is not configured"
        )
    if not model_name:
        raise HTTPException(
            status_code=502,
            detail="LLAMA3_MODEL_NAME is not configured"
        )
    
    # Ensure API base doesn't have trailing slash
    api_base = api_base.rstrip("/")
    url = f"{api_base}/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    
    payload = {
        "model": model_name,
        "messages": [
            {"role": "system", "content": "You are a helpful AI tutor."},
            {"role": "user", "content": user_text}
        ],
        "temperature": 0.2,
        "max_tokens": 512
    }
    
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(url, headers=headers, json=payload)
            
            # Handle non-2xx responses
            if resp.status_code not in (200, 201):
                response_text = resp.text[:1000] if resp.text else ""
                error_detail = f"Groq API returned {resp.status_code}: {response_text}"
                logger.error(
                    "Groq API error",
                    extra={
                        "status_code": resp.status_code,
                        "response_preview": response_text,
                    }
                )
                raise HTTPException(status_code=502, detail=error_detail)
            
            # Parse successful response
            data = resp.json()
            return data["choices"][0]["message"]["content"]
            
    except HTTPException:
        # Re-raise HTTPException as-is
        raise
    except httpx.TimeoutException as exc:
        logger.error("Groq API timeout", exc_info=exc)
        raise HTTPException(
            status_code=502,
            detail=f"Groq API timeout: {exc}"
        ) from exc
    except (KeyError, IndexError, ValueError) as exc:
        # Parse error
        logger.error("Groq API response parse error", exc_info=exc)
        response_text = resp.text[:1000] if 'resp' in locals() and resp.text else ""
        raise HTTPException(
            status_code=502,
            detail=f"Groq API response parse error: {exc}. Response preview: {response_text}"
        ) from exc
    except Exception as exc:
        # Any other error
        logger.error("Groq API call failed", exc_info=exc)
        raise HTTPException(
            status_code=502,
            detail=f"Groq API call failed: {exc}"
        ) from exc

