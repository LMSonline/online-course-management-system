package vn.uit.lms.shared.dto.response.billing;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevenueShareConfigResponse {

    private Long id;

    private BigDecimal percentage;

    private BigDecimal platformPercentage;

    private LocalDate effectiveFrom;

    private LocalDate effectiveTo;

    private Boolean isActive;

    private String description;

    private BigDecimal minimumPayoutAmount;

    private Long categoryId;

    private String categoryName;

    private String versionNote;

    private Map<String, Object> metadata;

    private Instant createdAt;

    private Instant updatedAt;
}

