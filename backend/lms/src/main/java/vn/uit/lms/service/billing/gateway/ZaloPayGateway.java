package vn.uit.lms.service.billing.gateway;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import vn.uit.lms.config.gateway.ZaloPayConfig;
import vn.uit.lms.shared.constant.PaymentProvider;
import vn.uit.lms.shared.constant.ZaloPaymentMethod;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

/**
 * ZaloPay Payment Gateway Implementation
 * Based on ZaloPay API Documentation v2
 * Reference: <a href="https://docs.zalopay.vn/">ZaloPay Documentation</a>
 */
@Service
@Slf4j
public class ZaloPayGateway implements PaymentGateway {

    // Constants
    private static final String DATE_FORMAT_PATTERN = "yyMMdd";
    private static final String TRANSACTION_ID_SEPARATOR = "_";
    private static final String USER_PREFIX = "user_";
    private static final String EMPTY_ITEMS_JSON = "[]";
    private static final String EMPTY_BANK_CODE = "";
    private static final String MAC_ALGORITHM = "HmacSHA256";
    private static final String MAC_FIELD_SEPARATOR = "|";
    private static final String HEX_FORMAT = "%02x";
    private static final int UUID_SUBSTRING_LENGTH = 10;

    // Response field names
    private static final String FIELD_RETURN_CODE = "return_code";
    private static final String FIELD_RETURN_MESSAGE = "return_message";
    private static final String FIELD_SUB_RETURN_CODE = "sub_return_code";
    private static final String FIELD_SUB_RETURN_MESSAGE = "sub_return_message";
    private static final String FIELD_ORDER_URL = "order_url";
    private static final String FIELD_REFUND_ID = "refund_id";
    private static final String FIELD_MAC = "mac";
    private static final String FIELD_DATA = "data";
    private static final String FIELD_ZP_TRANS_ID = "zp_trans_id";
    private static final String FIELD_AMOUNT = "amount";
    private static final String FIELD_ERROR_MESSAGE = "error_message";

    // Embed data field names
    private static final String EMBED_REDIRECT_URL = "redirecturl";
    private static final String EMBED_PREFERRED_PAYMENT_METHOD = "preferred_payment_method";

    // Return codes
    private static final int RETURN_CODE_SUCCESS = 1;
    private static final int RETURN_CODE_NOT_FOUND = 2;
    private static final int RETURN_CODE_PROCESSING = 3;

    // Status messages
    private static final String STATUS_SUCCESS = "SUCCESS";
    private static final String STATUS_PROCESSING = "PROCESSING";
    private static final String DEFAULT_ERROR_MESSAGE = "Payment failed";

    private final ZaloPayConfig config;
    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public ZaloPayGateway(ZaloPayConfig config,
                          @Qualifier("zaloPayWebClient") WebClient webClient,
                          ObjectMapper objectMapper) {
        this.config = config;
        this.webClient = webClient;
        this.objectMapper = objectMapper;
    }

    @Override
    public PaymentProvider getGatewayName() {
        return PaymentProvider.ZALOPAY;
    }

    @Override
    public String createPaymentUrl(String orderId, BigDecimal amount, String orderInfo,
                                   String returnUrl, String ipAddress) {
        return createPaymentUrl(orderId, amount, orderInfo, returnUrl, ipAddress,
                Collections.singletonList(ZaloPaymentMethod.ALL));
    }

