package vn.uit.lms.shared.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.uit.lms.shared.constant.AccountStatus;
import vn.uit.lms.shared.constant.Gender;
import vn.uit.lms.shared.constant.Role;

import java.time.Instant;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Response DTO for current user profile information")
public class MeResponse {

    @Schema(description = "Account ID", example = "123")
    private Long accountId;

    @Schema(description = "Username", example = "john_doe")
    private String username;

    @Schema(description = "Email address", example = "john.doe@example.com")
    private String email;

    @Schema(description = "Full name", example = "John Doe")
    private String fullName;

    @Schema(description = "Account status", example = "ACTIVE")
    private AccountStatus status;

    @Schema(description = "Avatar URL", example = "https://example.com/avatars/john.jpg")
    private String avatarUrl;

    @Schema(description = "User role", example = "STUDENT")
    private Role role;

    @Schema(description = "Birthday", example = "1990-01-15")
    private LocalDate birthday;

    @Schema(description = "Biography", example = "Software developer passionate about learning")
    private String bio;

    @Schema(description = "Gender", example = "MALE")
    private Gender gender;

    @Schema(description = "Last login timestamp", example = "2025-11-30T10:15:30Z")
    private Instant lastLoginAt;
}
