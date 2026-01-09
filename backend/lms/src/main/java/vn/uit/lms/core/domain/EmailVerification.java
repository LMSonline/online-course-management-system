package vn.uit.lms.core.domain;

import jakarta.persistence.*;
import lombok.*;
import vn.uit.lms.shared.constant.TokenType;
import vn.uit.lms.shared.entity.BaseEntity;
import vn.uit.lms.shared.exception.InvalidTokenException;

import java.time.Instant;

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


    /**
     * Check if token is expired
     */
    public boolean isExpired() {
        return this.expiresAt.isBefore(Instant.now());
    }

    /**
     * Validate token can be used
     */
    public void validateForUse() {
        if (this.isUsed) {
            throw new InvalidTokenException("Token has already been used.");
        }

        if (isExpired()) {
            throw new InvalidTokenException("Token has expired.");
        }
    }

    /**
     * Validate token type matches expected type
     */
    public void validateTokenType(TokenType expectedType) {
        if (this.tokenType != expectedType) {
            throw new InvalidTokenException("Invalid token type.");
        }
    }

    /**
     * Mark token as used
     */
    public void markAsUsed() {
        validateForUse();
        this.isUsed = true;
    }

    /**
     * Check if token can be used for password reset
     */
    public boolean isPasswordResetToken() {
        return this.tokenType == TokenType.RESET_PASSWORD;
    }

    /**
     * Check if token can be used for email verification
     */
    public boolean isEmailVerificationToken() {
        return this.tokenType == TokenType.VERIFY_EMAIL;
    }

}

