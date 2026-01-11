package vn.uit.lms.service.billing.gateway;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import vn.uit.lms.shared.constant.PaymentProvider;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * VNPay Payment Gateway Implementation
 * https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
 */
@Service
@Slf4j
public class VNPayGateway implements PaymentGateway {

    @Value("${vnpay.url:https://sandbox.vnpayment.vn/paymentv2/vpcpay.html}")
    private String vnpUrl;

    @Value("${vnpay.tmnCode:YOUR_TMN_CODE}")
    private String tmnCode;

    @Value("${vnpay.hashSecret:YOUR_SECRET_KEY}")
    private String hashSecret;

    @Value("${vnpay.returnUrl:http://localhost:8080/api/v1/payments/vnpay-return}")
    private String defaultReturnUrl;

    @Value("${vnpay.version:2.1.0}")
    private String version;

    @Value("${vnpay.command:pay}")
    private String command;

    @Value("${vnpay.currencyCode:VND}")
    private String currencyCode;

    @Value("${vnpay.locale:vn}")
    private String locale;

    @Override
    public PaymentProvider getGatewayName() {
        return PaymentProvider.VNPAY;
    }

    @Override
    public String createPaymentUrl(String orderId, BigDecimal amount, String orderInfo,
                                   String returnUrl, String ipAddress) {
        try {
            Map<String, String> vnpParams = new TreeMap<>();

            vnpParams.put("vnp_Version", version);
            vnpParams.put("vnp_Command", command);
            vnpParams.put("vnp_TmnCode", tmnCode);
            vnpParams.put("vnp_Amount", String.valueOf(amount.multiply(new BigDecimal(100)).longValue()));
            vnpParams.put("vnp_CurrCode", currencyCode);
            vnpParams.put("vnp_TxnRef", orderId);
            vnpParams.put("vnp_OrderInfo", orderInfo);
            vnpParams.put("vnp_OrderType", "other");
            vnpParams.put("vnp_Locale", locale);
            vnpParams.put("vnp_ReturnUrl", returnUrl != null ? returnUrl : defaultReturnUrl);
            vnpParams.put("vnp_IpAddr", ipAddress);

            // Create date format: yyyyMMddHHmmss
            SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
            String vnpCreateDate = formatter.format(new Date());
            vnpParams.put("vnp_CreateDate", vnpCreateDate);

            // Expire after 15 minutes
            Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
            cld.add(Calendar.MINUTE, 15);
            String vnpExpireDate = formatter.format(cld.getTime());
            vnpParams.put("vnp_ExpireDate", vnpExpireDate);

            // Build hash data
            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();

            for (Map.Entry<String, String> entry : vnpParams.entrySet()) {
                if (hashData.length() > 0) {
                    hashData.append('&');
                    query.append('&');
                }
                hashData.append(entry.getKey()).append('=')
                        .append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8));
                query.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8))
                     .append('=')
                     .append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8));
            }

            String vnpSecureHash = hmacSHA512(hashSecret, hashData.toString());
            query.append("&vnp_SecureHash=").append(vnpSecureHash);

            String paymentUrl = vnpUrl + "?" + query;
            log.info("VNPay payment URL created for order: {}", orderId);

            return paymentUrl;

        } catch (Exception e) {
            log.error("Error creating VNPay payment URL", e);
            throw new RuntimeException("Failed to create payment URL", e);
        }
    }

    @Override
    public boolean verifyPayment(Map<String, String> params) {
        try {
            String vnpSecureHash = params.get("vnp_SecureHash");
            if (vnpSecureHash == null) {
                return false;
            }

            // Remove hash params
            Map<String, String> fields = new TreeMap<>(params);
            fields.remove("vnp_SecureHash");
            fields.remove("vnp_SecureHashType");

            // Build hash data
            StringBuilder hashData = new StringBuilder();
            for (Map.Entry<String, String> entry : fields.entrySet()) {
                String fieldName = entry.getKey();
                String fieldValue = entry.getValue();
                if (fieldValue != null && !fieldValue.isEmpty()) {
                    if (hashData.length() > 0) {
                        hashData.append('&');
                    }
                    hashData.append(fieldName).append('=')
                            .append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8));
                }
            }

            String calculatedHash = hmacSHA512(hashSecret, hashData.toString());
            return vnpSecureHash.equals(calculatedHash);

        } catch (Exception e) {
            log.error("Error verifying VNPay payment", e);
            return false;
        }
    }

    @Override
    public String getTransactionId(Map<String, String> params) {
        return params.get("vnp_TransactionNo");
    }

    @Override
    public boolean isPaymentSuccess(Map<String, String> params) {
        String responseCode = params.get("vnp_ResponseCode");
        return "00".equals(responseCode);
    }

    @Override
    public String getErrorMessage(Map<String, String> params) {
        String responseCode = params.get("vnp_ResponseCode");
        return getVNPayErrorMessage(responseCode);
    }

    @Override
    public String requestRefund(String transactionId, BigDecimal amount, String reason) {
        // VNPay refund requires API call to their refund endpoint
        // This is a placeholder - implement actual refund API call
        log.warn("VNPay refund not yet implemented for transaction: {}", transactionId);
        throw new UnsupportedOperationException("VNPay refund requires manual processing or API integration");
    }

    /**
     * HMAC SHA512 encryption
     */
    private String hmacSHA512(String key, String data) {
        try {
            Mac hmac512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac512.init(secretKey);
            byte[] result = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));

            StringBuilder sb = new StringBuilder();
            for (byte b : result) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();

        } catch (Exception e) {
            throw new RuntimeException("Error generating HMAC SHA512", e);
        }
    }

    /**
     * Get error message from VNPay response code
     */
    private String getVNPayErrorMessage(String responseCode) {
        return switch (responseCode) {
            case "00" -> "Giao dịch thành công";
            case "07" -> "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).";
            case "09" -> "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.";
            case "10" -> "Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần";
            case "11" -> "Giao dịch không thành công do: Đã hết hạn chờ thanh toán.";
            case "12" -> "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.";
            case "13" -> "Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP).";
            case "24" -> "Giao dịch không thành công do: Khách hàng hủy giao dịch";
            case "51" -> "Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.";
            case "65" -> "Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.";
            case "75" -> "Ngân hàng thanh toán đang bảo trì.";
            case "79" -> "Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định.";
            default -> "Giao dịch thất bại";
        };
    }
}

