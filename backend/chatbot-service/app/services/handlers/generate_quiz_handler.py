"""Handler for quiz generation intent."""

import json
from typing import Optional, Dict, Any
from app.domain.models import ChatSession
from app.services.handlers.base import IntentHandler
from app.services.retrieval_service import RetrievalParams, RetrievalService
from app.infra.llm_client import LLMClient


class GenerateQuizHandler(IntentHandler):
    """Handles ASK_GENERATE_QUIZ intent - generates quiz questions from course content."""

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
        Generate quiz questions from course content.
        
        Expected request format: "Tạo cho em 5 câu trắc nghiệm về bài X"
        or "Generate 5 multiple choice questions about topic Y"
        """
        if not session.current_course_id:
            return (
                "To generate a quiz, please specify which course you're studying.",
                None,
            )

        # Extract number of questions and topic from request
        num_questions = self._extract_number(request_text) or 5
        topic = self._extract_topic(request_text)

        # Retrieve relevant content
        params = RetrievalParams(
            course_ids=[session.current_course_id],
            top_k=kwargs.get("top_k", 10),  # Get more chunks for quiz generation
        )
        docs = await self.retrieval_service.retrieve(
            question=topic or request_text, params=params
        )
        context = "\n".join(d.content for d in docs)

        # Generate quiz using LLM
        prompt = (
            f"Based on the following course content, generate {num_questions} multiple-choice questions.\n\n"
            f"Course content:\n{context}\n\n"
            "For each question, provide:\n"
            "- The question text\n"
            "- 4 answer options (A, B, C, D)\n"
            "- The correct answer (A, B, C, or D)\n"
            "- A brief explanation (1-2 sentences)\n\n"
            "Format your response as a JSON array with this structure:\n"
            '[\n'
            '  {\n'
            '    "question": "Question text?",\n'
            '    "options": {"A": "option A", "B": "option B", "C": "option C", "D": "option D"},\n'
            '    "correct_answer": "A",\n'
            '    "explanation": "Brief explanation"\n'
            '  }\n'
            ']\n\n'
            "Generate the quiz now:"
        )

        reply_text = await self._safe_generate(
            prompt,
            system_prompt=(
                "You are a quiz generator for online courses. "
                "Generate clear, educational multiple-choice questions based on the provided content."
            ),
            temperature=0.7,  # Slightly higher for creativity
            max_tokens=1500,  # More tokens for multiple questions
        )

        # Try to parse JSON from reply
        quiz_data = self._extract_json(reply_text)
        
        # Format reply for user
        if quiz_data:
            formatted = self._format_quiz_reply(quiz_data)
            return formatted, {"quiz_data": quiz_data, "num_questions": num_questions}
        else:
            # Fallback: return raw LLM response
            return reply_text, None

    def _extract_number(self, text: str) -> Optional[int]:
        """Extract number of questions from text."""
        import re
        match = re.search(r'(\d+)', text)
        return int(match.group(1)) if match else None

    def _extract_topic(self, text: str) -> Optional[str]:
        """Extract topic from request (simple heuristic)."""
        # Look for patterns like "về bài X", "about topic Y"
        import re
        patterns = [
            r'về\s+(.+)',
            r'about\s+(.+)',
            r'topic\s+(.+)',
        ]
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        return None

    def _extract_json(self, text: str) -> Optional[list]:
        """Extract JSON array from LLM response."""
        import re
        # Try to find JSON array in the response
        json_match = re.search(r'\[.*\]', text, re.DOTALL)
        if json_match:
            try:
                return json.loads(json_match.group(0))
            except json.JSONDecodeError:
                pass
        return None

    def _format_quiz_reply(self, quiz_data: list) -> str:
        """Format quiz data into a readable reply."""
        lines = ["📝 Quiz Questions:\n"]
        for i, item in enumerate(quiz_data, 1):
            lines.append(f"\nQuestion {i}: {item.get('question', 'N/A')}")
            options = item.get('options', {})
            for key in ['A', 'B', 'C', 'D']:
                if key in options:
                    lines.append(f"  {key}. {options[key]}")
            lines.append(f"  ✅ Correct answer: {item.get('correct_answer', 'N/A')}")
            if 'explanation' in item:
                lines.append(f"  💡 Explanation: {item['explanation']}")
        return "\n".join(lines)

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

