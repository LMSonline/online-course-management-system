package vn.uit.lms.shared.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for login request.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request DTO for user login")
public class ReqLoginDTO {

    /** Username or email of the user. */
    @NotBlank(message = "Login is required")
    @Schema(
        description = "Username or email of the user",
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
