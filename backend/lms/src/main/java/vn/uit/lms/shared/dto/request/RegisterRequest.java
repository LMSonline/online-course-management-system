package vn.uit.lms.shared.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.uit.lms.shared.constant.Role;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request DTO for user registration")
public class RegisterRequest {

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 30, message = "Username must be between 3 and 30 characters")
    @Pattern(
            regexp = "^[^@]+$",
            message = "Username cannot contain '@'"
    )
    @Schema(
        description = "Unique username for the user (cannot contain '@')",
        example = "john_doe",
        requiredMode = Schema.RequiredMode.REQUIRED,
        minLength = 3,
        maxLength = 30
    )
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Schema(
        description = "Email address of the user",
        example = "john.doe@example.com",
        requiredMode = Schema.RequiredMode.REQUIRED,
        format = "email"
    )
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 50, message = "Password must be at least 6 characters")
    @Schema(
        description = "Password for the account",
        example = "SecurePassword123!",
        requiredMode = Schema.RequiredMode.REQUIRED,
        format = "password",
        minLength = 6,
        maxLength = 50
    )
    private String password;

    @NotNull(message = "Role is required")
    @Schema(
        description = "Role of the user",
        example = "STUDENT",
        requiredMode = Schema.RequiredMode.REQUIRED,
        allowableValues = {"STUDENT", "INSTRUCTOR", "ADMIN"}
    )
    private Role role;

    @Schema(
        description = "Preferred language key",
        example = "en"
    )
    private String langKey;
}
