from app.domain.enums import Intent


class NLUService:

    def detect_intent(self, text: str) -> Intent:
        t = text.lower()
        if "kế hoạch" in t or "plan" in t:
            return Intent.ASK_STUDY_PLAN
        if "gợi ý" in t or "recommend" in t:
            return Intent.ASK_RECOMMEND
        if "là gì" in t or "giải thích" in t:
            return Intent.ASK_GENERAL_QA
        # mặc định coi là Course Q&A
        return Intent.ASK_COURSE_QA
