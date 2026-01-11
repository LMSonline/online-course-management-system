package vn.uit.lms.shared.dto.request.billing;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRevenueShareConfigRequest {

    @DecimalMin(value = "0.0", message = "Percentage must be at least 0")
    @DecimalMax(value = "100.0", message = "Percentage must not exceed 100")
    private BigDecimal percentage;

    private LocalDate effectiveTo;

    private String description;

    private BigDecimal minimumPayoutAmount;

    private Boolean isActive;

    private String versionNote;
}

