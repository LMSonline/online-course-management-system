package vn.uit.lms.shared.dto.response.billing;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ZaloPay Query Response DTO
 * Response from ZaloPay query order status API
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ZaloPayQueryResponse {

    /**
     * Return code (1: SUCCESS, 2: FAIL, 3: PROCESSING)
     */
    private Integer returnCode;

    /**
     * Return message
     */
    private String returnMessage;

    /**
     * Sub return code (detailed status)
     */
    private Integer subReturnCode;

    /**
     * Sub return message (detailed description)
     */
    private String subReturnMessage;

    /**
     * Whether the payment is processing
     */
    private Boolean isProcessing;

    /**
     * Amount received (only when payment is successful)
     */
    private Long amount;

    /**
     * ZaloPay transaction ID
     */
    private Long zpTransId;

    /**
     * Server time (unix timestamp in milliseconds)
     */
    private Long serverTime;
}

