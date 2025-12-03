from typing import List
from app.domain.models import StudyPlanItem


class StudyPlanService:
    """
    Demo: fake plan 7 ngày, mỗi ngày 1-2 topic.
    """

    async def generate_plan(
        self, course_id: str, days: int = 7, hours_per_day: int = 1
    ) -> List[StudyPlanItem]:
        topics = [
            "Overview of the course",
            "Core concepts part 1",
            "Core concepts part 2",
            "Practice exercises",
            "Mini project",
            "Review & recap",
            "Final assessment",
        ]
        plan: List[StudyPlanItem] = []
        for i, topic in enumerate(topics, start=1):
            plan.append(StudyPlanItem(day=i, lessons=[topic]))
        return plan
