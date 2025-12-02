"""Intent handlers for the chatbot service."""

from app.services.handlers.base import IntentHandler
from app.services.handlers.course_qa_handler import CourseQAHandler
from app.services.handlers.general_qa_handler import GeneralQAHandler
from app.services.handlers.recommend_handler import RecommendHandler
from app.services.handlers.study_plan_handler import StudyPlanHandler
from app.services.handlers.generate_quiz_handler import GenerateQuizHandler
from app.services.handlers.summarize_lesson_handler import SummarizeLessonHandler
from app.services.handlers.explain_code_handler import ExplainCodeHandler
from app.services.handlers.study_plan_v2_handler import StudyPlanV2Handler

__all__ = [
    "IntentHandler",
    "CourseQAHandler",
    "GeneralQAHandler",
    "RecommendHandler",
    "StudyPlanHandler",
    "GenerateQuizHandler",
    "SummarizeLessonHandler",
    "ExplainCodeHandler",
    "StudyPlanV2Handler",
]

