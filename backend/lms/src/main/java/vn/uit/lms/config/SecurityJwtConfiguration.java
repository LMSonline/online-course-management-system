package vn.uit.lms.config;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import com.nimbusds.jose.util.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import static vn.uit.lms.shared.util.SecurityUtils.JWT_ALGORITHM;

/**
 * Configuration class for JWT encoding and decoding setup.
 * <p>
 * This class defines the beans required for handling JWT authentication,
 * including encoder, decoder, and authority converter for Spring Security.
 * </p>
 */
@Configuration
public class SecurityJwtConfiguration {

    /**
     * Logger for security JWT configuration events and decoding errors.
     */
    private static final Logger LOG = LoggerFactory.getLogger(SecurityJwtConfiguration.class);

    /**
     * The base64-encoded JWT secret key loaded from the application properties.
     */
    @Value("${jwt.secret}")
    private String jwtKey;

    /**
     * Creates a {@link JwtAuthenticationConverter} bean that extracts granted authorities
     * from a JWT's custom "permissions" claim.
     * <p>
     * Removes the default "ROLE_" prefix and directly maps permissions into Spring authorities.
     * </p>
     *
     * @return a configured {@link JwtAuthenticationConverter} instance
     */
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthorityPrefix("");
        grantedAuthoritiesConverter.setAuthoritiesClaimName("permissions");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }

    /**
     * Creates a {@link JwtDecoder} bean used to validate and decode JWT tokens.
     * <p>
     * Uses a symmetric secret key (HMAC) and the configured algorithm from {@link JWT_ALGORITHM}.
     * Logs decoding errors for debugging and security tracing.
     * </p>
     *
     * @return a configured {@link JwtDecoder} instance
     */
    @Bean
    public JwtDecoder jwtDecoder() {
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withSecretKey(getSecretKey())
                .macAlgorithm(JWT_ALGORITHM)
                .build();

        return token -> {
            try {
                return jwtDecoder.decode(token);
            } catch (Exception e) {
                LOG.warn(">>> JWT error: {}", e.getMessage());
                throw e;
            }
        };
    }

    /**
     * Creates a {@link JwtEncoder} bean for generating JWT tokens using the same secret key.
     *
     * @return a configured {@link JwtEncoder} instance
     */
    @Bean
    public JwtEncoder jwtEncoder() {
        return new NimbusJwtEncoder(new ImmutableSecret<>(getSecretKey()));
    }

    /**
     * Converts the base64-encoded {@code jwtKey} into a {@link SecretKey} instance.
     * <p>
     * This key is used by both encoder and decoder for HMAC signing and verification.
     * </p>
     *
     * @return a {@link SecretKey} based on the configured secret
     */
    private SecretKey getSecretKey() {
        byte[] keyBytes = Base64.from(jwtKey).decode();
        return new SecretKeySpec(keyBytes, 0, keyBytes.length, JWT_ALGORITHM.getName());
    }
}
