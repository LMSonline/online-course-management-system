package vn.uit.lms.shared.dto.request.billing;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefundRequest {

    private BigDecimal refundAmount; // Null means full refund

    @NotBlank(message = "Refund reason is required")
    private String reason;
}

