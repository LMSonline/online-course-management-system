package vn.uit.lms.shared.dto.request.auth;

import com.fasterxml.jackson.annotation.JsonAlias;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for login request.
 * 
 * Accepts multiple field names for flexibility:
 * - "login" (primary, recommended)
 * - "email" (alternative)
 * - "username" (alternative)
 * 
 * All map to the same internal "login" field.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request DTO for user login")
public class ReqLoginDTO {

    /** Username or email of the user. */
    @NotBlank(message = "Login identifier (login/email/username) is required")
    @JsonAlias({"login", "email", "username", "identifier"})
    @Schema(
        description = "Username or email of the user. Can be sent as 'login', 'email', or 'username'",
        example = "john_doe or john@example.com",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String login;

    /** User password. */
    @NotBlank(message = "Password is required")
    @Schema(
        description = "User password",
        example = "Password123!",
        requiredMode = Schema.RequiredMode.REQUIRED,
        format = "password"
    )
    private String password;

    //optional fields
    @Schema(description = "Device information", example = "Chrome 120.0 on Windows 10")
    private String deviceInfo;

    @Schema(description = "IP address of the client", example = "192.168.1.1")
    private String ipAddress;
}
