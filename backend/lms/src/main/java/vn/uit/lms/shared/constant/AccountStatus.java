package vn.uit.lms.shared.constant;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Status of user accounts in the system
 */
@Schema(description = "Account status values")
public enum AccountStatus {
    @Schema(description = "Email verification pending")
    PENDING_EMAIL,

    @Schema(description = "Waiting for admin approval")
    PENDING_APPROVAL,

    @Schema(description = "Active account")
    ACTIVE,

    @Schema(description = "Application rejected")
    REJECTED,

    @Schema(description = "Account suspended by admin")
    SUSPENDED,

    DEACTIVATED
}
