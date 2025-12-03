package vn.uit.lms.shared.dto.request.account;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.uit.lms.shared.constant.AccountStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request DTO for updating account status")
public class UpdateStatusRequest {

    @NotNull(message = "Status must not be null")
    @Schema(
        description = "New account status",
        example = "ACTIVE",
        requiredMode = Schema.RequiredMode.REQUIRED,
        allowableValues = {"PENDING_EMAIL","PENDING_APPROVAL", "ACTIVE", "SUSPENDED", "REJECTED", "DEACTIVATED"}
    )
    private AccountStatus status;

    @Schema(description = "Reason for status change", example = "Account verified successfully")
    private String reason;
}
