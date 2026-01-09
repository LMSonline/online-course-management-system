package vn.uit.lms.shared.mapper.billing;

import vn.uit.lms.core.domain.billing.PaymentTransaction;
import vn.uit.lms.core.domain.billing.Payout;
import vn.uit.lms.shared.dto.response.billing.PaymentTransactionResponse;
import vn.uit.lms.shared.dto.response.billing.PayoutResponse;

public class BillingMapper {

    public static PaymentTransactionResponse toPaymentResponse(PaymentTransaction payment) {
        if (payment == null) {
            return null;
        }

        return PaymentTransactionResponse.builder()
                .id(payment.getId())
                .studentId(payment.getStudent() != null ? payment.getStudent().getId() : null)
                .studentName(payment.getStudent() != null && payment.getStudent().getAccount() != null
                        ? payment.getStudent().getAccount().getUsername() : null)
                .courseId(payment.getCourse() != null ? payment.getCourse().getId() : null)
                .courseTitle(payment.getCourse() != null ? payment.getCourse().getTitle() : null)
                .courseVersionId(payment.getCourseVersion() != null ? payment.getCourseVersion().getId() : null)
                .versionNumber(payment.getCourseVersion() != null ? payment.getCourseVersion().getVersionNumber() : null)
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .paymentMethod(payment.getPaymentMethod() != null ? payment.getPaymentMethod() : null)
                .status(payment.getStatus())
                .providerTransactionId(payment.getProviderTransactionId())
                .paidAt(payment.getPaidAt())
                .failedAt(payment.getFailedAt())
                .failureReason(payment.getFailureReason())
                .errorCode(payment.getErrorCode())
                .refundedAt(payment.getRefundedAt())
                .refundAmount(payment.getRefundAmount())
                .refundReason(payment.getRefundReason())
                .transactionFee(payment.getTransactionFee())
                .netAmount(payment.getNetAmount())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .canRefund(payment.canRefund())
                .build();
    }

    public static PayoutResponse toPayoutResponse(Payout payout) {
        if (payout == null) {
            return null;
        }

        return PayoutResponse.builder()
                .id(payout.getId())
                .teacherId(payout.getTeacher() != null ? payout.getTeacher().getId() : null)
                .teacherName(payout.getTeacher() != null && payout.getTeacher().getAccount() != null
                        ? payout.getTeacher().getAccount().getUsername() : null)
                .amount(payout.getAmount())
                .currency(payout.getCurrency())
                .status(payout.getStatus())
                .payoutPeriod(payout.getPayoutPeriod())
                .payoutDate(payout.getPayoutDate())
                .reference(payout.getReference())
                .revenueSharePercentage(payout.getRevenueSharePercentage())
                .totalRevenue(payout.getTotalRevenue())
                .totalEnrollments(payout.getTotalEnrollments())
                .bankAccountNumber(payout.getBankAccountNumber())
                .bankName(payout.getBankName())
                .accountHolderName(payout.getAccountHolderName())
                .bankTransactionId(payout.getBankTransactionId())
                .failureReason(payout.getFailureReason())
                .failedAt(payout.getFailedAt())
                .processedBy(payout.getProcessedBy())
                .notes(payout.getNotes())
                .transferFee(payout.getTransferFee())
                .taxAmount(payout.getTaxAmount())
                .netAmount(payout.getNetAmount())
                .createdAt(payout.getCreatedAt())
                .updatedAt(payout.getUpdatedAt())
                .build();
    }
}

