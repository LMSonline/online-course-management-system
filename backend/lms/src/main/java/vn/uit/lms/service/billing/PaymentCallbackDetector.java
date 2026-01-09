package vn.uit.lms.service.billing;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import vn.uit.lms.shared.constant.PaymentProvider;

import java.util.Map;

/**
 * Callback detector service - Automatically detect payment gateway from callback data
 * This allows using a unified callback endpoint for all payment gateways
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentCallbackDetector {

    private final ObjectMapper objectMapper;

    /**
     * Detect payment provider from callback request data
     *
     * Detection rules:
     * - VNPay: Contains vnp_* parameters (vnp_TxnRef, vnp_Amount, etc.)
     * - ZaloPay: Contains 'data' and 'mac' fields with JSON data
     * - MoMo: Contains 'partnerCode', 'orderId', 'requestId' fields
     *
     * @param params Callback parameters
     * @return Detected PaymentProvider
     * @throws IllegalArgumentException if provider cannot be detected
     */
    public PaymentProvider detectProvider(Map<String, String> params) {
        log.debug("Detecting payment provider from callback params: {}", params.keySet());

        // Check for VNPay signature
        if (params.containsKey("vnp_TxnRef") ||
            params.containsKey("vnp_SecureHash") ||
            params.keySet().stream().anyMatch(key -> key.startsWith("vnp_"))) {
            log.info("Detected payment provider: VNPAY");
            return PaymentProvider.VNPAY;
        }

        // Check for ZaloPay signature
        if (params.containsKey("data") && params.containsKey("mac") && params.containsKey("type")) {
            // Additional validation: check if data is JSON with ZaloPay structure
            try {
                String data = params.get("data");
                Map<String, Object> dataMap = objectMapper.readValue(data, Map.class);
                if (dataMap.containsKey("app_id") ||
                    dataMap.containsKey("app_trans_id") ||
                    dataMap.containsKey("zp_trans_id")) {
                    log.info("Detected payment provider: ZALOPAY");
                    return PaymentProvider.ZALOPAY;
                }
            } catch (Exception e) {
                log.debug("Failed to parse ZaloPay data, continuing detection", e);
            }
        }

        // Check for MoMo signature
        if (params.containsKey("partnerCode") &&
            params.containsKey("orderId") &&
            params.containsKey("requestId") &&
            params.containsKey("signature")) {
            log.info("Detected payment provider: MOMO");
            return PaymentProvider.MOMO;
        }

        // If no provider detected, log all params for debugging
        log.error("Cannot detect payment provider from params: {}", params);
        throw new IllegalArgumentException("Cannot detect payment provider from callback data");
    }

    /**
     * Extract order ID from callback data based on provider
     *
     * @param params Callback parameters
     * @param provider Payment provider
     * @return Order ID string
     */
    public String extractOrderId(Map<String, String> params, PaymentProvider provider) {
        try {
            switch (provider) {
                case VNPAY:
                    // VNPay: vnp_TxnRef contains the order ID
                    return params.get("vnp_TxnRef");

                case ZALOPAY:
                    // ZaloPay: Parse data JSON and extract from app_trans_id
                    String data = params.get("data");
                    if (data != null) {
                        Map<String, Object> dataMap = objectMapper.readValue(data, Map.class);
                        String appTransId = (String) dataMap.get("app_trans_id");
                        if (appTransId != null) {
                            // Format: yyMMdd_appid_orderId
                            String[] parts = appTransId.split("_");
                            if (parts.length >= 3) {
                                return parts[2];
                            }
                        }
                    }
                    break;

                case MOMO:
                    // MoMo: orderId field contains the order ID
                    return params.get("orderId");

                default:
                    log.warn("Unsupported payment provider: {}", provider);
            }
        } catch (Exception e) {
            log.error("Error extracting order ID from {} callback", provider, e);
        }

        return null;
    }

    /**
     * Check if callback data appears valid for the detected provider
     * Basic validation before full MAC verification
     *
     * @param params Callback parameters
     * @param provider Payment provider
     * @return true if basic validation passes
     */
    public boolean hasValidStructure(Map<String, String> params, PaymentProvider provider) {
        switch (provider) {
            case VNPAY:
                return params.containsKey("vnp_SecureHash") &&
                       params.containsKey("vnp_TxnRef") &&
                       params.containsKey("vnp_ResponseCode");

            case ZALOPAY:
                return params.containsKey("data") &&
                       params.containsKey("mac") &&
                       params.containsKey("type");

            case MOMO:
                return params.containsKey("signature") &&
                       params.containsKey("orderId") &&
                       params.containsKey("resultCode");

            default:
                return false;
        }
    }
}

