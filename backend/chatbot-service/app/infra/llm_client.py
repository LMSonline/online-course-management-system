from abc import ABC, abstractmethod


class LLMClient(ABC):
    @abstractmethod
    async def generate(self, prompt: str) -> str:
        ...

class DummyLLMClient(LLMClient):
    async def generate(self, prompt: str) -> str:
       
        return f"[LLM demo response]\n\n{prompt[:1000]}"