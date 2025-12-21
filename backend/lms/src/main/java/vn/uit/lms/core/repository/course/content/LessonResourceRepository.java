package vn.uit.lms.core.repository.course.content;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.uit.lms.core.domain.course.content.LessonResource;

@Repository
public interface LessonResourceRepository extends JpaRepository<LessonResource, Long> {
}
