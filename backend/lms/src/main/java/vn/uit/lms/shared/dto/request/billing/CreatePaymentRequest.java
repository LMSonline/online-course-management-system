package vn.uit.lms.shared.dto.request.billing;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePaymentRequest {

    @NotNull(message = "Course ID is required")
    private Long courseId;

    @NotNull(message = "Course version ID is required")
    private Long courseVersionId;

    private String paymentMethod; // VNPAY, ZALOPAY, etc.

    private String returnUrl; // URL to redirect after payment

    private String userAgent;
}

