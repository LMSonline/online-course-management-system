package vn.uit.lms.core.repository.course;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import vn.uit.lms.core.entity.Teacher;
import vn.uit.lms.core.entity.course.Course;

import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long>, JpaSpecificationExecutor<Course> {

    Optional<Course> findBySlugAndDeletedAtIsNull(String slug);
    Optional<Course> findByIdAndDeletedAtIsNull(Long id);
    boolean existsBySlug(String slug);
}
