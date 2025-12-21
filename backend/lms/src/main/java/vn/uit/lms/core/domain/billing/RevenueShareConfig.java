package vn.uit.lms.core.domain.billing;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import vn.uit.lms.shared.entity.BaseEntity;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(
        name = "revenue_share_configs",
        indexes = {
                @Index(name = "idx_revenue_effective", columnList = "effective_from, effective_to"),
                @Index(name = "idx_revenue_active", columnList = "is_active")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RevenueShareConfig extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "percentage", nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal percentage = new BigDecimal("90.00");

    @Column(name = "effective_from", nullable = false)
    private LocalDate effectiveFrom;

    @Column(name = "effective_to")
    private LocalDate effectiveTo;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "minimum_payout_amount", precision = 12, scale = 2)
    private BigDecimal minimumPayoutAmount;

    @Column(name = "category_id")
    private Long categoryId;


    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "metadata", columnDefinition = "JSON")
    private Map<String, Object> metadata;


    @Column(name = "version_note", columnDefinition = "TEXT")
    private String versionNote;


    public boolean isActiveOn(LocalDate date) {
        if (!Boolean.TRUE.equals(this.isActive)) {
            return false;
        }

        LocalDate checkDate = (date != null) ? date : LocalDate.now();

        boolean afterStart = !checkDate.isBefore(this.effectiveFrom);
        boolean beforeEnd = this.effectiveTo == null || !checkDate.isAfter(this.effectiveTo);

        return afterStart && beforeEnd;
    }

    public boolean isCurrentlyActive() {
        return isActiveOn(LocalDate.now());
    }


    public void deactivate() {
        if (!this.isActive) {
            throw new IllegalStateException("Config is already inactive");
        }

        LocalDate today = LocalDate.now();
        this.effectiveTo = today.isBefore(this.effectiveFrom)
                ? this.effectiveFrom
                : today.minusDays(1);

        this.isActive = false;
    }


    public void deactivate(LocalDate endDate) {
        if (!this.isActive) {
            throw new IllegalStateException("Config is already inactive");
        }

        if (endDate == null || endDate.isBefore(this.effectiveFrom)) {
            throw new IllegalArgumentException("Invalid end date");
        }

        this.effectiveTo = endDate;
        this.isActive = false;
    }

    public BigDecimal getPlatformPercentage() {
        return new BigDecimal("100").subtract(this.percentage);
    }

    public BigDecimal calculateTeacherRevenue(BigDecimal totalRevenue) {
        if (totalRevenue == null) {
            return BigDecimal.ZERO;
        }

        return totalRevenue.multiply(
                this.percentage.divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP)
        );
    }

    public BigDecimal calculatePlatformRevenue(BigDecimal totalRevenue) {
        if (totalRevenue == null) {
            return BigDecimal.ZERO;
        }

        return totalRevenue.multiply(
                getPlatformPercentage()
                        .divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP)
        );
    }

    public boolean meetsMinimumPayout(BigDecimal amount) {
        if (this.minimumPayoutAmount == null) {
            return true;
        }
        if (amount == null) {
            return false;
        }
        return amount.compareTo(this.minimumPayoutAmount) >= 0;
    }

    public void addMetadata(String key, Object value) {
        if (this.metadata == null) {
            this.metadata = new HashMap<>();
        }
        this.metadata.put(key, value);
    }

    public RevenueShareConfig cloneForNewVersion(
            BigDecimal newPercentage,
            LocalDate newEffectiveFrom,
            String note
    ) {
        if (newPercentage == null || newEffectiveFrom == null) {
            throw new IllegalArgumentException("Percentage and effectiveFrom are required");
        }

        this.deactivate(newEffectiveFrom.minusDays(1));

        return RevenueShareConfig.builder()
                .percentage(newPercentage)
                .effectiveFrom(newEffectiveFrom)
                .effectiveTo(null)
                .isActive(true)
                .description(this.description)
                .minimumPayoutAmount(this.minimumPayoutAmount)
                .categoryId(this.categoryId)
                .metadata(this.metadata)
                .versionNote(note)
                .build();
    }

    public boolean overlapsWith(RevenueShareConfig other) {
        if (other == null) {
            return false;
        }

        LocalDate thisStart = this.effectiveFrom;
        LocalDate thisEnd = this.effectiveTo != null ? this.effectiveTo : LocalDate.MAX;

        LocalDate otherStart = other.effectiveFrom;
        LocalDate otherEnd = other.effectiveTo != null ? other.effectiveTo : LocalDate.MAX;

        return !thisEnd.isBefore(otherStart) && !otherEnd.isBefore(thisStart);
    }


    protected void validate() {
        if (this.percentage == null) {
            throw new IllegalArgumentException("Percentage cannot be null");
        }

        if (this.percentage.compareTo(BigDecimal.ZERO) < 0
                || this.percentage.compareTo(new BigDecimal("100")) > 0) {
            throw new IllegalArgumentException("Percentage must be between 0 and 100");
        }

        if (this.effectiveFrom == null) {
            throw new IllegalArgumentException("Effective from date cannot be null");
        }

        if (this.effectiveTo != null && this.effectiveTo.isBefore(this.effectiveFrom)) {
            throw new IllegalArgumentException("Effective to date cannot be before effective from date");
        }
    }
}
