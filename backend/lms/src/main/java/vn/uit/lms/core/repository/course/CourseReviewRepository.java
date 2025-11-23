package vn.uit.lms.core.repository.course;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import vn.uit.lms.core.entity.Student;
import vn.uit.lms.core.entity.course.Course;
import vn.uit.lms.core.entity.course.CourseReview;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseReviewRepository extends JpaRepository<CourseReview, Long>, JpaSpecificationExecutor<CourseReview> {

    boolean existsByCourseAndStudent(Course course, Student student);
    Page<CourseReview> findAllByCourse(Course course, Pageable pageable);
    List<CourseReview> findAllByCourse(Course course);
}
