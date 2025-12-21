package vn.uit.lms.core.repository.course;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import vn.uit.lms.core.domain.Student;
import vn.uit.lms.core.domain.course.Course;
import vn.uit.lms.core.domain.course.CourseReview;

import java.util.List;

@Repository
public interface CourseReviewRepository extends JpaRepository<CourseReview, Long>, JpaSpecificationExecutor<CourseReview> {

    boolean existsByCourseAndStudent(Course course, Student student);
    Page<CourseReview> findAllByCourse(Course course, Pageable pageable);
    List<CourseReview> findAllByCourse(Course course);
}
