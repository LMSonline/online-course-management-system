package vn.uit.lms.core.repository.learning;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vn.uit.lms.core.domain.learning.Progress;
import vn.uit.lms.shared.constant.ProgressStatus;

import java.util.List;
import java.util.Optional;

public interface ProgressRepository extends JpaRepository<Progress, Long>, JpaSpecificationExecutor<Progress> {

    /**
     * Find progress by student, lesson and course version
     */
    @Query("SELECT p FROM Progress p " +
            "WHERE p.student.id = :studentId " +
            "AND p.lesson.id = :lessonId " +
            "AND p.courseVersion.id = :courseVersionId " +
            "AND p.deletedAt IS NULL")
    Optional<Progress> findByStudentIdAndLessonIdAndCourseVersionId(
            @Param("studentId") Long studentId,
            @Param("lessonId") Long lessonId,
            @Param("courseVersionId") Long courseVersionId
    );

    /**
     * Find all progress for a student in a course
     */
    @Query("SELECT p FROM Progress p " +
            "LEFT JOIN FETCH p.lesson l " +
            "WHERE p.student.id = :studentId " +
            "AND p.course.id = :courseId " +
            "AND p.deletedAt IS NULL " +
            "ORDER BY l.orderIndex")
    List<Progress> findByStudentIdAndCourseId(
            @Param("studentId") Long studentId,
            @Param("courseId") Long courseId
    );

    /**
     * Find all progress for a student
     */
    @Query("SELECT p FROM Progress p " +
            "LEFT JOIN FETCH p.lesson " +
            "LEFT JOIN FETCH p.course " +
            "WHERE p.student.id = :studentId " +
            "AND p.deletedAt IS NULL")
    List<Progress> findByStudentId(@Param("studentId") Long studentId);

    /**
     * Count completed lessons for a student in a course
     */
    @Query("SELECT COUNT(p) FROM Progress p " +
            "WHERE p.student.id = :studentId " +
            "AND p.course.id = :courseId " +
            "AND p.status = 'COMPLETED' " +
            "AND p.deletedAt IS NULL")
    Long countCompletedLessonsByStudentAndCourse(
            @Param("studentId") Long studentId,
            @Param("courseId") Long courseId
    );

    /**
     * Count viewed lessons for a student in a course
     */
    @Query("SELECT COUNT(p) FROM Progress p " +
            "WHERE p.student.id = :studentId " +
            "AND p.course.id = :courseId " +
            "AND p.status IN ('VIEWED', 'COMPLETED') " +
            "AND p.deletedAt IS NULL")
    Long countViewedLessonsByStudentAndCourse(
            @Param("studentId") Long studentId,
            @Param("courseId") Long courseId
    );

    /**
     * Get total watched duration for a student in a course
     */
    @Query("SELECT COALESCE(SUM(p.watchedDurationSeconds), 0) FROM Progress p " +
            "WHERE p.student.id = :studentId " +
            "AND p.course.id = :courseId " +
            "AND p.deletedAt IS NULL")
    Integer getTotalWatchedDurationByStudentAndCourse(
            @Param("studentId") Long studentId,
            @Param("courseId") Long courseId
    );

    /**
     * Count students with progress in a course
     */
    @Query("SELECT COUNT(DISTINCT p.student.id) FROM Progress p " +
            "WHERE p.course.id = :courseId " +
            "AND p.deletedAt IS NULL")
    Long countStudentsWithProgressInCourse(@Param("courseId") Long courseId);

    /**
     * Get average completion percentage for a course
     */
    @Query("SELECT AVG(CAST(p.completedCount AS float) / CAST(p.totalCount AS float) * 100) " +
            "FROM (SELECT p.student.id as studentId, " +
            "      COUNT(CASE WHEN p.status = 'COMPLETED' THEN 1 END) as completedCount, " +
            "      COUNT(p.id) as totalCount " +
            "      FROM Progress p " +
            "      WHERE p.course.id = :courseId AND p.deletedAt IS NULL " +
            "      GROUP BY p.student.id) as p")
    Double getAverageCompletionPercentageForCourse(@Param("courseId") Long courseId);

    /**
     * Find progress statistics by lesson
     */
    @Query("SELECT p.lesson.id as lessonId, COUNT(p.id) as completedCount " +
            "FROM Progress p " +
            "WHERE p.course.id = :courseId " +
            "AND p.status = 'COMPLETED' " +
            "AND p.deletedAt IS NULL " +
            "GROUP BY p.lesson.id " +
            "ORDER BY completedCount DESC")
    List<Object[]> findLessonCompletionStats(@Param("courseId") Long courseId);

    /**
     * Check if lesson is completed by student
     */
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END " +
            "FROM Progress p " +
            "WHERE p.student.id = :studentId " +
            "AND p.lesson.id = :lessonId " +
            "AND p.status = 'COMPLETED' " +
            "AND p.deletedAt IS NULL")
    boolean isLessonCompletedByStudent(
            @Param("studentId") Long studentId,
            @Param("lessonId") Long lessonId
    );
}
