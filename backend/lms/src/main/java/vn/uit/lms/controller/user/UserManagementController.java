package vn.uit.lms.controller.user;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.admin.UserManagementService;
import vn.uit.lms.shared.dto.PageResponse;
import vn.uit.lms.shared.dto.request.admin.ExportUsersRequest;
import vn.uit.lms.shared.dto.request.admin.UserFilterRequest;
import vn.uit.lms.shared.dto.response.admin.AdminUserListResponse;
import vn.uit.lms.shared.dto.response.admin.UserStatsResponse;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.util.annotation.AdminOnly;
import vn.uit.lms.shared.util.annotation.ApiMessage;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/admin/users")
@Tag(name = "User Management (Admin)", description = "Admin APIs for managing and monitoring all users in the system")
@SecurityRequirement(name = "bearerAuth")
@AdminOnly
@RequiredArgsConstructor
@Slf4j
public class UserManagementController {

    private final UserManagementService userManagementService;


    @Operation(
            summary = "Get all users (Admin only)",
            description = "Retrieve a paginated list of all users with advanced filtering capabilities."
    )
    @GetMapping
    @ApiMessage("Get all users")
    public ResponseEntity<PageResponse<AdminUserListResponse>> getAllUsers(
            @Parameter(description = "Search keyword (username, email, full name)", example = "john")
            @RequestParam(required = false) String keyword,

            @Parameter(description = "Filter by user role", example = "TEACHER")
            @RequestParam(required = false) String role,

            @Parameter(description = "Filter by account status", example = "ACTIVE")
            @RequestParam(required = false) String status,

            @Parameter(description = "Filter teachers by approval status", example = "true")
            @RequestParam(required = false) Boolean teacherApproved,

            @Parameter(description = "Page number (0-indexed)", example = "0")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Page size (max 100)", example = "20")
            @RequestParam(defaultValue = "20") int size,

            @Parameter(description = "Sort field", example = "createdAt")
            @RequestParam(defaultValue = "createdAt") String sortBy,

            @Parameter(description = "Sort direction (ASC/DESC)", example = "DESC")
            @RequestParam(defaultValue = "DESC") String sortDirection
    ) {
        log.info("GET /api/v1/admin/users - keyword={}, role={}, status={}, page={}, size={}",
                keyword, role, status, page, size);

        // Validate preconditions
        validatePaginationParams(page, size);
        validateSortParams(sortBy, sortDirection);

        // Build filter request
        UserFilterRequest filter = UserFilterRequest.builder()
                .keyword(keyword)
                .role(role != null ? vn.uit.lms.shared.constant.Role.fromString(role) : null)
                .status(status != null ? vn.uit.lms.shared.constant.AccountStatus.valueOf(status) : null)
                .teacherApproved(teacherApproved)
                .sortBy(sortBy)
                .sortDirection(sortDirection)
                .build();

        // Create pageable with sorting
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        // Fetch users
        PageResponse<AdminUserListResponse> response = userManagementService.getAllUsers(filter, pageable);

        log.info("Retrieved {} users, total: {}", response.getItems().size(), response.getTotalItems());
        return ResponseEntity.ok(response);
    }


    @Operation(
            summary = "Get user statistics (Admin only)",
            description = "Retrieve comprehensive statistics about all users in the system."

    )
    @GetMapping("/stats")
    @ApiMessage("Get user statistics")
    public ResponseEntity<UserStatsResponse> getUserStats() {
        log.info("GET /api/v1/admin/users/stats");

        UserStatsResponse stats = userManagementService.getUserStats();

        log.info("User stats calculated: total={}, active={}, teachers={}, students={}",
                stats.getTotalUsers(), stats.getActiveUsers(),
                stats.getRoleStats().getTeachers(), stats.getRoleStats().getStudents());

        return ResponseEntity.ok(stats);
    }

    @Operation(
            summary = "Export users to file (Admin only)",
            description = "Export user data to CSV or Excel format with customizable filters."
    )
    @PostMapping("/export")
    @ApiMessage("Export users")
    public void exportUsers(
            @Parameter(description = "Export configuration", required = true)
            @Valid @RequestBody ExportUsersRequest request,
            HttpServletResponse response
    ) throws IOException {
        log.info("POST /api/v1/admin/users/export - format={}", request.getFormat());

        // Validate preconditions
        if (request.getFormat() == null) {
            throw new InvalidRequestException("Export format is required");
        }

        // Execute export
        userManagementService.exportUsers(request, response);

        log.info("User export completed successfully");
    }

    /**
     * Validate pagination parameters
     */
    private void validatePaginationParams(int page, int size) {
        if (page < 0) {
            throw new InvalidRequestException("Page number must be non-negative");
        }
        if (size < 1) {
            throw new InvalidRequestException("Page size must be at least 1");
        }
        if (size > 100) {
            throw new InvalidRequestException("Page size cannot exceed 100");
        }
    }

    /**
     * Validate sort parameters
     */
    private void validateSortParams(String sortBy, String sortDirection) {
        // Validate sortBy field
        if (!isValidSortField(sortBy)) {
            throw new InvalidRequestException("Invalid sort field: " + sortBy +
                    ". Allowed values: createdAt, lastLoginAt, username, email");
        }

        // Validate sortDirection
        if (!sortDirection.equalsIgnoreCase("ASC") && !sortDirection.equalsIgnoreCase("DESC")) {
            throw new InvalidRequestException("Invalid sort direction: " + sortDirection +
                    ". Allowed values: ASC, DESC");
        }
    }

    /**
     * Check if sort field is valid
     */
    private boolean isValidSortField(String field) {
        return field.equals("createdAt") ||
               field.equals("lastLoginAt") ||
               field.equals("username") ||
               field.equals("email");
    }
}
