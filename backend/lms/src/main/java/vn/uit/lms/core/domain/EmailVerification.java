package vn.uit.lms.core.domain;

import jakarta.persistence.*;
import lombok.*;
import vn.uit.lms.shared.constant.TokenType;
import vn.uit.lms.shared.entity.BaseEntity;
import vn.uit.lms.shared.exception.InvalidTokenException;
import vn.uit.lms.shared.util.TokenHashUtil;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Entity
@Table(name = "email_verification")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailVerification extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @Column(nullable = false, name = "token_hash")
    private String tokenHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "token_type", length = 30, nullable = false)
    @Builder.Default
    private TokenType tokenType = TokenType.VERIFY_EMAIL;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "is_used", nullable = false)
    @Builder.Default
    private boolean isUsed = false;


    @Transient
    private String plainToken;

    /**
     * Factory method to generate a new email verification token.
     *
     * @param account the account for which to generate the verification
     * @param tokenType the type of verification token (VERIFY_EMAIL, RESET_PASSWORD, etc.)
     * @param expirationMinutes the expiration time in minutes
     * @return a new EmailVerification instance with the plain token set
     */
    public static EmailVerification generate(Account account, TokenType tokenType, long expirationMinutes) {
        if (account == null) {
            throw new IllegalArgumentException("Account cannot be null");
        }
        if (tokenType == null) {
            throw new IllegalArgumentException("Token type cannot be null");
        }
        if (expirationMinutes <= 0) {
            throw new IllegalArgumentException("Expiration minutes must be positive");
        }

        String plainToken = UUID.randomUUID().toString();
        String hashedToken = TokenHashUtil.hashToken(plainToken);
        Instant expiresAt = Instant.now().plus(expirationMinutes, ChronoUnit.MINUTES);

        EmailVerification verification = EmailVerification.builder()
                .account(account)
                .tokenHash(hashedToken)
                .tokenType(tokenType)
                .expiresAt(expiresAt)
                .isUsed(false)
                .build();

        // Store plain token temporarily for return to caller
        verification.plainToken = plainToken;

        return verification;
    }

    /**
     * Factory method with default 30-minute expiration.
     *
     * @param account the account for which to generate the verification
     * @param tokenType the type of verification token
     * @return a new EmailVerification instance
     */
    public static EmailVerification generate(Account account, TokenType tokenType) {
        return generate(account, tokenType, 30);
    }

    /**
     * Validates if this token matches the provided plain token string.
     *
     * @param plainToken the plain token to validate against
     * @return true if the token matches and is valid, false otherwise
     */
    public boolean isValid(String plainToken) {
        if (plainToken == null || plainToken.isBlank()) {
            return false;
        }

        String hashedInput = TokenHashUtil.hashToken(plainToken);

        return this.tokenHash.equals(hashedInput)
                && !this.isUsed
                && !this.isExpired();
    }

    /**
     * Validates the token for use and throws exceptions if invalid.
     * This is a stricter validation that throws exceptions instead of returning boolean.
     *
     * @throws InvalidTokenException if token is already used or expired
     */
    public void validateForUse() {
        if (this.isUsed) {
            throw new InvalidTokenException("Token has already been used.");
        }
        if (this.isExpired()) {
            throw new InvalidTokenException("Token has expired.");
        }
    }

    /**
     * Validates that this token is of the expected type.
     *
     * @param expectedType the expected token type
     * @throws InvalidTokenException if token type doesn't match
     */
    public void validateTokenType(TokenType expectedType) {
        if (this.tokenType != expectedType) {
            throw new InvalidTokenException(
                    String.format("Invalid token type. Expected %s but got %s",
                            expectedType, this.tokenType)
            );
        }
    }

    /**
     * Consumes (marks as used) this verification token.
     * Should be called after successful verification action.
     *
     * @throws InvalidTokenException if token is already used or expired
     */
    public void consume() {
        validateForUse();
        this.isUsed = true;
    }

    /**
     * Marks the token as used without validation.
     * Use this when you want to mark a token as used regardless of its state.
     */
    public void markAsUsed() {
        this.isUsed = true;
    }

    /**
     * Expires this token by setting its expiration time to the past.
     * This effectively invalidates the token without marking it as used.
     */
    public void expire() {
        this.expiresAt = Instant.now().minus(1, ChronoUnit.SECONDS);
    }

    /**
     * Checks if this token has expired.
     *
     * @return true if the token is expired, false otherwise
     */
    public boolean isExpired() {
        return this.expiresAt.isBefore(Instant.now());
    }

    /**
     * Checks if this token is still active (not used and not expired).
     *
     * @return true if the token is active, false otherwise
     */
    public boolean isActive() {
        return !this.isUsed && !this.isExpired();
    }


    /**
     * Checks if this token belongs to the specified account.
     *
     * @param account the account to check
     * @return true if the token belongs to the account, false otherwise
     */
    public boolean belongsTo(Account account) {
        return this.account != null && this.account.equals(account);
    }

    /**
     * Gets the number of minutes until this token expires.
     *
     * @return minutes until expiration (negative if already expired)
     */
    public long getMinutesUntilExpiration() {
        return ChronoUnit.MINUTES.between(Instant.now(), this.expiresAt);
    }

}

