package vn.uit.lms.shared.dto.response.admin;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO containing user statistics
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "User statistics summary")
public class UserStatsResponse {

    @Schema(description = "Total number of users", example = "1500")
    private Long totalUsers;

    @Schema(description = "Number of active users", example = "1200")
    private Long activeUsers;

    @Schema(description = "Number of inactive users", example = "100")
    private Long inactiveUsers;

    @Schema(description = "Number of suspended users", example = "50")
    private Long suspendedUsers;

    @Schema(description = "Number of pending approval users", example = "150")
    private Long pendingApprovalUsers;

    @Schema(description = "Number of pending email verification users", example = "20")
    private Long pendingEmailUsers;

    @Schema(description = "Number of rejected users", example = "30")
    private Long rejectedUsers;

    @Schema(description = "Statistics by role")
    private RoleStats roleStats;

    @Schema(description = "Statistics by registration period")
    private RegistrationStats registrationStats;

    @Schema(description = "Statistics by activity")
    private ActivityStats activityStats;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @Schema(description = "User count breakdown by role")
    public static class RoleStats {
        @Schema(description = "Number of students", example = "1000")
        private Long students;

        @Schema(description = "Number of teachers", example = "200")
        private Long teachers;

        @Schema(description = "Number of admins", example = "5")
        private Long admins;

        @Schema(description = "Number of approved teachers", example = "150")
        private Long approvedTeachers;

        @Schema(description = "Number of pending teacher approvals", example = "50")
        private Long pendingTeachers;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @Schema(description = "Registration statistics over time")
    public static class RegistrationStats {
        @Schema(description = "New users registered today", example = "5")
        private Long today;

        @Schema(description = "New users registered this week", example = "25")
        private Long thisWeek;

        @Schema(description = "New users registered this month", example = "150")
        private Long thisMonth;

        @Schema(description = "New users registered this year", example = "1000")
        private Long thisYear;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @Schema(description = "User activity statistics")
    public static class ActivityStats {
        @Schema(description = "Users who logged in today", example = "300")
        private Long activeToday;

        @Schema(description = "Users who logged in this week", example = "800")
        private Long activeThisWeek;

        @Schema(description = "Users who logged in this month", example = "1100")
        private Long activeThisMonth;

        @Schema(description = "Users who never logged in", example = "50")
        private Long neverLoggedIn;

        @Schema(description = "Users inactive for 30+ days", example = "200")
        private Long inactiveFor30Days;

        @Schema(description = "Users inactive for 90+ days", example = "100")
        private Long inactiveFor90Days;
    }
}

