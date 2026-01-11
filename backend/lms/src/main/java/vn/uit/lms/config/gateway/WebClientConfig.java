package vn.uit.lms.config.gateway;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
@RequiredArgsConstructor
public class WebClientConfig {

    private final ZaloPayConfig zaloPayConfig;

    @Bean
    public WebClient zaloPayWebClient() {
        return WebClient.builder()
                .baseUrl(zaloPayConfig.getEndpoints().getBase())
                .build();
    }
}
