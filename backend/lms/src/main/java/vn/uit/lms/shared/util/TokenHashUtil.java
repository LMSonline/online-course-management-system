package vn.uit.lms.shared.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;

/**
 * Utility class for token hashing and encoding.
 */
public final class TokenHashUtil {

    private TokenHashUtil() {}

    /**
     * Hashes a token using SHA-256 and encodes the result in Base64.
     *
     * @param token the raw token string
     * @return the hashed token string
     * @throws RuntimeException if hashing fails
     */
    public static String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashedBytes = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hashedBytes);
        } catch (Exception e) {
            throw new RuntimeException("Failed to hash token", e);
        }
    }
}
