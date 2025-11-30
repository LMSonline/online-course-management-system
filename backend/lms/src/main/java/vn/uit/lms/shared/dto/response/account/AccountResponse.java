package vn.uit.lms.shared.dto.response.account;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.uit.lms.shared.constant.AccountStatus;
import vn.uit.lms.shared.constant.Role;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Response DTO for account information")
public class AccountResponse {

    @Schema(description = "Account ID", example = "123")
    private Long accountId;

    @Schema(description = "Username", example = "john_doe")
    private String username;

    @Schema(description = "Email address", example = "john.doe@example.com")
    private String email;

    @Schema(description = "User role", example = "STUDENT")
    private Role role;

    @Schema(description = "Account status", example = "ACTIVE")
    private AccountStatus status;

    @Schema(description = "Avatar URL", example = "https://example.com/avatars/john.jpg")
    private String avatarUrl;

    @Schema(description = "Last login timestamp", example = "2025-11-30T10:15:30Z")
    private Instant lastLoginAt;

    @Schema(description = "Account creation timestamp", example = "2025-11-01T08:00:00Z")
    private Instant createdAt;

}
