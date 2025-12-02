
from typing import Dict, List, Optional
from app.domain.models import Course


class InMemoryCourseRepository:
    """Fake DB cho demo: lưu vài course trong RAM."""

    def __init__(self):
        self._courses: Dict[str, Course] = {}

        # Seed dữ liệu demo
        self._seed()

    def _seed(self):
        demo_courses = [
            Course(
                id="course_python_basic",
                title="Python Basics",
                description="Introduction to Python for absolute beginners.",
                level="beginner",
                tags=["python", "programming", "beginner"],
            ),
            Course(
                id="course_python_advanced",
                title="Advanced Python",
                description="Advanced features and best practices in Python.",
                level="intermediate",
                tags=["python", "advanced"],
            ),
            Course(
                id="course_ds_foundations",
                title="Data Science Foundations",
                description="Core concepts in statistics and data science.",
                level="intermediate",
                tags=["data-science", "statistics"],
            ),
            Course(
                id="course_ml_intro",
                title="Intro to Machine Learning",
                description="Supervised and unsupervised learning basics.",
                level="intermediate",
                tags=["machine-learning", "data-science"],
            ),
        ]
        for c in demo_courses:
            self._courses[c.id] = c

    def list_courses(self) -> List[Course]:
        return list(self._courses.values())

    def get_course(self, course_id: str) -> Optional[Course]:
        return self._courses.get(course_id)
