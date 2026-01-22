package vn.uit.lms.core.repository.learning;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vn.uit.lms.core.domain.course.Course;
import vn.uit.lms.core.domain.learning.Enrollment;
import vn.uit.lms.shared.constant.EnrollmentStatus;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long>, JpaSpecificationExecutor<Enrollment> {

    /**
     * Find enrollment by student and course version
     */
    @Query("SELECT e FROM Enrollment e " +
            "WHERE e.student.id = :studentId " +
            "AND e.courseVersion.id = :courseVersionId " +
            "AND e.deletedAt IS NULL")
    Optional<Enrollment> findByStudentIdAndCourseVersionId(
            @Param("studentId") Long studentId,
            @Param("courseVersionId") Long courseVersionId
    );

    /**
     * Find all enrollments by student
     */
    @Query("SELECT e FROM Enrollment e " +
            "LEFT JOIN FETCH e.course c " +
            "LEFT JOIN FETCH e.courseVersion cv " +
            "WHERE e.student.id = :studentId " +
            "AND e.deletedAt IS NULL")
    Page<Enrollment> findByStudentId(@Param("studentId") Long studentId, Pageable pageable);

    /**
     * Find all enrollments by course
     */
    @Query("SELECT e FROM Enrollment e " +
            "LEFT JOIN FETCH e.student s " +
            "LEFT JOIN FETCH e.courseVersion cv " +
            "WHERE e.course.id = :courseId " +
            "AND e.deletedAt IS NULL")
    Page<Enrollment> findByCourseId(@Param("courseId") Long courseId, Pageable pageable);

    /**
     * Count enrollments by course and status
     */
    @Query("SELECT COUNT(e) FROM Enrollment e " +
            "WHERE e.course.id = :courseId " +
            "AND e.status = :status " +
            "AND e.deletedAt IS NULL")
    Long countByCourseIdAndStatus(@Param("courseId") Long courseId, @Param("status") EnrollmentStatus status);

    /**
     * Count all enrollments by course
     */
    @Query("SELECT COUNT(e) FROM Enrollment e " +
            "WHERE e.course.id = :courseId " +
            "AND e.deletedAt IS NULL")
    Long countByCourseId(@Param("courseId") Long courseId);

    /**
     * Get average completion percentage by course
     */
    @Query("SELECT AVG(e.completionPercentage) FROM Enrollment e " +
            "WHERE e.course.id = :courseId " +
            "AND e.deletedAt IS NULL")
    Double getAverageCompletionPercentageByCourseId(@Param("courseId") Long courseId);

    /**
     * Get average score by course
     */
    @Query("SELECT AVG(e.averageScore) FROM Enrollment e " +
            "WHERE e.course.id = :courseId " +
            "AND e.averageScore IS NOT NULL " +
            "AND e.deletedAt IS NULL")
    Double getAverageScoreByCourseId(@Param("courseId") Long courseId);

    /**
     * Count certificates issued by course
     */
    @Query("SELECT COUNT(e) FROM Enrollment e " +
            "WHERE e.course.id = :courseId " +
            "AND e.certificateIssued = true " +
            "AND e.deletedAt IS NULL")
    Long countCertificatesIssuedByCourseId(@Param("courseId") Long courseId);

    /**
     * Check if student already enrolled in course (any version, active status)
     */
    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END FROM Enrollment e " +
            "WHERE e.student.id = :studentId " +
            "AND e.course.id = :courseId " +
            "AND e.status = 'ENROLLED' " +
            "AND e.deletedAt IS NULL")
    boolean existsByStudentIdAndCourseIdAndActiveStatus(
            @Param("studentId") Long studentId,
            @Param("courseId") Long courseId
    );

    /**
     * Check if student already enrolled in specific course version
     */
    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END FROM Enrollment e " +
            "WHERE e.student.id = :studentId " +
            "AND e.courseVersion.id = :courseVersionId " +
            "AND e.deletedAt IS NULL")
    boolean existsByStudentIdAndCourseVersionId(
            @Param("studentId") Long studentId,
            @Param("courseVersionId") Long courseVersionId
    );

    /**
     * Find all enrollments for a student in specific course (all versions)
     */
    @Query("SELECT e FROM Enrollment e " +
            "WHERE e.student.id = :studentId " +
            "AND e.course.id = :courseId " +
            "AND e.deletedAt IS NULL " +
            "ORDER BY e.enrolledAt DESC")
    List<Enrollment> findAllByStudentIdAndCourseId(
            @Param("studentId") Long studentId,
            @Param("courseId") Long courseId
    );

    /**
     * Find active enrollment for a student in a course (most recent)
     */
    @Query("SELECT e FROM Enrollment e " +
            "WHERE e.student.id = :studentId " +
            "AND e.course.id = :courseId " +
            "AND e.status = 'ENROLLED' " +
            "AND e.deletedAt IS NULL " +
            "ORDER BY e.enrolledAt DESC")
    Optional<Enrollment> findByStudentIdAndCourseId(
            @Param("studentId") Long studentId,
            @Param("courseId") Long courseId
    );

    boolean existsByCourse(Course course);
    int countByCourseAndStatus(Course course, EnrollmentStatus status);

    /**
     * Check if student has any enrollment with a teacher
     */
    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END FROM Enrollment e " +
            "WHERE e.student.id = :studentId " +
            "AND e.course.teacher.id = :teacherId " +
            "AND e.deletedAt IS NULL")
    boolean existsByStudentIdAndCourseTeacherId(
            @Param("studentId") Long studentId,
            @Param("teacherId") Long teacherId
    );
}
