"""Registry for intent handlers."""

from typing import Dict, Optional
from app.domain.enums import Intent
from app.services.handlers.base import IntentHandler
from app.services.handlers.course_qa_handler import CourseQAHandler
from app.services.handlers.general_qa_handler import GeneralQAHandler
from app.services.handlers.recommend_handler import RecommendHandler
from app.services.handlers.study_plan_handler import StudyPlanHandler
from app.services.handlers.generate_quiz_handler import GenerateQuizHandler
from app.services.handlers.summarize_lesson_handler import SummarizeLessonHandler
from app.services.handlers.explain_code_handler import ExplainCodeHandler
from app.services.handlers.study_plan_v2_handler import StudyPlanV2Handler
from app.services.retrieval_service import RetrievalService
from app.services.study_plan_service import StudyPlanService
from app.infra.llm_client import LLMClient
from app.infra.rs_client import RecommendationClient


class HandlerRegistry:
    """Registry that maps intents to their handlers."""

    def __init__(
        self,
        retrieval_service: RetrievalService,
        llm_primary: LLMClient,
        llm_fallback: Optional[LLMClient],
        rs_client: RecommendationClient,
        study_plan_service: StudyPlanService,
    ):
        self.handlers: Dict[Intent, IntentHandler] = {}
        
        # Initialize handlers
        self.handlers[Intent.ASK_COURSE_QA] = CourseQAHandler(
            retrieval_service=retrieval_service,
            llm_primary=llm_primary,
            llm_fallback=llm_fallback,
        )
        
        self.handlers[Intent.ASK_GENERAL_QA] = GeneralQAHandler(
            llm_primary=llm_primary,
            llm_fallback=llm_fallback,
        )
        
        self.handlers[Intent.ASK_RECOMMEND] = RecommendHandler(
            rs_client=rs_client,
            llm_primary=llm_primary,
            llm_fallback=llm_fallback,
        )
        
        self.handlers[Intent.ASK_STUDY_PLAN] = StudyPlanHandler(
            study_plan_service=study_plan_service,
            llm_primary=llm_primary,
            llm_fallback=llm_fallback,
        )
        
        self.handlers[Intent.ASK_GENERATE_QUIZ] = GenerateQuizHandler(
            retrieval_service=retrieval_service,
            llm_primary=llm_primary,
            llm_fallback=llm_fallback,
        )
        
        self.handlers[Intent.ASK_SUMMARY] = SummarizeLessonHandler(
            retrieval_service=retrieval_service,
            llm_primary=llm_primary,
            llm_fallback=llm_fallback,
        )
        
        self.handlers[Intent.ASK_EXPLAIN_CODE] = ExplainCodeHandler(
            llm_primary=llm_primary,
            llm_fallback=llm_fallback,
        )
        
        # Use V2 handler for study plan if enhanced features are requested
        # For now, we'll use the basic handler by default
        # V2 can be selected via a parameter in the request

    def get_handler(self, intent: Intent) -> Optional[IntentHandler]:
        """Get handler for an intent."""
        return self.handlers.get(intent)

