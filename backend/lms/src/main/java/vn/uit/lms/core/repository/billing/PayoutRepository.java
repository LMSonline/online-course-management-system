package vn.uit.lms.core.repository.billing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vn.uit.lms.core.domain.billing.Payout;
import vn.uit.lms.shared.constant.PayoutStatus;

import java.util.List;
import java.util.Optional;

public interface PayoutRepository extends JpaRepository<Payout, Long>, JpaSpecificationExecutor<Payout> {

    List<Payout> findByTeacherId(Long teacherId);

    List<Payout> findByTeacherIdAndStatus(Long teacherId, PayoutStatus status);

    List<Payout> findByStatus(PayoutStatus status);

    Optional<Payout> findByTeacherIdAndPayoutPeriod(Long teacherId, String payoutPeriod);

    @Query("SELECT p FROM Payout p WHERE p.teacher.id = :teacherId ORDER BY p.createdAt DESC")
    List<Payout> findByTeacherIdOrderByCreatedAtDesc(@Param("teacherId") Long teacherId);

    boolean existsByTeacherIdAndPayoutPeriodAndStatus(Long teacherId, String payoutPeriod, PayoutStatus status);
}
