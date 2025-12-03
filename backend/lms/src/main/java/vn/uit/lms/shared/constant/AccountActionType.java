package vn.uit.lms.shared.constant;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Types of actions that can be performed on user accounts
 */
@Schema(description = "Types of account actions")
public enum AccountActionType {
    @Schema(description = "Approve a pending account")
    APPROVE,

    @Schema(description = "Reject an account application")
    REJECT,

    @Schema(description = "Suspend an active account")
    SUSPEND,

    @Schema(description = "Unlock a suspended account")
    UNLOCK,

    @Schema(description = "Deactivate an account")
    DEACTIVATE,

    @Schema(description = "Unknown action type")
    UNKNOWN
}
