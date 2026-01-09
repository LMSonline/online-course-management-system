package vn.uit.lms.shared.dto.request.billing;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ZaloPay Callback Request DTO
 * Represents the data received from ZaloPay callback
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ZaloPayCallbackRequest {

    /**
     * JSON string contains ZaloPay transaction data
     */
    private String data;

    /**
     * MAC signature for verification
     */
    private String mac;

    /**
     * Callback type (1: Order, 2: Agreement)
     */
    private Integer type;
}

