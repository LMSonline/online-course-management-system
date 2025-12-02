from app.domain.enums import Intent


class NLUService:
    """Natural Language Understanding service for intent detection."""

    def detect_intent(self, text: str) -> Intent:
        """
        Detect user intent from text using keyword matching.
        
        TODO: Replace with a more sophisticated NLU model (e.g., fine-tuned classifier).
        """
        t = text.lower()
        
        # Quiz generation
        if any(keyword in t for keyword in ["tạo câu hỏi", "generate quiz", "trắc nghiệm", "multiple choice"]):
            return Intent.ASK_GENERATE_QUIZ
        
        # Code explanation
        if any(keyword in t for keyword in ["giải thích code", "explain code", "code này", "đoạn code"]):
            return Intent.ASK_EXPLAIN_CODE
        
        # Lesson summary
        if any(keyword in t for keyword in ["tóm tắt", "summarize", "summary", "tổng kết"]):
            return Intent.ASK_SUMMARY
        
        # Study plan (enhanced)
        if any(keyword in t for keyword in ["kế hoạch học", "study plan", "lịch học", "exam date"]):
            return Intent.ASK_STUDY_PLAN
        
        # Recommendations
        if any(keyword in t for keyword in ["gợi ý", "recommend", "suggest", "khóa học nào"]):
            return Intent.ASK_RECOMMEND
        
        # General QA
        if any(keyword in t for keyword in ["là gì", "giải thích", "what is", "explain"]):
            return Intent.ASK_GENERAL_QA
        
        # Default: Course Q&A
        return Intent.ASK_COURSE_QA
