package vn.uit.lms.shared.dto.response.billing;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.uit.lms.shared.constant.PayoutStatus;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayoutResponse {

    private Long id;
    private Long teacherId;
    private String teacherName;

    private BigDecimal amount;
    private String currency;
    private PayoutStatus status;

    private String payoutPeriod; // YYYY-MM
    private Instant payoutDate;
    private String reference;

    private Float revenueSharePercentage;
    private BigDecimal totalRevenue;
    private Integer totalEnrollments;

    private String bankAccountNumber;
    private String bankName;
    private String accountHolderName;
    private String bankTransactionId;

    private String failureReason;
    private Instant failedAt;

    private String processedBy;
    private String notes;

    private BigDecimal transferFee;
    private BigDecimal taxAmount;
    private BigDecimal netAmount;

    private Instant createdAt;
    private Instant updatedAt;
}