    public String createPaymentUrl(String orderId, BigDecimal amount, String orderInfo,
                                   String returnUrl, String ipAddress,
                                   List<ZaloPaymentMethod> paymentMethods) {
        try {
            long appTime = System.currentTimeMillis();
            String transId = generateTransactionId(orderId);
            String embedDataJson = buildEmbedData(returnUrl, paymentMethods);
            String appUser = generateAppUser(orderId);
            String mac = calculateCreateOrderMac(transId, appUser, amount, appTime, embedDataJson);

            MultiValueMap<String, String> formData = buildCreateOrderFormData(
                    transId, appUser, amount, appTime, embedDataJson, orderInfo, mac);

            logCreateOrderRequest(transId, amount, appUser, paymentMethods, embedDataJson, mac);

            Map<String, Object> response = callZaloPayApi(
                    config.getEndpoints().getBase() + config.getEndpoints().getCreate(),
                    formData);

            return handleCreateOrderResponse(response, transId);

        } catch (Exception e) {
            log.error("Error creating ZaloPay payment URL", e);
            throw new RuntimeException("Failed to create ZaloPay payment URL: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean verifyPayment(Map<String, String> params) {
        try {
            String receivedMac = params.get(FIELD_MAC);
            String data = params.get(FIELD_DATA);

            if (receivedMac == null || data == null) {
                log.warn("Missing mac or data in callback");
                return false;
            }

            String calculatedMac = hmacSHA256(config.getKey2(), data);
            boolean isValid = receivedMac.equals(calculatedMac);

            if (!isValid) {
                log.warn("Invalid MAC signature. Expected: {}, Received: {}", calculatedMac, receivedMac);
            }

            return isValid;

        } catch (Exception e) {
            log.error("Error verifying ZaloPay payment", e);
            return false;
        }
    }

    @Override
    public String getTransactionId(Map<String, String> params) {
        try {
            String data = params.get(FIELD_DATA);
            if (data == null) {
                return null;
            }

            Map<String, Object> dataMap = objectMapper.readValue(data, Map.class);
            Object zpTransId = dataMap.get(FIELD_ZP_TRANS_ID);

            return zpTransId != null ? String.valueOf(zpTransId) : null;

        } catch (Exception e) {
            log.error("Error extracting transaction ID", e);
            return null;
        }
    }

    @Override
    public boolean isPaymentSuccess(Map<String, String> params) {
        try {
            String data = params.get(FIELD_DATA);
            if (data == null) {
                return false;
            }

            Map<String, Object> dataMap = objectMapper.readValue(data, Map.class);
            return dataMap.containsKey(FIELD_AMOUNT) && dataMap.get(FIELD_AMOUNT) != null;

        } catch (Exception e) {
            log.error("Error checking payment success", e);
            return false;
        }
    }

    @Override
    public String getErrorMessage(Map<String, String> params) {
        return params.getOrDefault(FIELD_ERROR_MESSAGE, DEFAULT_ERROR_MESSAGE);
    }

    @Override
    public String requestRefund(String transactionId, BigDecimal amount, String reason) {
        try {
            long timestamp = System.currentTimeMillis();
            String mRefundId = generateRefundId();
            String mac = calculateRefundMac(transactionId, amount, reason, timestamp);

            MultiValueMap<String, String> formData = buildRefundFormData(
                    mRefundId, transactionId, amount, timestamp, reason, mac);

            logRefundRequest(mRefundId, transactionId, amount, mac);

            Map<String, Object> response = callZaloPayApi(
                    config.getEndpoints().getBase() + config.getEndpoints().getRefund(),
                    formData);

            return handleRefundResponse(response, mRefundId);

        } catch (Exception e) {
            log.error("Error requesting ZaloPay refund", e);
            throw new RuntimeException("Failed to request ZaloPay refund: " + e.getMessage(), e);
        }
    }

    public Map<String, Object> queryOrderStatus(String appTransId) {
        try {
            String macData = buildQueryMacData(appTransId);
            String mac = hmacSHA256(config.getKey1(), macData);

            MultiValueMap<String, String> formData = buildQueryFormData(appTransId, mac);

            logQueryRequest(appTransId, macData, mac);

            Map<String, Object> response = callZaloPayApi(
                    config.getEndpoints().getBase() + config.getEndpoints().getQuery(),
                    formData);

            return handleQueryResponse(response, appTransId);

        } catch (Exception e) {
            log.error("Error querying ZaloPay order status", e);
            throw new RuntimeException("Failed to query order status: " + e.getMessage(), e);
        }
    }

    public Map<String, Object> queryRefundStatus(String mRefundId) {
        try {
            long timestamp = System.currentTimeMillis();
            String macData = buildRefundQueryMacData(mRefundId, timestamp);
            String mac = hmacSHA256(config.getKey1(), macData);

            MultiValueMap<String, String> formData = buildRefundQueryFormData(
                    mRefundId, timestamp, mac);

            logRefundQueryRequest(mRefundId, macData, mac);

            Map<String, Object> response = callZaloPayApi(
                    config.getEndpoints().getBase() + config.getEndpoints().getRefundQuery(),
                    formData);

            return handleRefundQueryResponse(response, mRefundId);

        } catch (Exception e) {
            log.error("Error querying ZaloPay refund status", e);
            throw new RuntimeException("Failed to query refund status: " + e.getMessage(), e);
        }
    }

    // Helper methods for ID generation
    private String generateTransactionId(String orderId) {
        SimpleDateFormat dateFormat = new SimpleDateFormat(DATE_FORMAT_PATTERN);
        return dateFormat.format(new Date()) + TRANSACTION_ID_SEPARATOR +
                config.getAppid() + TRANSACTION_ID_SEPARATOR + orderId;
    }

    private String generateRefundId() {
        SimpleDateFormat dateFormat = new SimpleDateFormat(DATE_FORMAT_PATTERN);
        String uuid = UUID.randomUUID().toString().replace("-", "")
                .substring(0, UUID_SUBSTRING_LENGTH);
        return dateFormat.format(new Date()) + TRANSACTION_ID_SEPARATOR +
                config.getAppid() + TRANSACTION_ID_SEPARATOR + uuid;
    }

    private String generateAppUser(String orderId) {
        return USER_PREFIX + orderId;
    }

    // Helper methods for building data
    private String buildEmbedData(String returnUrl, List<ZaloPaymentMethod> paymentMethods)
            throws Exception {
        Map<String, Object> embedData = new HashMap<>();

        if (returnUrl != null && !returnUrl.isEmpty()) {
            embedData.put(EMBED_REDIRECT_URL, returnUrl);
        }

        embedData.put(EMBED_PREFERRED_PAYMENT_METHOD,
                extractPaymentMethods(paymentMethods));

        return objectMapper.writeValueAsString(embedData);
    }

    private List<String> extractPaymentMethods(List<ZaloPaymentMethod> paymentMethods) {
        if (paymentMethods == null || paymentMethods.isEmpty()) {
            return new ArrayList<>();
        }

        if (paymentMethods.size() == 1 && paymentMethods.get(0) == ZaloPaymentMethod.ALL) {
            return new ArrayList<>();
        }

        return paymentMethods.stream()
                .filter(method -> method != ZaloPaymentMethod.ALL)
                .map(ZaloPaymentMethod::getValue)
                .collect(Collectors.toList());
    }

    // Helper methods for MAC calculation
    private String calculateCreateOrderMac(String transId, String appUser, BigDecimal amount,
                                           long appTime, String embedDataJson) {
        String macData = String.join(MAC_FIELD_SEPARATOR,
                config.getAppid(),
                transId,
                appUser,
                String.valueOf(amount.longValue()),
                String.valueOf(appTime),
                embedDataJson,
                EMPTY_ITEMS_JSON);
        return hmacSHA256(config.getKey1(), macData);
    }

    private String calculateRefundMac(String transactionId, BigDecimal amount,
                                      String reason, long timestamp) {
        String macData = String.join(MAC_FIELD_SEPARATOR,
                config.getAppid(),
                transactionId,
                String.valueOf(amount.longValue()),
                reason,
                String.valueOf(timestamp));
        return hmacSHA256(config.getKey1(), macData);
    }

    private String buildQueryMacData(String appTransId) {
        return String.join(MAC_FIELD_SEPARATOR,
                config.getAppid(),
                appTransId,
                config.getKey1());
    }

    private String buildRefundQueryMacData(String mRefundId, long timestamp) {
        return String.join(MAC_FIELD_SEPARATOR,
                config.getAppid(),
                mRefundId,
                String.valueOf(timestamp));
    }

    // Helper methods for building form data
    private MultiValueMap<String, String> buildCreateOrderFormData(String transId, String appUser,
                                                                   BigDecimal amount, long appTime, String embedDataJson, String orderInfo, String mac) {
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("app_id", config.getAppid());
        formData.add("app_user", appUser);
        formData.add("app_trans_id", transId);
        formData.add("app_time", String.valueOf(appTime));
        formData.add(FIELD_AMOUNT, String.valueOf(amount.longValue()));
        formData.add("item", EMPTY_ITEMS_JSON);
        formData.add("embed_data", embedDataJson);
        formData.add("bank_code", EMPTY_BANK_CODE);
        formData.add("description", orderInfo);
        formData.add(FIELD_MAC, mac);
        formData.add("callback_url", config.getEndpoints().getCallback());
        return formData;
    }

    private MultiValueMap<String, String> buildRefundFormData(String mRefundId,
                                                              String transactionId, BigDecimal amount, long timestamp, String reason, String mac) {
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("app_id", config.getAppid());
        formData.add("m_refund_id", mRefundId);
        formData.add("zp_trans_id", transactionId);
        formData.add(FIELD_AMOUNT, String.valueOf(amount.longValue()));
        formData.add("timestamp", String.valueOf(timestamp));
        formData.add("description", reason);
        formData.add(FIELD_MAC, mac);
        return formData;
    }

    private MultiValueMap<String, String> buildQueryFormData(String appTransId, String mac) {
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("app_id", config.getAppid());
        formData.add("app_trans_id", appTransId);
        formData.add(FIELD_MAC, mac);
        return formData;
    }

    private MultiValueMap<String, String> buildRefundQueryFormData(String mRefundId,
                                                                   long timestamp, String mac) {
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("app_id", config.getAppid());
        formData.add("m_refund_id", mRefundId);
        formData.add("timestamp", String.valueOf(timestamp));
        formData.add(FIELD_MAC, mac);
        return formData;
    }

    // Helper methods for API calls
    private Map<String, Object> callZaloPayApi(String endpoint,
                                               MultiValueMap<String, String> formData) {
        log.debug("Calling ZaloPay endpoint: {}", endpoint);

        Map<String, Object> response = webClient.post()
                .uri(endpoint)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData(formData))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();

        if (response == null) {
            log.error("No response from ZaloPay");
            throw new RuntimeException("No response from ZaloPay");
        }

        log.info("ZaloPay response: {}", response);
        return response;
    }

    // Helper methods for response handling
    private String handleCreateOrderResponse(Map<String, Object> response, String transId) {
        int returnCode = (Integer) response.get(FIELD_RETURN_CODE);
        String returnMessage = (String) response.get(FIELD_RETURN_MESSAGE);

        if (returnCode == RETURN_CODE_SUCCESS) {
            String orderUrl = (String) response.get(FIELD_ORDER_URL);
            log.info("ZaloPay order created successfully: transId={}, orderUrl={}",
                    transId, orderUrl);
            return orderUrl;
        } else {
            throwZaloPayException(returnCode, returnMessage, response, "create order");
            return null;
        }
    }

    private String handleRefundResponse(Map<String, Object> response, String mRefundId) {
        int returnCode = (Integer) response.get(FIELD_RETURN_CODE);
        String returnMessage = (String) response.get(FIELD_RETURN_MESSAGE);

        if (returnCode == RETURN_CODE_SUCCESS || returnCode == RETURN_CODE_PROCESSING) {
            Object refundId = response.get(FIELD_REFUND_ID);
            String status = returnCode == RETURN_CODE_SUCCESS ?
                    STATUS_SUCCESS : STATUS_PROCESSING;
            log.info("ZaloPay refund initiated: mRefundId={}, refundId={}, status={}",
                    mRefundId, refundId, status);
            return String.valueOf(refundId);
        } else {
            throwZaloPayException(returnCode, returnMessage, response, "refund");
            return null;
        }
    }

    private Map<String, Object> handleQueryResponse(Map<String, Object> response,
                                                    String appTransId) {
        int returnCode = (Integer) response.get(FIELD_RETURN_CODE);
        String returnMessage = (String) response.get(FIELD_RETURN_MESSAGE);

        if (returnCode == RETURN_CODE_SUCCESS) {
            log.info("ZaloPay order status retrieved successfully: appTransId={}", appTransId);
            return response;
        } else if (returnCode == RETURN_CODE_NOT_FOUND) {
            log.warn("ZaloPay order not found or unpaid: appTransId={}, message={}",
                    appTransId, returnMessage);
            return response;
        } else {
            throwZaloPayException(returnCode, returnMessage, response, "query");
            return null;
        }
    }

    private Map<String, Object> handleRefundQueryResponse(Map<String, Object> response,
                                                          String mRefundId) {
        int returnCode = (Integer) response.get(FIELD_RETURN_CODE);
        String returnMessage = (String) response.get(FIELD_RETURN_MESSAGE);

        if (returnCode == RETURN_CODE_SUCCESS) {
            log.info("ZaloPay refund status retrieved successfully: mRefundId={}", mRefundId);
            return response;
        } else if (returnCode == RETURN_CODE_NOT_FOUND) {
            log.warn("ZaloPay refund not found: mRefundId={}, message={}",
                    mRefundId, returnMessage);
            return response;
        } else {
            throwZaloPayException(returnCode, returnMessage, response, "refund query");
            return null;
        }
    }

    private void throwZaloPayException(int returnCode, String returnMessage,
                                       Map<String, Object> response, String operation) {
        Integer subReturnCode = (Integer) response.get(FIELD_SUB_RETURN_CODE);
        String subReturnMessage = (String) response.get(FIELD_SUB_RETURN_MESSAGE);

        log.error("ZaloPay {} failed: return_code={}, return_message={}, " +
                        "sub_return_code={}, sub_return_message={}",
                operation, returnCode, returnMessage, subReturnCode, subReturnMessage);

        throw new RuntimeException(String.format("ZaloPay %s error [%d]: %s - %s",
                operation,
                subReturnCode != null ? subReturnCode : returnCode,
                returnMessage,
                subReturnMessage != null ? subReturnMessage : ""));
    }

    // Logging helpers
    private void logCreateOrderRequest(String transId, BigDecimal amount, String appUser,
                                       List<ZaloPaymentMethod> paymentMethods, String embedDataJson, String mac) {
        log.info("ZaloPay create order request: transId={}, amount={}, appUser={}, paymentMethods={}",
                transId, amount, appUser, paymentMethods);
        log.debug("ZaloPay embed_data: {}", embedDataJson);
        log.debug("ZaloPay MAC result: {}", mac);
    }

    private void logRefundRequest(String mRefundId, String transactionId,
                                  BigDecimal amount, String mac) {
        log.info("ZaloPay refund request: mRefundId={}, zpTransId={}, amount={}",
                mRefundId, transactionId, amount);
        log.debug("ZaloPay refund MAC result: {}", mac);
    }

    private void logQueryRequest(String appTransId, String macData, String mac) {
        log.info("ZaloPay query order status request: appTransId={}", appTransId);
        log.debug("ZaloPay query MAC calculation - macData: {}", macData);
        log.debug("ZaloPay query MAC result: {}", mac);
    }

    private void logRefundQueryRequest(String mRefundId, String macData, String mac) {
        log.info("ZaloPay query refund status request: mRefundId={}", mRefundId);
        log.debug("ZaloPay refund query MAC calculation - macData: {}", macData);
        log.debug("ZaloPay refund query MAC result: {}", mac);
    }

    // Core cryptographic function
    private String hmacSHA256(String key, String data) {
        try {
            Mac hmac256 = Mac.getInstance(MAC_ALGORITHM);
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(), MAC_ALGORITHM);
            hmac256.init(secretKey);
            byte[] result = hmac256.doFinal(data.getBytes());

            StringBuilder sb = new StringBuilder();
            for (byte b : result) {
                sb.append(String.format(HEX_FORMAT, b));
            }
            return sb.toString();

        } catch (Exception e) {
            throw new RuntimeException("Error generating HMAC SHA256", e);
        }
    }
}