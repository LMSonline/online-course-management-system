package vn.uit.lms.shared.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request DTO for forgot password functionality")
public class ForgotPasswordDTO {

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Schema(
            description = "Email address of the user who forgot password",
            example = "user@example.com",
            requiredMode = Schema.RequiredMode.REQUIRED,
            format = "email"
    )
    private String email;
}
