package vn.uit.lms.service.billing;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import vn.uit.lms.service.billing.gateway.PaymentFactory;
import vn.uit.lms.service.billing.gateway.ZaloPayGateway;
import vn.uit.lms.shared.constant.PaymentProvider;
import vn.uit.lms.shared.dto.response.billing.ZaloPayQueryResponse;

import java.util.Map;

/**
 * ZaloPay Service
 * Additional operations specific to ZaloPay gateway
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class ZaloPayService {

    private final PaymentFactory paymentFactory;

    /**
     * Query order status from ZaloPay
     *
     * @param appTransId ZaloPay app transaction ID
     * @return Query response with order status
     */
    public ZaloPayQueryResponse queryOrderStatus(String appTransId) {
        ZaloPayGateway gateway = (ZaloPayGateway) paymentFactory.getProcessor(PaymentProvider.ZALOPAY);

        Map<String, Object> response = gateway.queryOrderStatus(appTransId);

        return ZaloPayQueryResponse.builder()
                .returnCode((Integer) response.get("return_code"))
                .returnMessage((String) response.get("return_message"))
                .subReturnCode((Integer) response.get("sub_return_code"))
                .subReturnMessage((String) response.get("sub_return_message"))
                .isProcessing((Boolean) response.get("is_processing"))
                .amount(response.get("amount") != null ? ((Number) response.get("amount")).longValue() : null)
                .zpTransId(response.get("zp_trans_id") != null ? ((Number) response.get("zp_trans_id")).longValue() : null)
                .serverTime(response.get("server_time") != null ? ((Number) response.get("server_time")).longValue() : null)
                .build();
    }

    /**
     * Query refund status from ZaloPay
     *
     * @param mRefundId Merchant refund ID
     * @return Query response with refund status
     */
    public ZaloPayQueryResponse queryRefundStatus(String mRefundId) {
        ZaloPayGateway gateway = (ZaloPayGateway) paymentFactory.getProcessor(PaymentProvider.ZALOPAY);

        Map<String, Object> response = gateway.queryRefundStatus(mRefundId);

        return ZaloPayQueryResponse.builder()
                .returnCode((Integer) response.get("return_code"))
                .returnMessage((String) response.get("return_message"))
                .subReturnCode((Integer) response.get("sub_return_code"))
                .subReturnMessage((String) response.get("sub_return_message"))
                .build();
    }
}

