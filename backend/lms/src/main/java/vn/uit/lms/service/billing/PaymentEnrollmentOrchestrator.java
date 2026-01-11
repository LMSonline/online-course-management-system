package vn.uit.lms.service.billing;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.domain.billing.PaymentTransaction;
import vn.uit.lms.core.repository.billing.PaymentTransactionRepository;
import vn.uit.lms.service.learning.EnrollmentService;
import vn.uit.lms.shared.dto.response.enrollment.EnrollmentDetailResponse;
import vn.uit.lms.shared.exception.InvalidRequestException;

/**
 * Payment-Enrollment Orchestration Service
 * Manages the workflow between payment completion and student enrollment
 *
 * This service ensures proper coordination between payment and enrollment operations,
 * handling failures gracefully and maintaining data consistency.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentEnrollmentOrchestrator {

    private final EnrollmentService enrollmentService;
    private final PaymentTransactionRepository paymentRepository;

    /**
     * Process enrollment after successful payment
     *
     * This method is called in a separate transaction to ensure payment is committed
     * even if enrollment fails. This prevents loss of payment records.
     *
     * Preconditions:
     * - Payment must exist and be in SUCCESS status
     * - Student must not be already enrolled
     *
     * Postconditions:
     * - Student enrolled in course (on success)
     * - Payment metadata updated with enrollment status
     * - Appropriate errors logged for manual intervention if needed
     *
     * @param payment The successful payment transaction
     * @return EnrollmentDetailResponse if enrollment successful, null otherwise
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public EnrollmentDetailResponse processEnrollmentAfterPayment(PaymentTransaction payment) {
        log.info("Processing enrollment for payment {}", payment.getId());

        Long studentId = payment.getStudent().getId();
        Long courseVersionId = payment.getCourseVersion().getId();
        Long courseId = payment.getCourse().getId();

        try {
            // Attempt to enroll student
            EnrollmentDetailResponse enrollment = enrollmentService.enrollStudent(studentId, courseVersionId);

            // Update payment metadata with enrollment info
            payment.addMetadata("enrollment_id", enrollment.getId());
            payment.addMetadata("enrollment_status", "SUCCESS");
            payment.addMetadata("enrolled_at", java.time.Instant.now().toString());
            paymentRepository.save(payment);

            log.info("Successfully enrolled student {} in course {} for payment {}",
                    studentId, courseId, payment.getId());

            return enrollment;

        } catch (InvalidRequestException e) {
            // Business rule violation (e.g., already enrolled, course closed)
            log.warn("Business rule violation during enrollment for payment {}: {}",
                    payment.getId(), e.getMessage());

            // Update payment metadata
            payment.addMetadata("enrollment_status", "FAILED");
            payment.addMetadata("enrollment_error", e.getMessage());
            payment.addMetadata("enrollment_error_type", "BUSINESS_RULE_VIOLATION");
            payment.addMetadata("failed_at", java.time.Instant.now().toString());
            paymentRepository.save(payment);

            // This is logged but not critical - payment is already successful
            return null;

        } catch (Exception e) {
            // System error - this is critical
            log.error("CRITICAL: System error during enrollment for payment {}", payment.getId(), e);

            // Update payment metadata for manual intervention
            payment.addMetadata("enrollment_status", "FAILED");
            payment.addMetadata("enrollment_error", e.getMessage());
            payment.addMetadata("enrollment_error_type", "SYSTEM_ERROR");
            payment.addMetadata("requires_manual_enrollment", "true");
            payment.addMetadata("failed_at", java.time.Instant.now().toString());
            paymentRepository.save(payment);

            // TODO: Send alert to admin
            // TODO: Add to retry queue

            return null;
        }
    }

    /**
     * Retry enrollment for a payment that failed enrollment
     * Used by admin to manually retry failed enrollments
     *
     * @param paymentId The payment ID to retry enrollment for
     * @return EnrollmentDetailResponse if successful
     */
    @Transactional
    public EnrollmentDetailResponse retryEnrollment(Long paymentId) {
        log.info("Manually retrying enrollment for payment {}", paymentId);

        PaymentTransaction payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new InvalidRequestException("Payment not found"));

        if (payment.getStatus() != vn.uit.lms.shared.constant.PaymentStatus.SUCCESS) {
            throw new InvalidRequestException("Can only retry enrollment for successful payments");
        }

        // Check if already enrolled successfully
        Object enrollmentStatus = payment.getMetadata().get("enrollment_status");
        if ("SUCCESS".equals(enrollmentStatus)) {
            throw new InvalidRequestException("Student is already enrolled for this payment");
        }

        return processEnrollmentAfterPayment(payment);
    }

    /**
     * Check if enrollment is pending for a payment
     *
     * @param paymentId The payment ID to check
     * @return true if enrollment failed and needs retry
     */
    public boolean isEnrollmentPending(Long paymentId) {
        return paymentRepository.findById(paymentId)
                .map(payment -> {
                    if (payment.getStatus() != vn.uit.lms.shared.constant.PaymentStatus.SUCCESS) {
                        return false;
                    }

                    Object enrollmentStatus = payment.getMetadata().get("enrollment_status");
                    return "FAILED".equals(enrollmentStatus) || enrollmentStatus == null;
                })
                .orElse(false);
    }
}

