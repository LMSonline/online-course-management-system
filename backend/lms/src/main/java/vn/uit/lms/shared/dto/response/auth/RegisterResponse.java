package vn.uit.lms.shared.dto.response.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.uit.lms.shared.constant.AccountStatus;
import vn.uit.lms.shared.constant.Role;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Schema(description = "Response DTO for user registration")
public class RegisterResponse {
    @Schema(description = "Account ID", example = "123")
    private Long id;

    @Schema(description = "Username", example = "john_doe")
    private String username;

    @Schema(description = "Email address", example = "john.doe@example.com")
    private String email;

    @Schema(description = "User role", example = "STUDENT")
    private Role role;

    @Schema(description = "Account status", example = "PENDING")
    private AccountStatus status;

    @Schema(description = "Avatar URL", example = "https://example.com/avatars/default.jpg")
    private String avatarUrl;

    @Schema(description = "Account creation timestamp", example = "2025-11-30T10:15:30Z")
    private Instant createdAt;

    @Schema(description = "Language preference", example = "en")
    private String langKey;
}
