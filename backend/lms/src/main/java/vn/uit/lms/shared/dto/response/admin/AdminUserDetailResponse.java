package vn.uit.lms.shared.dto.response.admin;

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

/**
 * Admin view of user details - includes sensitive information
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Detailed user information for admin view")
public class AdminUserDetailResponse {

    @Schema(description = "Account ID", example = "123")
    private Long accountId;

    @Schema(description = "Username", example = "john_doe")
    private String username;

    @Schema(description = "Email address", example = "john.doe@example.com")
    private String email;

    @Schema(description = "User role", example = "TEACHER")
    private Role role;

    @Schema(description = "Account status", example = "ACTIVE")
    private AccountStatus status;

    @Schema(description = "Avatar URL")
    private String avatarUrl;

    @Schema(description = "Last login timestamp")
    private Instant lastLoginAt;

    @Schema(description = "Account creation timestamp")
    private Instant createdAt;

    @Schema(description = "Last update timestamp")
    private Instant updatedAt;

    @Schema(description = "Account deletion timestamp (soft delete)")
    private Instant deletedAt;

    @Schema(description = "Profile information")
    private ProfileInfo profile;

    @Schema(description = "Teacher-specific information (if role is TEACHER)")
    private TeacherInfo teacherInfo;

    @Schema(description = "Student-specific information (if role is STUDENT)")
    private StudentInfo studentInfo;

    @Schema(description = "Account statistics")
    private AccountStats stats;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @Schema(description = "User profile information")
    public static class ProfileInfo {
        @Schema(description = "Full name", example = "John Doe")
        private String fullName;

        @Schema(description = "Gender", example = "MALE")
        private Gender gender;

        @Schema(description = "Biography")
        private String bio;

        @Schema(description = "Birth date", example = "1990-05-15")
        private LocalDate birthDate;

        @Schema(description = "Phone number", example = "+84901234567")
        private String phone;

        @Schema(description = "Address")
        private String address;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @Schema(description = "Teacher-specific information")
    public static class TeacherInfo {
        @Schema(description = "Teacher ID", example = "456")
        private Long teacherId;

        @Schema(description = "Teacher code", example = "GV2024001")
        private String teacherCode;

        @Schema(description = "Specialty/expertise area", example = "Web Development")
        private String specialty;

        @Schema(description = "Academic degree", example = "Master of Computer Science")
        private String degree;

        @Schema(description = "Approval status", example = "true")
        private Boolean approved;

        @Schema(description = "Approved by admin ID", example = "1")
        private Long approvedBy;

        @Schema(description = "Approval timestamp")
        private Instant approvedAt;

        @Schema(description = "Rejection reason (if rejected)")
        private String rejectReason;

        @Schema(description = "Number of courses created", example = "15")
        private Long totalCourses;

        @Schema(description = "Number of published courses", example = "12")
        private Long publishedCourses;

        @Schema(description = "Total students enrolled in teacher's courses", example = "500")
        private Long totalStudents;

        @Schema(description = "Total revenue earned", example = "50000000")
        private Double totalRevenue;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @Schema(description = "Student-specific information")
    public static class StudentInfo {
        @Schema(description = "Student ID", example = "789")
        private Long studentId;

        @Schema(description = "Student code", example = "SV2024001")
        private String studentCode;

        @Schema(description = "Number of enrolled courses", example = "5")
        private Long enrolledCourses;

        @Schema(description = "Number of completed courses", example = "3")
        private Long completedCourses;

        @Schema(description = "Number of certificates earned", example = "3")
        private Long certificates;

        @Schema(description = "Total learning hours", example = "150.5")
        private Double totalLearningHours;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @Schema(description = "Account activity statistics")
    public static class AccountStats {
        @Schema(description = "Total login count", example = "250")
        private Long totalLogins;

        @Schema(description = "Failed login attempts", example = "5")
        private Long failedLoginAttempts;

        @Schema(description = "Last IP address used")
        private String lastIpAddress;

        @Schema(description = "Number of password resets", example = "2")
        private Long passwordResets;

        @Schema(description = "Account verification date")
        private Instant emailVerifiedAt;

        @Schema(description = "Days since last login", example = "3")
        private Long daysSinceLastLogin;

        @Schema(description = "Account age in days", example = "120")
        private Long accountAgeDays;
    }
}

