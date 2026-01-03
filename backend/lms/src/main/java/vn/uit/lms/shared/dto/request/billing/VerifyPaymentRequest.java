package vn.uit.lms.shared.dto.request.billing;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerifyPaymentRequest {

    @NotBlank(message = "Transaction ID is required")
    private String transactionId;

    private Map<String, String> paymentData; // Data from payment gateway
}

