package vn.uit.lms.shared.dto.request.admin;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.uit.lms.shared.constant.AccountStatus;
import vn.uit.lms.shared.constant.Role;

import java.time.Instant;

/**
 * Request DTO for filtering users in admin panel
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Request DTO for filtering users with various criteria")
public class UserFilterRequest {

    @Schema(description = "Search keyword (username, email, full name)", example = "john")
    private String keyword;

    @Schema(description = "Filter by user role", example = "TEACHER")
    private Role role;

    @Schema(description = "Filter by account status", example = "ACTIVE")
    private AccountStatus status;

    @Schema(description = "Filter by created date from", example = "2024-01-01T00:00:00Z")
    private Instant createdFrom;

    @Schema(description = "Filter by created date to", example = "2024-12-31T23:59:59Z")
    private Instant createdTo;

    @Schema(description = "Filter by last login date from", example = "2024-11-01T00:00:00Z")
    private Instant lastLoginFrom;

    @Schema(description = "Filter by last login date to", example = "2024-12-31T23:59:59Z")
    private Instant lastLoginTo;

    @Schema(description = "Filter teachers by approval status", example = "true")
    private Boolean teacherApproved;

    @Schema(description = "Show only accounts with avatar", example = "false")
    private Boolean hasAvatar;

    @Schema(description = "Sort field", example = "createdAt", allowableValues = {"createdAt", "lastLoginAt", "username", "email"})
    private String sortBy;

    @Schema(description = "Sort direction", example = "DESC", allowableValues = {"ASC", "DESC"})
    private String sortDirection;
}

