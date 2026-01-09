package vn.uit.lms.service.billing.gateway;

import org.springframework.stereotype.Component;
import vn.uit.lms.shared.constant.PaymentProvider;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class PaymentFactory {

    private final Map<PaymentProvider, PaymentGateway> processors;

    public PaymentFactory(List<PaymentGateway> processorList) {
        this.processors = processorList.stream()
                .collect(Collectors.toMap(
                        PaymentGateway::getGatewayName,
                        Function.identity()
                ));
    }

    public PaymentGateway getProcessor(PaymentProvider method) {
        return Optional.ofNullable(processors.get(method))
                .orElseThrow(() ->
                        new IllegalArgumentException("Unsupported payment method: " + method)
                );
    }
}

