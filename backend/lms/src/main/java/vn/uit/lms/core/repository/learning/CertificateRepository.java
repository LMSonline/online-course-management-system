package vn.uit.lms.core.repository.learning;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vn.uit.lms.core.domain.learning.Certificate;

import java.util.List;
import java.util.Optional;

public interface CertificateRepository extends JpaRepository<Certificate, Long>, JpaSpecificationExecutor<Certificate> {

    /**
     * Find certificate by code
     */
    @Query("SELECT c FROM Certificate c " +
            "LEFT JOIN FETCH c.student s " +
            "LEFT JOIN FETCH c.course " +
            "WHERE c.code = :code " +
            "AND c.deletedAt IS NULL")
    Optional<Certificate> findByCode(@Param("code") String code);

    /**
     * Find all certificates by student ID
     */
    @Query("SELECT c FROM Certificate c " +
            "LEFT JOIN FETCH c.course " +
            "WHERE c.student.id = :studentId " +
            "AND c.deletedAt IS NULL " +
            "ORDER BY c.issuedAt DESC")
    List<Certificate> findByStudentIdOrderByIssuedAtDesc(@Param("studentId") Long studentId);

    /**
     * Find all certificates by course ID
     */
    @Query("SELECT c FROM Certificate c " +
            "LEFT JOIN FETCH c.student s " +
            "WHERE c.course.id = :courseId " +
            "AND c.deletedAt IS NULL " +
            "ORDER BY c.issuedAt DESC")
    List<Certificate> findByCourseIdOrderByIssuedAtDesc(@Param("courseId") Long courseId);

    /**
     * Check if certificate exists for enrollment
     */
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Certificate c " +
            "WHERE c.student.id = :studentId " +
            "AND c.courseVersion.id = :courseVersionId " +
            "AND c.deletedAt IS NULL")
    boolean existsByStudentIdAndCourseVersionId(
            @Param("studentId") Long studentId,
            @Param("courseVersionId") Long courseVersionId
    );
}
