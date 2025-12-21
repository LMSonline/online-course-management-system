package vn.uit.lms.core.domain.billing;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import vn.uit.lms.core.domain.Student;
import vn.uit.lms.core.domain.course.Course;
import vn.uit.lms.core.domain.course.CourseVersion;
import vn.uit.lms.shared.constant.PaymentStatus;
import vn.uit.lms.shared.entity.BaseEntity;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;

@Entity
@Table(name = "payment_transactions", indexes = {
        @Index(name = "idx_payment_student", columnList = "student_id"),
        @Index(name = "idx_payment_course", columnList = "course_id"),
        @Index(name = "idx_payment_status", columnList = "status"),
        @Index(name = "idx_payment_created", columnList = "created_at"),
        @Index(name = "idx_payment_provider_txn", columnList = "provider_transaction_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentTransaction extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_version_id", nullable = false)
    private CourseVersion courseVersion;

    @Column(name = "amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(name = "currency", nullable = false, length = 10)
    @Builder.Default
    private String currency = "VND";

    @Column(name = "payment_method", length = 64)
    private String paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private PaymentStatus status = PaymentStatus.PENDING;

    @Column(name = "provider_transaction_id", length = 255)
    private String providerTransactionId;

    @Column(name = "paid_at")
    private Instant paidAt;

    @Column(name = "failed_at")
    private Instant failedAt;

    @Column(name = "failure_reason", columnDefinition = "TEXT")
    private String failureReason;

    @Column(name = "error_code", length = 50)
    private String errorCode;

    @Column(name = "refunded_at")
    private Instant refundedAt;

    @Column(name = "refund_amount", precision = 12, scale = 2)
    private BigDecimal refundAmount;

    @Column(name = "refund_reason", columnDefinition = "TEXT")
    private String refundReason;

    @Column(name = "refund_transaction_id", length = 255)
    private String refundTransactionId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "metadata", columnDefinition = "JSON")
    private Map<String, Object> metadata;

    @Column(name = "transaction_fee", precision = 12, scale = 2)
    private BigDecimal transactionFee;

    @Column(name = "net_amount", precision = 12, scale = 2)
    private BigDecimal netAmount;


    /**
     * User agent
     */
    @Column(name = "user_agent", length = 512)
    private String userAgent;


    /**
     * Đánh dấu thanh toán thành công
     */
    public void markAsSuccess(String providerTransactionId) {
        if (this.status != PaymentStatus.PENDING) {
            throw new IllegalStateException("Can only mark PENDING transactions as SUCCESS");
        }

        this.status = PaymentStatus.SUCCESS;
        this.providerTransactionId = providerTransactionId;
        this.paidAt = Instant.now();

        // Tính net amount nếu có transaction fee
        if (this.transactionFee != null) {
            this.netAmount = this.amount.subtract(this.transactionFee);
        } else {
            this.netAmount = this.amount;
        }
    }

    /**
     * Đánh dấu thanh toán thất bại
     */
    public void markAsFailed(String reason, String errorCode) {
        if (this.status != PaymentStatus.PENDING) {
            throw new IllegalStateException("Can only mark PENDING transactions as FAILED");
        }

        this.status = PaymentStatus.FAILED;
        this.failedAt = Instant.now();
        this.failureReason = reason;
        this.errorCode = errorCode;
    }

    /**
     * Hoàn tiền
     * Business Rule: Chỉ hoàn tiền transaction SUCCESS
     */
    public void refund(BigDecimal refundAmount, String reason) {
        if (this.status != PaymentStatus.SUCCESS) {
            throw new IllegalStateException("Can only refund SUCCESS transactions");
        }

        if (refundAmount.compareTo(this.amount) > 0) {
            throw new IllegalArgumentException("Refund amount cannot exceed payment amount");
        }

        this.status = PaymentStatus.REFUNDED;
        this.refundAmount = refundAmount;
        this.refundReason = reason;
        this.refundedAt = Instant.now();
    }

    /**
     * Hoàn tiền toàn bộ
     */
    public void refundFull(String reason) {
        refund(this.amount, reason);
    }

    /**
     * Kiểm tra có thể hoàn tiền không
     * Business Rule: Trong vòng 7 ngày và chưa học quá 20% khóa học
     */
    public boolean canRefund() {
        if (this.status != PaymentStatus.SUCCESS) {
            return false;
        }

        if (this.paidAt == null) {
            return false;
        }

        // Kiểm tra trong vòng 7 ngày
        long daysSincePaid = (Instant.now().getEpochSecond() - this.paidAt.getEpochSecond()) / (24 * 3600);
        return daysSincePaid <= 7;
    }

    /**
     * Set transaction fee và tính net amount
     */
    public void setTransactionFee(BigDecimal fee) {
        this.transactionFee = fee;
        if (this.amount != null && fee != null) {
            this.netAmount = this.amount.subtract(fee);
        }
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
     * Kiểm tra có phải thanh toán thành công không
     */
    public boolean isSuccess() {
        return this.status == PaymentStatus.SUCCESS;
    }

    /**
     * Kiểm tra có đang pending không
     */
    public boolean isPending() {
        return this.status == PaymentStatus.PENDING;
    }

    /**
     * Kiểm tra đã hoàn tiền chưa
     */
    public boolean isRefunded() {
        return this.status == PaymentStatus.REFUNDED;
    }

    /**
     * Lấy số tiền giáo viên nhận được (sau khi trừ platform fee)
     * Business Rule: Giáo viên nhận X% của net_amount
     */
    public BigDecimal getTeacherRevenue(Float revenueSharePercentage) {
        if (this.netAmount == null || revenueSharePercentage == null) {
            return BigDecimal.ZERO;
        }

        return this.netAmount.multiply(BigDecimal.valueOf(revenueSharePercentage / 100.0));
    }

    /**
     * Lấy số tiền platform nhận được
     */
    public BigDecimal getPlatformRevenue(Float revenueSharePercentage) {
        if (this.netAmount == null || revenueSharePercentage == null) {
            return BigDecimal.ZERO;
        }

        BigDecimal teacherRevenue = getTeacherRevenue(revenueSharePercentage);
        return this.netAmount.subtract(teacherRevenue);
    }
}
