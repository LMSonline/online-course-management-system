from __future__ import annotations

import os
from abc import ABC, abstractmethod
from typing import Any, Dict

import httpx


class LLMClient(ABC):
    """
    Abstract base class for LLM providers.

    Implementations must expose a simple `generate(prompt) -> str` API so the
    rest of the system does not depend on any concrete vendor.
    """

    @abstractmethod
    async def generate(self, prompt: str) -> str:
        ...


class DummyLLMClient(LLMClient):
    """
    Very small echo client used for local development and tests.
    """

    async def generate(self, prompt: str) -> str:
        return f"[LLM demo response]\n\n{prompt[:1000]}"


class Llama3Client(LLMClient):
    """
    Llama 3 client using an OpenAI-compatible HTTP API (e.g. Groq, Fireworks).

    Required environment variables:
    - LLAMA3_API_BASE  (e.g. https://api.groq.com/openai/v1)
    - LLAMA3_API_KEY
    - LLAMA3_MODEL_NAME (e.g. llama-3.1-70b-instruct or llama-3.1-8b-instruct)
    """

    def __init__(
        self,
        api_base: str | None = None,
        api_key: str | None = None,
        model_name: str | None = None,
        timeout: float = 30.0,
    ) -> None:
        self.api_base = api_base or os.getenv("LLAMA3_API_BASE", "").rstrip("/")
        self.api_key = api_key or os.getenv("LLAMA3_API_KEY", "")
        self.model_name = model_name or os.getenv("LLAMA3_MODEL_NAME", "")
        self.timeout = timeout

        if not self.api_base:
            raise ValueError("LLAMA3_API_BASE must be set for Llama3Client.")
        if not self.api_key:
            raise ValueError("LLAMA3_API_KEY must be set for Llama3Client.")
        if not self.model_name:
            raise ValueError("LLAMA3_MODEL_NAME must be set for Llama3Client.")

    async def generate(self, prompt: str) -> str:
        """
        Call the remote Llama 3 API using the OpenAI-compatible /chat/completions route.
        """
        url = f"{self.api_base}/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload: Dict[str, Any] = {
            "model": self.model_name,
            "messages": [
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            "temperature": 0.2,
            "max_tokens": 512,
        }

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.post(url, headers=headers, json=payload)
        resp.raise_for_status()
        data = resp.json()

        # OpenAI-compatible schema: choices[0].message.content
        try:
            return data["choices"][0]["message"]["content"]
        except (KeyError, IndexError) as exc:  # pragma: no cover - defensive
            raise RuntimeError(f"Unexpected Llama3 response format: {data}") from exc
