"""Handler for code explanation intent."""

import re
from typing import Optional, Dict, Any
from app.domain.models import ChatSession
from app.services.handlers.base import IntentHandler
from app.infra.llm_client import LLMClient


class ExplainCodeHandler(IntentHandler):
    """Handles ASK_EXPLAIN_CODE intent - explains code snippets line by line."""

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
        """
        Explain a code snippet.
        
        Expected request: code snippet + optional language hint
        """
        # Extract code and language
        code = self._extract_code(request_text)
        language = kwargs.get("language") or self._detect_language(code)

        if not code:
            return (
                "I couldn't find any code in your message. Please provide a code snippet to explain.",
                None,
            )

        # Generate explanation
        prompt = (
            f"Explain the following {language} code step by step:\n\n"
            f"```{language}\n{code}\n```\n\n"
            "Provide:\n"
            "1. A brief overview of what the code does\n"
            "2. Line-by-line or block-by-block explanation\n"
            "3. Time/space complexity if relevant\n"
            "4. Any important concepts demonstrated\n\n"
            "Explanation:"
        )

        reply = await self._safe_generate(
            prompt,
            system_prompt=(
                "You are a code tutor that explains code clearly and concisely. "
                "Break down complex code into understandable parts."
            ),
            temperature=0.3,
            max_tokens=1000,
        )

        return reply, {
            "language": language,
            "code_length": len(code),
            "lines": len(code.splitlines()),
        }

    def _extract_code(self, text: str) -> str:
        """Extract code from text (look for code blocks or indented text)."""
        # Try to find code blocks
        code_block_match = re.search(r'```(?:\w+)?\n?(.*?)```', text, re.DOTALL)
        if code_block_match:
            return code_block_match.group(1).strip()

        # Look for lines that look like code (contain common keywords/operators)
        lines = text.splitlines()
        code_lines = []
        for line in lines:
            stripped = line.strip()
            # Heuristic: if line contains code-like patterns
            if (
                stripped
                and (
                    '=' in stripped
                    or '(' in stripped
                    or '[' in stripped
                    or '{' in stripped
                    or stripped.startswith(('def ', 'class ', 'import ', 'from '))
                    or re.match(r'^\s*\w+\s*\(', stripped)  # Function call
                )
            ):
                code_lines.append(line)

        if code_lines:
            return '\n'.join(code_lines)

        # Fallback: return text if it looks like code
        if any(char in text for char in ['=', '(', '[', '{', ';']):
            return text.strip()

        return ""

    def _detect_language(self, code: str) -> str:
        """Detect programming language from code snippet."""
        code_lower = code.lower()
        
        # Python indicators
        if any(keyword in code for keyword in ['def ', 'import ', 'from ', 'print(', '__init__']):
            return "python"
        
        # Java indicators
        if any(keyword in code for keyword in ['public class', 'public static', 'System.out']):
            return "java"
        
        # JavaScript indicators
        if any(keyword in code for keyword in ['function ', 'const ', 'let ', 'var ', 'console.log']):
            return "javascript"
        
        # Default
        return "python"

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

