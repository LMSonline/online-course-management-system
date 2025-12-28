package vn.uit.lms.service.billing;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.domain.Account;
import vn.uit.lms.core.domain.Student;
import vn.uit.lms.core.domain.billing.PaymentTransaction;
import vn.uit.lms.core.domain.billing.RevenueShareConfig;
import vn.uit.lms.core.domain.course.Course;
import vn.uit.lms.core.domain.course.CourseVersion;
import vn.uit.lms.core.domain.learning.Enrollment;
import vn.uit.lms.core.repository.StudentRepository;
import vn.uit.lms.core.repository.billing.PaymentTransactionRepository;
import vn.uit.lms.core.repository.billing.RevenueShareConfigRepository;
import vn.uit.lms.core.repository.course.CourseRepository;
import vn.uit.lms.core.repository.course.CourseVersionRepository;
import vn.uit.lms.core.repository.learning.EnrollmentRepository;
import vn.uit.lms.service.AccountService;
import vn.uit.lms.service.billing.gateway.PaymentGateway;
import vn.uit.lms.service.learning.EnrollmentService;
import vn.uit.lms.shared.constant.PaymentStatus;
import vn.uit.lms.shared.dto.request.billing.CreatePaymentRequest;
import vn.uit.lms.shared.dto.request.billing.RefundRequest;
import vn.uit.lms.shared.dto.response.billing.CoursePaymentStatsResponse;
import vn.uit.lms.shared.dto.response.billing.PaymentTransactionResponse;
import vn.uit.lms.shared.dto.response.billing.PaymentUrlResponse;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.billing.BillingMapper;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentTransactionRepository paymentRepository;
    private final CourseRepository courseRepository;
    private final CourseVersionRepository courseVersionRepository;
    private final StudentRepository studentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final RevenueShareConfigRepository revenueShareConfigRepository;
    private final AccountService accountService;
    private final EnrollmentService enrollmentService;
    private final PaymentGateway paymentGateway; // Will use VNPayGateway by default

    /**
     * Create payment transaction
     *
     * Preconditions:
     * - Student must be authenticated
     * - Course and version must exist
     * - Course must be published
     * - Student must not have already paid for this course
     * - Course must have a price > 0
     *
     * Postconditions:
     * - Payment transaction created with PENDING status
     * - Payment URL returned for user to complete payment
     */
    @Transactional
    public PaymentUrlResponse createPayment(CreatePaymentRequest request, HttpServletRequest httpRequest) {
        // Precondition: Verify student
        Account account = accountService.verifyCurrentAccount();
        Student student = studentRepository.findByAccount(account)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        // Precondition: Verify course and version exist
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        CourseVersion courseVersion = courseVersionRepository.findById(request.getCourseVersionId())
                .orElseThrow(() -> new ResourceNotFoundException("Course version not found"));

        // Precondition: Check course is published
        if (courseVersion.getStatus() != vn.uit.lms.shared.constant.CourseStatus.PUBLISHED) {
            throw new InvalidRequestException("Course is not published yet");
        }

        // Precondition: Check course price
        if (courseVersion.getPrice() == null || courseVersion.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidRequestException("This course is free, no payment required");
        }

        // Precondition: Check if student already paid for this course
        boolean alreadyPaid = paymentRepository.existsByStudentIdAndCourseIdAndStatus(
                student.getId(),
                course.getId(),
                PaymentStatus.SUCCESS
        );
        if (alreadyPaid) {
            throw new InvalidRequestException("You have already purchased this course");
        }

        // Precondition: Check if student already enrolled (free or by other means)
        boolean alreadyEnrolled = enrollmentRepository.existsByStudentIdAndCourseVersionId(
                student.getId(),
                courseVersion.getId()
        );
        if (alreadyEnrolled) {
            throw new InvalidRequestException("You are already enrolled in this course");
        }

        // Create payment transaction
        PaymentTransaction payment = PaymentTransaction.builder()
                .student(student)
                .course(course)
                .courseVersion(courseVersion)
                .amount(courseVersion.getPrice())
                .currency("VND")
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "VNPAY")
                .status(PaymentStatus.PENDING)
                .userAgent(request.getUserAgent())
                .build();

        payment = paymentRepository.save(payment);
        log.info("Created payment transaction ID: {} for student: {} course: {}",
                payment.getId(), student.getId(), course.getId());

        // Create payment URL
        String orderId = "PAY_" + payment.getId();
        String orderInfo = "Thanh toan khoa hoc: " + course.getTitle();
        String returnUrl = request.getReturnUrl() != null ?
                request.getReturnUrl() :
                "http://localhost:3000/payment/result";
        String ipAddress = getClientIpAddress(httpRequest);

        String paymentUrl = paymentGateway.createPaymentUrl(
                orderId,
                courseVersion.getPrice(),
                orderInfo,
                returnUrl,
                ipAddress
        );

        // Postcondition: Payment created with PENDING status
        assert payment.getStatus() == PaymentStatus.PENDING;

        return PaymentUrlResponse.builder()
                .paymentId(payment.getId())
                .paymentUrl(paymentUrl)
                .message("Please complete payment within 15 minutes")
                .build();
    }

    /**
     * Verify payment from gateway callback
     *
     * Preconditions:
     * - Payment must exist and be in PENDING status
     * - Payment data from gateway must be valid
     *
     * Postconditions:
     * - Payment status updated (SUCCESS or FAILED)
     * - If successful: Student enrolled in course
     * - If failed: Failure reason recorded
     */
    @Transactional
    public PaymentTransactionResponse verifyPayment(Map<String, String> paymentData) {
        // Verify signature from payment gateway
        if (!paymentGateway.verifyPayment(paymentData)) {
            log.warn("Invalid payment signature: {}", paymentData);
            throw new InvalidRequestException("Invalid payment signature");
        }

        // Get payment ID from order ID
        String orderId = paymentData.get("vnp_TxnRef");
        if (orderId == null || !orderId.startsWith("PAY_")) {
            throw new InvalidRequestException("Invalid order ID");
        }

        Long paymentId = Long.parseLong(orderId.substring(4));

        // Precondition: Payment must exist
        PaymentTransaction payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        // Precondition: Payment must be PENDING
        if (payment.getStatus() != PaymentStatus.PENDING) {
            log.warn("Payment {} is not in PENDING status: {}", paymentId, payment.getStatus());
            return BillingMapper.toPaymentResponse(payment);
        }

        String providerTransactionId = paymentGateway.getTransactionId(paymentData);

        if (paymentGateway.isPaymentSuccess(paymentData)) {
            // Mark payment as successful using rich domain logic
            payment.markAsSuccess(providerTransactionId);

            // Calculate transaction fee (example: 2% of amount)
            BigDecimal transactionFee = payment.getAmount().multiply(new BigDecimal("0.02"));
            payment.setTransactionFee(transactionFee);

            payment = paymentRepository.save(payment);
            log.info("Payment {} marked as SUCCESS", paymentId);

            // Postcondition: Enroll student in course
            try {
                enrollmentService.enrollStudent(
                        payment.getStudent().getId(),
                        payment.getCourseVersion().getId()
                );
                log.info("Student {} enrolled in course {} after successful payment",
                        payment.getStudent().getId(),
                        payment.getCourse().getId());
            } catch (Exception e) {
                log.error("Failed to enroll student after payment", e);
                // Payment was successful but enrollment failed
                // This should be handled by admin or retry mechanism
            }

            // Postcondition: Payment is SUCCESS and student is enrolled
            assert payment.getStatus() == PaymentStatus.SUCCESS;

        } else {
            // Mark payment as failed using rich domain logic
            String errorMessage = paymentGateway.getErrorMessage(paymentData);
            String errorCode = paymentData.get("vnp_ResponseCode");
            payment.markAsFailed(errorMessage, errorCode);

            payment = paymentRepository.save(payment);
            log.warn("Payment {} marked as FAILED: {}", paymentId, errorMessage);

            // Postcondition: Payment is FAILED
            assert payment.getStatus() == PaymentStatus.FAILED;
        }

        return BillingMapper.toPaymentResponse(payment);
    }

    /**
     * Get payment transaction by ID
     */
    public PaymentTransactionResponse getPaymentById(Long id) {
        PaymentTransaction payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        return BillingMapper.toPaymentResponse(payment);
    }

    /**
     * Get all payments with optional filters
     */
    public Page<PaymentTransactionResponse> getPayments(
            PaymentStatus status,
            Long studentId,
            Long courseId,
            Pageable pageable
    ) {
        Specification<PaymentTransaction> spec = Specification.where(null);

        if (status != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }
        if (studentId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("student").get("id"), studentId));
        }
        if (courseId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("course").get("id"), courseId));
        }

        return paymentRepository.findAll(spec, pageable)
                .map(BillingMapper::toPaymentResponse);
    }

    /**
     * Get student's payment history
     */
    public List<PaymentTransactionResponse> getStudentPaymentHistory(Long studentId) {
        List<PaymentTransaction> payments = paymentRepository.findByStudentId(studentId);
        return payments.stream()
                .map(BillingMapper::toPaymentResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get my payment history (current student)
     */
    public List<PaymentTransactionResponse> getMyPaymentHistory() {
        Account account = accountService.verifyCurrentAccount();
        Student student = studentRepository.findByAccount(account)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        return getStudentPaymentHistory(student.getId());
    }

    /**
     * Refund payment
     *
     * Preconditions:
     * - Payment must exist and be SUCCESS
     * - Payment must be refundable (within 7 days and < 20% progress)
     *
     * Postconditions:
     * - Payment status changed to REFUNDED
     * - Student enrollment cancelled
     */
    @Transactional
    public PaymentTransactionResponse refundPayment(Long paymentId, RefundRequest request) {
        // Precondition: Payment must exist
        PaymentTransaction payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        // Precondition: Check if refundable using rich domain logic
        if (!payment.canRefund()) {
            throw new InvalidRequestException(
                    "Payment cannot be refunded. Refund is only available within 7 days of purchase."
            );
        }

        // Additional check: Student must not have completed > 20% of course
        Enrollment enrollment = enrollmentRepository
                .findByStudentIdAndCourseVersionId(
                        payment.getStudent().getId(),
                        payment.getCourseVersion().getId()
                )
                .orElse(null);

        if (enrollment != null && enrollment.getCompletionPercentage() != null
                && enrollment.getCompletionPercentage() > 20.0f) {
            throw new InvalidRequestException(
                    "Refund is not available as you have completed more than 20% of the course"
            );
        }

        // Process refund using rich domain logic
        if (request.getRefundAmount() != null) {
            payment.refund(request.getRefundAmount(), request.getReason());
        } else {
            payment.refundFull(request.getReason());
        }

        payment = paymentRepository.save(payment);
        log.info("Payment {} refunded: {}", paymentId, request.getReason());

        // Postcondition: Cancel enrollment
        if (enrollment != null) {
            enrollment.cancel(request.getReason());
            enrollmentRepository.save(enrollment);
            log.info("Enrollment {} cancelled due to refund", enrollment.getId());
        }

        // Note: Actual refund to payment gateway should be done here
        // For now, it's manual or requires API integration

        // Postcondition: Payment is REFUNDED
        assert payment.getStatus() == PaymentStatus.REFUNDED;

        return BillingMapper.toPaymentResponse(payment);
    }

    /**
     * Get course payment statistics (for teachers and admin)
     *
     * Returns statistics about payments for a specific course
     */
    public CoursePaymentStatsResponse getCoursePaymentStats(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        List<PaymentTransaction> payments = paymentRepository.findByCourseId(courseId);

        long totalTransactions = payments.size();
        long successfulTransactions = payments.stream()
                .filter(PaymentTransaction::isSuccess)
                .count();
        long failedTransactions = payments.stream()
                .filter(p -> p.getStatus() == PaymentStatus.FAILED)
                .count();
        long refundedTransactions = payments.stream()
                .filter(PaymentTransaction::isRefunded)
                .count();

        BigDecimal totalRevenue = payments.stream()
                .filter(PaymentTransaction::isSuccess)
                .map(PaymentTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalRefunded = payments.stream()
                .filter(PaymentTransaction::isRefunded)
                .map(p -> p.getRefundAmount() != null ? p.getRefundAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal netRevenue = totalRevenue.subtract(totalRefunded);

        // Get revenue share config
        RevenueShareConfig revenueConfig = getRevenueShareConfig(course.getCategory() != null ?
                course.getCategory().getId() : null);
        Float revenueSharePercentage = revenueConfig.getPercentage().floatValue();

        BigDecimal teacherRevenue = payments.stream()
                .filter(PaymentTransaction::isSuccess)
                .map(p -> p.getTeacherRevenue(revenueSharePercentage))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal platformRevenue = netRevenue.subtract(teacherRevenue);

        return CoursePaymentStatsResponse.builder()
                .courseId(course.getId())
                .courseTitle(course.getTitle())
                .teacherId(course.getTeacher().getId())
                .teacherName(course.getTeacher().getAccount().getUsername())
                .totalTransactions(totalTransactions)
                .successfulTransactions(successfulTransactions)
                .failedTransactions(failedTransactions)
                .refundedTransactions(refundedTransactions)
                .totalRevenue(totalRevenue)
                .totalRefunded(totalRefunded)
                .netRevenue(netRevenue)
                .teacherRevenue(teacherRevenue)
                .platformRevenue(platformRevenue)
                .revenueSharePercentage(revenueSharePercentage)
                .build();
    }

    /**
     * Get revenue share config for a category or default
     */
    private RevenueShareConfig getRevenueShareConfig(Long categoryId) {
        if (categoryId != null) {
            return revenueShareConfigRepository
                    .findByCategoryAndDate(categoryId, LocalDate.now())
                    .orElseGet(() -> getDefaultRevenueConfig());
        }
        return getDefaultRevenueConfig();
    }

    /**
     * Get default revenue share config
     */
    private RevenueShareConfig getDefaultRevenueConfig() {
        return revenueShareConfigRepository.findActiveOnDate(LocalDate.now())
                .stream()
                .filter(config -> config.getCategoryId() == null)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No active revenue share config found"));
    }

    /**
     * Get client IP address from HTTP request
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String ipAddress = request.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("Proxy-Client-IP");
        }
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getRemoteAddr();
        }
        return ipAddress != null ? ipAddress : "0.0.0.0";
    }
}


