package vn.uit.lms.core.repository.course;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import vn.uit.lms.core.domain.course.Course;
import vn.uit.lms.core.domain.course.CourseVersion;
import vn.uit.lms.shared.constant.CourseStatus;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseVersionRepository extends JpaRepository<CourseVersion, Long>, JpaSpecificationExecutor<CourseVersion> {
    List<CourseVersion> findAllByCourseAndDeletedAtIsNull(Course course);

    List<CourseVersion> findAllByCourseAndDeletedAtIsNotNull(Course course);

    List<CourseVersion> findAllByCourseAndStatusAndDeletedAtIsNull(Course course, CourseStatus status);

    Optional<CourseVersion> findByIdAndDeletedAtIsNull(Long id);

    boolean existsByIdAndDeletedAtIsNull(Long id);

    long countByCourseAndDeletedAtIsNull(Course course);

}
