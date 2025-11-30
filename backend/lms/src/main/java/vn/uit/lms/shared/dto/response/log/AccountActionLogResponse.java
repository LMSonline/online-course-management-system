package vn.uit.lms.shared.dto.response.log;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;
import vn.uit.lms.shared.constant.AccountActionType;

import java.time.Instant;

@Data
@Builder
@Schema(description = "Response DTO for account action log")
public class AccountActionLogResponse {
    @Schema(description = "Log ID", example = "1")
    private Long id;

    @Schema(description = "Type of action performed", example = "ACCOUNT_APPROVED")
    private AccountActionType actionType;

    @Schema(description = "Reason for the action", example = "Documents verified successfully")
    private String reason;

    @Schema(description = "Previous account status", example = "PENDING")
    private String oldStatus;

    @Schema(description = "New account status", example = "ACTIVE")
    private String newStatus;

    @Schema(description = "Creation timestamp", example = "2025-11-30T10:15:30Z")
    private Instant createdAt;

    @Schema(description = "Last update timestamp", example = "2025-11-30T10:15:30Z")
    private Instant updatedAt;

    @Schema(description = "Username who performed the action", example = "admin_user")
    private String performedByUsername;

    @Schema(description = "IP address of the action performer", example = "192.168.1.1")
    private String ipAddress;

}
