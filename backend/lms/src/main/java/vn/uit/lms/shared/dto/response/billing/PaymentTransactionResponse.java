package vn.uit.lms.shared.dto.response.billing;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.uit.lms.shared.constant.PaymentStatus;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentTransactionResponse {

    private Long id;
    private Long studentId;
    private String studentName;
    private Long courseId;
    private String courseTitle;
    private Long courseVersionId;
    private Integer versionNumber;

    private BigDecimal amount;
    private String currency;
    private String paymentMethod;
    private PaymentStatus status;

    private String providerTransactionId;
    private Instant paidAt;
    private Instant failedAt;
    private String failureReason;
    private String errorCode;

    private Instant refundedAt;
    private BigDecimal refundAmount;
    private String refundReason;

    private BigDecimal transactionFee;
    private BigDecimal netAmount;

    private Instant createdAt;
    private Instant updatedAt;

    private Boolean canRefund; // Business logic result
}

