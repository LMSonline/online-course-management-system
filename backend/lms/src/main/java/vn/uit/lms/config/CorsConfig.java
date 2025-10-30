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
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

//         Allowed frontend origins (development and local testing)
        config.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",
                "http://localhost:4173",
                "http://localhost:5173",
                "http://192.168.1.68:5173"
        ));

        // Allowed HTTP methods
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Allowed request headers
        config.setAllowedHeaders(Arrays.asList(
                "Authorization", "Content-Type", "Accept", "X-Requested-With", "x-no-retry"
        ));

        // Allow cookies / authorization headers to be sent
        config.setAllowCredentials(true);

        // Cache preflight (OPTIONS) response for 1 hour
        config.setMaxAge(3600L);

        // Apply configuration to all API endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}

