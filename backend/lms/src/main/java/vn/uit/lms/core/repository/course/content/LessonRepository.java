package vn.uit.lms.core.repository.course.content;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.uit.lms.core.entity.course.content.Lesson;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
}
