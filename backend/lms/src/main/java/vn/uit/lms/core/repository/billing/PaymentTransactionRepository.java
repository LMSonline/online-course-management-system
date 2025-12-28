package vn.uit.lms.core.repository.billing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vn.uit.lms.core.domain.billing.PaymentTransaction;
import vn.uit.lms.shared.constant.PaymentStatus;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long>, JpaSpecificationExecutor<PaymentTransaction> {

    List<PaymentTransaction> findByStudentId(Long studentId);

    List<PaymentTransaction> findByCourseId(Long courseId);

    List<PaymentTransaction> findByStatus(PaymentStatus status);

    Optional<PaymentTransaction> findByProviderTransactionId(String providerTransactionId);

    @Query("SELECT p FROM PaymentTransaction p WHERE p.course.teacher.id = :teacherId")
    List<PaymentTransaction> findByTeacherId(@Param("teacherId") Long teacherId);

    @Query("SELECT p FROM PaymentTransaction p WHERE p.course.teacher.id = :teacherId AND p.status = :status")
    List<PaymentTransaction> findByTeacherIdAndStatus(@Param("teacherId") Long teacherId, @Param("status") PaymentStatus status);

    @Query("SELECT p FROM PaymentTransaction p WHERE p.course.teacher.id = :teacherId AND p.paidAt BETWEEN :startDate AND :endDate")
    List<PaymentTransaction> findByTeacherIdAndDateRange(
            @Param("teacherId") Long teacherId,
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate
    );

    @Query("SELECT p FROM PaymentTransaction p WHERE p.student.id = :studentId AND p.course.id = :courseId AND p.status = 'SUCCESS'")
    Optional<PaymentTransaction> findSuccessfulPaymentByStudentAndCourse(
            @Param("studentId") Long studentId,
            @Param("courseId") Long courseId
    );

    boolean existsByStudentIdAndCourseIdAndStatus(Long studentId, Long courseId, PaymentStatus status);
}
