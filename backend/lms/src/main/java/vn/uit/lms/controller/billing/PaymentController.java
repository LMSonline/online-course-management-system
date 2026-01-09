package vn.uit.lms.controller.billing;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.billing.PaymentEnrollmentOrchestrator;
import vn.uit.lms.service.billing.PaymentService;
import vn.uit.lms.service.billing.ZaloPayService;
import vn.uit.lms.shared.constant.PaymentProvider;
import vn.uit.lms.shared.constant.PaymentStatus;
import vn.uit.lms.shared.dto.request.billing.CreatePaymentRequest;
import vn.uit.lms.shared.dto.request.billing.RefundRequest;
import vn.uit.lms.shared.dto.response.billing.CoursePaymentStatsResponse;
import vn.uit.lms.shared.dto.response.billing.PaymentTransactionResponse;
import vn.uit.lms.shared.dto.response.billing.PaymentUrlResponse;
import vn.uit.lms.shared.util.annotation.AdminOnly;
import vn.uit.lms.shared.util.annotation.StudentOnly;
import vn.uit.lms.shared.util.annotation.StudentOrTeacher;
import vn.uit.lms.shared.util.annotation.TeacherOnly;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;
    private final ZaloPayService zaloPayService;
    private final PaymentEnrollmentOrchestrator enrollmentOrchestrator;

    /**
     * Create payment transaction
     * Student initiates payment for a course
     */
    @PostMapping("/create-payment")
    @StudentOnly
    public ResponseEntity<PaymentUrlResponse> createPayment(
            @RequestBody @Valid CreatePaymentRequest request,
            HttpServletRequest httpRequest
    ) {
        return ResponseEntity.ok(paymentService.createPayment(request, httpRequest));
    }

    /**
     * Unified Payment Callback Endpoint (RECOMMENDED)
     * Auto-detects payment gateway and processes callback
     * Supports: VNPay, ZaloPay, MoMo, and future gateways
     *
     * This endpoint can be used as a single callback URL for all payment gateways
     * Each gateway will send different parameters, and the system automatically detects which one
     */
    @PostMapping("/callback")
    public ResponseEntity<?> unifiedPaymentCallback(@RequestBody Map<String, String> params) {
        try {
            log.info("Received payment callback, auto-detecting provider...");

            PaymentTransactionResponse response = paymentService.verifyPaymentAutoDetect(params);

            // Return appropriate response format based on detected provider
            // For VNPay: return transaction response directly
            // For ZaloPay/MoMo: return standardized response
            if (params.containsKey("data") && params.containsKey("mac")) {
                // ZaloPay format response
                Map<String, Object> result = new java.util.HashMap<>();
                result.put("return_code", 1);
                result.put("return_message", "success");
                return ResponseEntity.ok(result);
            } else if (params.containsKey("signature") && params.containsKey("resultCode")) {
                // MoMo format response
                Map<String, Object> result = new java.util.HashMap<>();
                result.put("status", 200);
                result.put("message", "success");
                return ResponseEntity.ok(result);
            } else {
                // VNPay or generic response
                return ResponseEntity.ok(response);
            }

        } catch (Exception e) {
            log.error("Error processing payment callback", e);

            // Return error in appropriate format
            if (params.containsKey("data") && params.containsKey("mac")) {
                // ZaloPay error format
                Map<String, Object> result = new java.util.HashMap<>();
                result.put("return_code", 0);
                result.put("return_message", e.getMessage());
                return ResponseEntity.ok(result);
            } else if (params.containsKey("signature") && params.containsKey("resultCode")) {
                // MoMo error format
                Map<String, Object> result = new java.util.HashMap<>();
                result.put("status", 500);
                result.put("message", e.getMessage());
                return ResponseEntity.ok(result);
            } else {
                // Generic error
                return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
            }
        }
    }

    /**
     * Get payment by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<PaymentTransactionResponse> getPaymentById(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getPaymentById(id));
    }

    /**
     * Get all payments with filters (Admin only)
     */
    @GetMapping
    @AdminOnly
    public ResponseEntity<Page<PaymentTransactionResponse>> getAllPayments(
            @RequestParam(required = false) PaymentStatus status,
            @RequestParam(required = false) Long studentId,
            @RequestParam(required = false) Long courseId,
            Pageable pageable
    ) {
        return ResponseEntity.ok(paymentService.getPayments(status, studentId, courseId, pageable));
    }

    /**
     * Get my payment history (current student)
     */
    @GetMapping("/my-history")
    @StudentOnly
    public ResponseEntity<List<PaymentTransactionResponse>> getMyPaymentHistory() {
        return ResponseEntity.ok(paymentService.getMyPaymentHistory());
    }

    /**
     * Refund payment (Admin only)
     */
    @PostMapping("/{id}/refund")
    @AdminOnly
    public ResponseEntity<PaymentTransactionResponse> refundPayment(
            @PathVariable Long id,
            @RequestBody @Valid RefundRequest request
    ) {
        return ResponseEntity.ok(paymentService.refundPayment(id, request));
    }

    /**
     * Get student's payment history
     */
    @GetMapping("/students/{studentId}/payment-history")
    @AdminOnly
    public ResponseEntity<List<PaymentTransactionResponse>> getStudentPaymentHistory(@PathVariable Long studentId) {
        return ResponseEntity.ok(paymentService.getStudentPaymentHistory(studentId));
    }

    /**
     * Get course payment statistics (Teacher or Admin)
     */
    @GetMapping("/courses/{courseId}/payment-stats")
    @TeacherOnly
    public ResponseEntity<CoursePaymentStatsResponse> getCoursePaymentStats(@PathVariable Long courseId) {
        return ResponseEntity.ok(paymentService.getCoursePaymentStats(courseId));
    }

    /**
     * Query ZaloPay order status
     * Check the status of a ZaloPay payment
     */
    @GetMapping("/zalopay/query-order/{appTransId}")
    @StudentOrTeacher
    public ResponseEntity<?> queryZaloPayOrderStatus(@PathVariable String appTransId) {
        return ResponseEntity.ok(zaloPayService.queryOrderStatus(appTransId));
    }

    /**
     * Query ZaloPay refund status
     * Check the status of a ZaloPay refund
     */
    @GetMapping("/zalopay/query-refund/{mRefundId}")
    @AdminOnly
    public ResponseEntity<?> queryZaloPayRefundStatus(@PathVariable String mRefundId) {
        return ResponseEntity.ok(zaloPayService.queryRefundStatus(mRefundId));
    }

    /**
     * Retry enrollment for a payment
     * Used when enrollment failed after successful payment
     * Admin can manually trigger enrollment retry
     */
    @PostMapping("/{paymentId}/retry-enrollment")
    @AdminOnly
    public ResponseEntity<?> retryEnrollment(@PathVariable Long paymentId) {
        try {
            var enrollment = enrollmentOrchestrator.retryEnrollment(paymentId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Enrollment retried successfully",
                "enrollment", enrollment
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    /**
     * Check if enrollment is pending for a payment
     */
    @GetMapping("/{paymentId}/enrollment-status")
    @AdminOnly
    public ResponseEntity<?> checkEnrollmentStatus(@PathVariable Long paymentId) {
        boolean isPending = enrollmentOrchestrator.isEnrollmentPending(paymentId);
        return ResponseEntity.ok(Map.of(
            "paymentId", paymentId,
            "enrollmentPending", isPending,
            "message", isPending ? "Enrollment failed and needs retry" : "Enrollment completed or payment not successful"
        ));
    }
}

