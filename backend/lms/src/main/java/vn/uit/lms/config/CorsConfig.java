package vn.uit.lms.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Global CORS configuration.
 * Allows frontend clients (running on different origins) to call backend APIs safely.
 * 
 * This configuration is automatically picked up by Spring Security via
 * SecurityConfiguration.filterChain() which uses .cors(Customizer.withDefaults()).
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Allowed frontend origins (development and local testing)
        config.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "http://localhost:4173",
                "http://localhost:5173",
                "http://192.168.1.68:5173"
        ));

        // Allowed HTTP methods (including OPTIONS for preflight)
        config.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
        ));

        // Allowed request headers
        // Note: x-contract-key is required by frontend for contract-based API calls
        config.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "Accept",
                "X-Requested-With",
                "x-contract-key",
                "x-no-retry"
        ));

        // Exposed headers that frontend can read from response
        config.setExposedHeaders(Arrays.asList(
                "Authorization",
                "x-trace-id"
        ));

        // Allow cookies / authorization headers to be sent
        // Set to true because we use JWT tokens in Authorization header
        config.setAllowCredentials(true);

        // Cache preflight (OPTIONS) response for 1 hour
        // This reduces the number of preflight requests
        config.setMaxAge(3600L);

        // Apply configuration to all API endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}

