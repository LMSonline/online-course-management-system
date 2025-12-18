package vn.uit.lms.shared.dto.response.admin;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.uit.lms.shared.constant.AccountStatus;
import vn.uit.lms.shared.constant.Role;

import java.time.Instant;

/**
 * Simplified user list item for admin panel
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "User list item for admin panel")
public class AdminUserListResponse {

    @Schema(description = "Account ID", example = "123")
    private Long accountId;

    @Schema(description = "Username", example = "john_doe")
    private String username;

    @Schema(description = "Email address", example = "john.doe@example.com")
    private String email;

    @Schema(description = "Full name", example = "John Doe")
    private String fullName;

    @Schema(description = "User role", example = "TEACHER")
    private Role role;

    @Schema(description = "Account status", example = "ACTIVE")
    private AccountStatus status;

    @Schema(description = "Avatar URL")
    private String avatarUrl;

    @Schema(description = "Teacher code (if teacher)", example = "GV2024001")
    private String teacherCode;

    @Schema(description = "Student code (if student)", example = "SV2024001")
    private String studentCode;

    @Schema(description = "Teacher approval status (if teacher)", example = "true")
    private Boolean teacherApproved;

    @Schema(description = "Last login timestamp")
    private Instant lastLoginAt;

    @Schema(description = "Account creation timestamp")
    private Instant createdAt;

    @Schema(description = "Days since last login", example = "3")
    private Long daysSinceLastLogin;

    @Schema(description = "Account age in days", example = "120")
    private Long accountAgeDays;
}

