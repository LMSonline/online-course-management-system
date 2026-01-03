package vn.uit.lms.core.repository.course;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.uit.lms.core.domain.course.CourseTag;

@Repository
public interface CourseTagRepository extends JpaRepository<CourseTag, Long> {
}

