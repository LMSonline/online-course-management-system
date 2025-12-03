package vn.uit.lms.shared.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request DTO for changing user password")
public class ChangePasswordDTO {

    @NotBlank(message = "Old password is required")
    @Schema(
            description = "Current password of the user",
            example = "OldPassword123!",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String oldPassword;

    @NotBlank(message = "New password is required")
    @Schema(
            description = "New password to be set",
            example = "NewPassword456!",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String newPassword;
}
