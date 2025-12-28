package vn.uit.lms.service.billing.gateway;

import java.math.BigDecimal;
import java.util.Map;

/**
 * Payment Gateway Interface (Strategy Pattern)
 * Allows for easy integration with multiple payment providers
 */
public interface PaymentGateway {

    /**
     * Get the gateway name
     */
    String getGatewayName();

    /**
     * Create a payment URL for the user to complete payment
     *
     * @param orderId Internal order/payment ID
     * @param amount Payment amount
     * @param orderInfo Order description
     * @param returnUrl URL to redirect after payment
     * @param ipAddress User's IP address
     * @return Payment URL
     */
    String createPaymentUrl(
            String orderId,
            BigDecimal amount,
            String orderInfo,
            String returnUrl,
            String ipAddress
    );

    /**
     * Verify payment from gateway callback
     *
     * @param params Parameters from payment gateway callback
     * @return true if payment is valid and successful
     */
    boolean verifyPayment(Map<String, String> params);

    /**
     * Get transaction ID from gateway response
     */
    String getTransactionId(Map<String, String> params);

    /**
     * Check if payment was successful
     */
    boolean isPaymentSuccess(Map<String, String> params);

    /**
     * Get error message if payment failed
     */
    String getErrorMessage(Map<String, String> params);

    /**
     * Request a refund (if supported)
     *
     * @param transactionId Original transaction ID
     * @param amount Amount to refund
     * @param reason Refund reason
     * @return Refund transaction ID
     */
    String requestRefund(String transactionId, BigDecimal amount, String reason);
}

