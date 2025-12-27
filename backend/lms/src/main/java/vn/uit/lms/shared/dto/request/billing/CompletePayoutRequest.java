package vn.uit.lms.shared.dto.request.billing;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompletePayoutRequest {

    @NotBlank(message = "Bank transaction ID is required")
    private String bankTransactionId;

    private String notes;
}

