package vn.uit.lms.controller.billing;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.billing.PaymentService;
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
public class PaymentController {

    private final PaymentService paymentService;

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
     * Verify payment from gateway callback
     * This endpoint is called by payment gateway (VNPay, ZaloPay, etc.)
     */
    @PostMapping("/verify-payment")
    public ResponseEntity<PaymentTransactionResponse> verifyPayment(@RequestParam Map<String, String> params) {
        return ResponseEntity.ok(paymentService.verifyPayment(params));
    }

    /**
     * Get payment by ID
     */
    @GetMapping("/{id}")
    @StudentOrTeacher
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
}

