package vn.uit.lms.core.repository.course;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import vn.uit.lms.core.entity.course.CourseReview;
import vn.uit.lms.core.entity.course.CourseVersion;

@Repository
public interface CourseReviewRepository extends JpaRepository<CourseReview, Long>, JpaSpecificationExecutor<CourseReview> {
}
