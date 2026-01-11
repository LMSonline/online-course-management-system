package vn.uit.lms.core.domain;

import jakarta.persistence.*;
import lombok.*;
import vn.uit.lms.shared.entity.BaseEntity;
import vn.uit.lms.shared.exception.InvalidTokenException;
import vn.uit.lms.shared.util.TokenHashUtil;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Entity
@Table(name = "refresh_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshToken extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @Column(name = "token_hash", nullable = false, length = 512)
    private String tokenHash;

    @Column(name = "device_info", length = 255)
    private String deviceInfo;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(nullable = false)
    @Builder.Default
    private boolean revoked = false;

    public static RefreshToken issue(Account account, String tokenPlain, String device,
                                     String ipAddress, long expirationSeconds) {
        if (account == null) {
            throw new IllegalArgumentException("Account cannot be null");
        }
        if (tokenPlain == null || tokenPlain.isBlank()) {
            throw new IllegalArgumentException("Token cannot be null or empty");
        }

        String tokenHash = TokenHashUtil.hashToken(tokenPlain);
        Instant expiresAt = Instant.now().plus(expirationSeconds, ChronoUnit.SECONDS);

        return RefreshToken.builder()
                .account(account)
                .tokenHash(tokenHash)
                .deviceInfo(device != null ? device : "Unknown device")
                .ipAddress(ipAddress)
                .expiresAt(expiresAt)
                .revoked(false)
                .build();
    }

    /**
     * Validates the refresh token and throws an exception if invalid.
     *
     * @throws InvalidTokenException if the token is revoked or expired
     */
    public void validate() {
        if (this.revoked) {
            throw new InvalidTokenException("Refresh token revoked");
        }
        if (this.expiresAt.isBefore(Instant.now())) {
            throw new InvalidTokenException("Refresh token expired");
        }
    }

    /**
     * Revokes this refresh token, making it invalid for future use.
     */
    public void revoke() {
        if (!this.revoked) {
            this.revoked = true;
        }
    }

    /**
     * Rotates this refresh token by revoking it and creating a new one.
     * This implements the refresh token rotation pattern for security.
     *
     * @param newTokenPlain the new plain text refresh token
     * @param ipAddress the IP address for the new token
     * @param expirationSeconds the expiration time in seconds for the new token
     * @return a new RefreshToken instance
     */
    public RefreshToken rotate(String newTokenPlain, String ipAddress, long expirationSeconds) {
        // Validate current token before rotation
        this.validate();

        // Revoke current token
        this.revoke();

        // Issue new token with same account and device
        return RefreshToken.issue(
                this.account,
                newTokenPlain,
                this.deviceInfo,
                ipAddress,
                expirationSeconds
        );
    }

    /**
     * Checks if this token is expired.
     *
     * @return true if the token is expired, false otherwise
     */
    public boolean isExpired() {
        return this.expiresAt.isBefore(Instant.now());
    }

    /**
     * Checks if this token is active (not revoked and not expired).
     *
     * @return true if the token is active, false otherwise
     */
    public boolean isActive() {
        return !this.revoked && !this.isExpired();
    }

    /**
     * Checks if this token belongs to the specified device.
     *
     * @param device the device to check
     * @return true if the token belongs to the device, false otherwise
     */
    public boolean belongsToDevice(String device) {
        if (device == null || this.deviceInfo == null) {
            return false;
        }
        return this.deviceInfo.equals(device);
    }
}