package vn.uit.lms.shared.constant;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Types of tokens used in the system
 */
@Schema(description = "Token types")
public enum TokenType {
    @Schema(description = "Email verification token")
    VERIFY_EMAIL,

    @Schema(description = "Password reset token")
    RESET_PASSWORD
}
