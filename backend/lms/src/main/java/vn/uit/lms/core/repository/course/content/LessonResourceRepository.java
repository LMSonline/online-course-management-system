package vn.uit.lms.core.repository.course.content;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.uit.lms.core.domain.course.content.Lesson;
import vn.uit.lms.core.domain.course.content.LessonResource;

import java.util.List;

@Repository
public interface LessonResourceRepository extends JpaRepository<LessonResource, Long> {

    List<LessonResource> findByLessonOrderByOrderIndexAsc(Lesson lesson);
}
