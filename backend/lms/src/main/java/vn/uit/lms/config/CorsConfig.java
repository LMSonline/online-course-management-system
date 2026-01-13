package vn.uit.lms.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOriginPatterns(List.of("*"));

        config.setAllowedMethods(List.of("*"));

        config.setAllowedHeaders(List.of("*"));

        config.setExposedHeaders(List.of(
                "Authorization",
                "ETag",
                "Location",
                "Content-Disposition"
        ));

       config.setAllowCredentials(true);

        // Cache CORS preflight (OPTIONS)
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
