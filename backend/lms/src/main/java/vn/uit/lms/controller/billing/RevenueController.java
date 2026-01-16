package vn.uit.lms.controller.billing;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.billing.RevenueService;
import vn.uit.lms.shared.dto.response.billing.MonthlyRevenueResponse;
import vn.uit.lms.shared.dto.response.billing.PaymentTransactionResponse;
import vn.uit.lms.shared.dto.response.billing.RevenueBreakdownResponse;
import vn.uit.lms.shared.dto.response.billing.TeacherRevenueResponse;
import vn.uit.lms.shared.annotation.TeacherOnly;

import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class RevenueController {

    private final RevenueService revenueService;

    /**
     * Get teacher's overall revenue (Admin or specific teacher)
     */
    @GetMapping("/teachers/{teacherId}/revenue")
    @TeacherOnly
    public ResponseEntity<TeacherRevenueResponse> getTeacherRevenue(@PathVariable Long teacherId) {
        return ResponseEntity.ok(revenueService.getTeacherRevenue(teacherId));
    }

    /**
     * Get my revenue (current teacher)
     */
    @GetMapping("/my-revenue")
    @TeacherOnly
    public ResponseEntity<TeacherRevenueResponse> getMyRevenue() {
        return ResponseEntity.ok(revenueService.getMyRevenue());
    }

    /**
     * Get detailed revenue breakdown by courses
     */
    @GetMapping("/teachers/{teacherId}/revenue/breakdown")
    @TeacherOnly
    public ResponseEntity<RevenueBreakdownResponse> getRevenueBreakdown(@PathVariable Long teacherId) {
        return ResponseEntity.ok(revenueService.getRevenueBreakdown(teacherId));
    }

    /**
     * Get my revenue breakdown (current teacher)
     */
    @GetMapping("/my-revenue/breakdown")
    @TeacherOnly
    public ResponseEntity<RevenueBreakdownResponse> getMyRevenueBreakdown() {
        return ResponseEntity.ok(revenueService.getMyRevenueBreakdown());
    }

    /**
     * Get monthly revenue for a specific period
     */
    @GetMapping("/teachers/{teacherId}/revenue/monthly")
    @TeacherOnly
    public ResponseEntity<MonthlyRevenueResponse> getMonthlyRevenue(
            @PathVariable Long teacherId,
            @RequestParam(required = false) String period
    ) {
        YearMonth yearMonth = period != null ? YearMonth.parse(period) : YearMonth.now();
        return ResponseEntity.ok(revenueService.getMonthlyRevenue(teacherId, yearMonth));
    }

    /**
     * Get my monthly revenue (current teacher)
     */
    @GetMapping("/my-revenue/monthly")
    @TeacherOnly
    public ResponseEntity<MonthlyRevenueResponse> getMyMonthlyRevenue(@RequestParam(required = false) String period) {
        return ResponseEntity.ok(revenueService.getMyMonthlyRevenue(period));
    }

    /**
     * Get payment transactions for teacher
     */
    @GetMapping("/teachers/{teacherId}/payment-transactions")
    @TeacherOnly
    public ResponseEntity<List<PaymentTransactionResponse>> getTeacherPaymentTransactions(@PathVariable Long teacherId) {
        return ResponseEntity.ok(revenueService.getTeacherPaymentTransactions(teacherId));
    }

    /**
     * Get my payment transactions (current teacher)
     */
    @GetMapping("/my-payment-transactions")
    @TeacherOnly
    public ResponseEntity<List<PaymentTransactionResponse>> getMyPaymentTransactions() {
        return ResponseEntity.ok(revenueService.getMyPaymentTransactions());
    }
}

