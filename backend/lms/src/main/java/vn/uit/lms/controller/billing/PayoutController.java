package vn.uit.lms.controller.billing;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.billing.PayoutService;
import vn.uit.lms.shared.constant.PayoutStatus;
import vn.uit.lms.shared.dto.request.billing.CompletePayoutRequest;
import vn.uit.lms.shared.dto.request.billing.CreatePayoutRequest;
import vn.uit.lms.shared.dto.request.billing.RejectPayoutRequest;
import vn.uit.lms.shared.dto.response.billing.PayoutResponse;
import vn.uit.lms.shared.annotation.AdminOnly;
import vn.uit.lms.shared.annotation.TeacherOnly;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class PayoutController {

    private final PayoutService payoutService;

    /**
     * Create payout request (Teacher)
     */
    @PostMapping("/payouts")
    @TeacherOnly
    public ResponseEntity<PayoutResponse> createPayoutRequest(@RequestBody @Valid CreatePayoutRequest request) {
        return ResponseEntity.ok(payoutService.createPayoutRequest(request));
    }

    /**
     * Get payout by ID
     */
    @GetMapping("/payouts/{id}")
    @TeacherOnly
    public ResponseEntity<PayoutResponse> getPayoutById(@PathVariable Long id) {
        return ResponseEntity.ok(payoutService.getPayoutById(id));
    }

    /**
     * Get payouts for current user (Teacher sees own, Admin sees all)
     * GET /payouts
     */
    @GetMapping("/payouts")
    @TeacherOnly
    public ResponseEntity<List<PayoutResponse>> getPayouts() {
        return ResponseEntity.ok(payoutService.getMyPayouts());
    }

    /**
     * Get all payouts with filters (Admin)
     */
    @GetMapping("/admin/payouts")
    @AdminOnly
    public ResponseEntity<Page<PayoutResponse>> getAllPayouts(
            @RequestParam(required = false) PayoutStatus status,
            @RequestParam(required = false) Long teacherId,
            @RequestParam(required = false) String period,
            Pageable pageable
    ) {
        return ResponseEntity.ok(payoutService.getAllPayouts(status, teacherId, period, pageable));
    }

    /**
     * Get my payouts (current teacher)
     */
    @GetMapping("/my-payouts")
    @TeacherOnly
    public ResponseEntity<List<PayoutResponse>> getMyPayouts() {
        return ResponseEntity.ok(payoutService.getMyPayouts());
    }

    /**
     * Get teacher's payouts
     */
    @GetMapping("/teachers/{teacherId}/payouts")
    @AdminOnly
    public ResponseEntity<List<PayoutResponse>> getTeacherPayouts(@PathVariable Long teacherId) {
        return ResponseEntity.ok(payoutService.getTeacherPayouts(teacherId));
    }

    /**
     * Complete payout (Admin)
     */
    @PostMapping("/admin/payouts/{id}/complete")
    @AdminOnly
    public ResponseEntity<PayoutResponse> completePayout(
            @PathVariable Long id,
            @RequestBody @Valid CompletePayoutRequest request
    ) {
        return ResponseEntity.ok(payoutService.completePayout(id, request));
    }

    /**
     * Reject payout (Admin)
     */
    @PostMapping("/admin/payouts/{id}/reject")
    @AdminOnly
    public ResponseEntity<PayoutResponse> rejectPayout(
            @PathVariable Long id,
            @RequestBody @Valid RejectPayoutRequest request
    ) {
        return ResponseEntity.ok(payoutService.rejectPayout(id, request));
    }

    /**
     * Get pending payouts count (Admin dashboard)
     */
    @GetMapping("/admin/payouts/pending-count")
    @AdminOnly
    public ResponseEntity<Long> getPendingPayoutsCount() {
        return ResponseEntity.ok(payoutService.getPendingPayoutsCount());
    }

    /**
     * Get my available payout amount (current teacher)
     */
    @GetMapping("/my-available-payout")
    @TeacherOnly
    public ResponseEntity<BigDecimal> getMyAvailablePayoutAmount() {
        return ResponseEntity.ok(payoutService.getMyAvailablePayoutAmount());
    }
}

