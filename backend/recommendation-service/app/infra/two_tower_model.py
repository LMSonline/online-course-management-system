from typing import List
from app.domain.models import Course


class TwoTowerModel:
    """
    Mô hình 2-tower mock.
    - get_home_recommendations: demo = sort theo title.
    - get_similar_courses: demo = cùng level + có tag trùng nhau.
    """

    async def get_home_recommendations(
        self, user_id: str, all_courses: List[Course]
    ) -> List[Course]:
        # TODO: sau này encode user, ranking theo embedding
        return sorted(all_courses, key=lambda c: c.title)

    async def get_similar_courses(
        self, target: Course, all_courses: List[Course]
    ) -> List[Course]:
        result: List[Course] = []
        target_tags = set(target.tags)

        for course in all_courses:
            if course.id == target.id:
                continue
            # Điều kiện "similar" rất đơn giản: cùng level hoặc trùng tag
            same_level = course.level == target.level
            shared_tags = len(target_tags & set(course.tags)) > 0
            if same_level or shared_tags:
                result.append(course)

        return result
