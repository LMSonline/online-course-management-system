package vn.uit.lms.core.repository.course;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    @Query("SELECT AVG(cr.rating) FROM CourseReview cr WHERE cr.course.id = :courseId AND cr.deletedAt IS NULL")
    Double getAverageRatingByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT COUNT(cr) FROM CourseReview cr WHERE cr.course.id = :courseId AND cr.deletedAt IS NULL")
    Long countByCourseId(@Param("courseId") Long courseId);
}
