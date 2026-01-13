package vn.uit.lms.core.domain.billing;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import vn.uit.lms.core.domain.Teacher;
import vn.uit.lms.shared.constant.PayoutStatus;
import vn.uit.lms.shared.entity.BaseEntity;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.YearMonth;
import java.util.Map;

@Entity
@Table(name = "payouts", indexes = {
        @Index(name = "idx_payout_teacher", columnList = "teacher_id"),
        @Index(name = "idx_payout_status", columnList = "status"),
        @Index(name = "idx_payout_period", columnList = "payout_period"),
        @Index(name = "idx_payout_date", columnList = "payout_date")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payout extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;

    @Column(name = "amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(name = "currency", nullable = false, length = 10)
    @Builder.Default
    private String currency = "VND";

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private PayoutStatus status = PayoutStatus.PENDING;

    @Column(name = "payout_period", length = 7)
    private String payoutPeriod;

    @Column(name = "payout_date")
    private Instant payoutDate;

    @Column(name = "reference", length = 255)
    private String reference;

    @Column(name = "revenue_share_percentage")
    private Float revenueSharePercentage;

    @Column(name = "total_revenue", precision = 12, scale = 2)
    private BigDecimal totalRevenue;

    @Column(name = "total_enrollments")
    private Integer totalEnrollments;

    @Column(name = "bank_account_number", length = 50)
    private String bankAccountNumber;

    @Column(name = "bank_name", length = 255)
    private String bankName;

    @Column(name ="account_holder_name", length = 255)
    private String accountHolderName;

    @Column(name = "bank_transaction_id", length = 255)
    private String bankTransactionId;

    @Column(name = "failure_reason", columnDefinition = "TEXT")
    private String failureReason;

    @Column(name = "failed_at")
    private Instant failedAt;

    @Column(name = "processed_by")
    private String processedBy;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "metadata", columnDefinition = "JSON")
    private Map<String, Object> metadata;

    /**
     * Phí chuyển khoản (nếu có)
     */
    @Column(name = "transfer_fee", precision = 12, scale = 2)
    private BigDecimal transferFee;

    /**
     * Số tiền thực nhận (sau khi trừ fee)
     */
    @Column(name = "net_amount", precision = 12, scale = 2)
    private BigDecimal netAmount;

    /**
     * Thuế thu nhập (nếu áp dụng)
     */
    @Column(name = "tax_amount", precision = 12, scale = 2)
    private BigDecimal taxAmount;


    /**
     * Tạo payout period từ YearMonth
     */
    public static String createPayoutPeriod(YearMonth yearMonth) {
        return yearMonth.toString(); // Format: YYYY-MM
    }

    /**
     * Set payout period từ current month
     */
    public void setCurrentPeriod() {
        this.payoutPeriod = createPayoutPeriod(YearMonth.now());
    }

    /**
     * Đánh dấu payout hoàn thành
     */
    public void markAsCompleted(String bankTransactionId, String processedBy) {
        if (this.status != PayoutStatus.PENDING) {
            throw new IllegalStateException("Can only complete PENDING payouts");
        }

        if (this.amount == null || this.amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalStateException("Cannot complete payout with zero or negative amount");
        }

        this.status = PayoutStatus.COMPLETED;
        this.bankTransactionId = bankTransactionId;
        this.payoutDate = Instant.now();
        this.processedBy = processedBy;

        // Calculate net amount
        calculateNetAmount();
    }

    /**
     * Đánh dấu payout thất bại
     */
    public void markAsFailed(String reason, String processedBy) {
        if (this.status != PayoutStatus.PENDING) {
            throw new IllegalStateException("Can only mark PENDING payouts as FAILED");
        }

        this.status = PayoutStatus.FAILED;
        this.failureReason = reason;
        this.failedAt = Instant.now();
        this.processedBy = processedBy;
    }

    /**
     * Retry payout sau khi failed
     */
    public void retry() {
        if (this.status != PayoutStatus.FAILED) {
            throw new IllegalStateException("Can only retry FAILED payouts");
        }

        this.status = PayoutStatus.PENDING;
        this.failureReason = null;
        this.failedAt = null;
    }

    /**
     * Tính net amount (sau khi trừ các khoản phí)
     */
    private void calculateNetAmount() {
        BigDecimal net = this.amount;

        if (this.transferFee != null) {
            net = net.subtract(this.transferFee);
        }

        if (this.taxAmount != null) {
            net = net.subtract(this.taxAmount);
        }

        this.netAmount = net;
    }

    /**
     * Set transfer fee và tính lại net amount
     */
    public void setTransferFee(BigDecimal fee) {
        this.transferFee = fee;
        calculateNetAmount();
    }

    /**
     * Set tax amount và tính lại net amount
     */
    public void setTaxAmount(BigDecimal tax) {
        this.taxAmount = tax;
        calculateNetAmount();
    }

    /**
     * Tính toán amount dựa trên total revenue và revenue share
     */
    public void calculateAmount() {
        if (this.totalRevenue == null || this.revenueSharePercentage == null) {
            throw new IllegalStateException("Cannot calculate amount without revenue and percentage");
        }

        this.amount = this.totalRevenue.multiply(
                BigDecimal.valueOf(this.revenueSharePercentage / 100.0)
        );

        calculateNetAmount();
    }

    /**
     * Thêm metadata
     */
    public void addMetadata(String key, Object value) {
        if (this.metadata == null) {
            this.metadata = new java.util.HashMap<>();
        }
        this.metadata.put(key, value);
    }

    /**
     * Set bank account info
     */
    public void setBankAccount(String accountNumber, String bankName, String holderName) {
        this.bankAccountNumber = accountNumber;
        this.bankName = bankName;
        this.accountHolderName = holderName;
    }

    /**
     * Kiểm tra có phải payout hoàn thành không
     */
    public boolean isCompleted() {
        return this.status == PayoutStatus.COMPLETED;
    }

    /**
     * Kiểm tra có đang pending không
     */
    public boolean isPending() {
        return this.status == PayoutStatus.PENDING;
    }

    /**
     * Kiểm tra có thất bại không
     */
    public boolean isFailed() {
        return this.status == PayoutStatus.FAILED;
    }

    /**
     * Lấy YearMonth từ payout period
     */
    public YearMonth getPayoutYearMonth() {
        if (this.payoutPeriod == null) {
            return null;
        }
        return YearMonth.parse(this.payoutPeriod);
    }

    /**
     * Complete payout (public method for service layer)
     */
    public void complete(String bankTransactionId, String processedBy) {
        markAsCompleted(bankTransactionId, processedBy);
    }

    /**
     * Reject payout (public method for service layer)
     */
    public void reject(String reason) {
        if (this.status != PayoutStatus.PENDING) {
            throw new IllegalStateException("Can only reject PENDING payouts");
        }

        this.status = PayoutStatus.FAILED;
        this.failureReason = reason;
        this.failedAt = Instant.now();
    }

    /**
     * Validate payout before save
     */
    public void validate() {
        if (teacher == null) {
            throw new IllegalStateException("Teacher is required");
        }
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalStateException("Amount must be greater than zero");
        }
        if (payoutPeriod == null || payoutPeriod.isBlank()) {
            throw new IllegalStateException("Payout period is required");
        }
        if (bankAccountNumber == null || bankAccountNumber.isBlank()) {
            throw new IllegalStateException("Bank account number is required");
        }
        if (bankName == null || bankName.isBlank()) {
            throw new IllegalStateException("Bank name is required");
        }
    }
}
