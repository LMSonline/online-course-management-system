package vn.uit.lms.shared.dto.request.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request DTO for resetting password")
public class ResetPasswordDTO {

    @NotBlank(message = "New password is required")
    @Schema(
        description = "New password to be set",
        example = "NewSecurePassword123!",
        requiredMode = Schema.RequiredMode.REQUIRED,
        format = "password"
    )
    private String newPassword;

}
