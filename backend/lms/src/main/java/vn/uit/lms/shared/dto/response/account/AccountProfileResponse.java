package vn.uit.lms.shared.dto.response.account;

import com.fasterxml.jackson.annotation.JsonView;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import vn.uit.lms.shared.constant.*;
import vn.uit.lms.shared.view.Views;

import java.time.Instant;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Response DTO for detailed account profile")
public class AccountProfileResponse {

    @JsonView(Views.Public.class)
    @Schema(description = "Account ID", example = "123")
    private Long accountId;

    @JsonView(Views.Public.class)
    @Schema(description = "Username", example = "john_doe")
    private String username;

    @JsonView(Views.Public.class)
    @Schema(description = "Email address", example = "john.doe@example.com")
    private String email;

    @JsonView(Views.Public.class)
    @Schema(description = "Last login timestamp", example = "2025-11-30T10:15:30Z")
    private Instant lastLoginAt;

    @JsonView(Views.Public.class)
    @Schema(description = "User role", example = "STUDENT")
    private Role role;

    @JsonView(Views.Public.class)
    @Schema(description = "Account status", example = "ACTIVE")
    private AccountStatus status;

    @JsonView(Views.Public.class)
    @Schema(description = "Avatar URL", example = "https://example.com/avatars/john.jpg")
    private String avatarUrl;

    @JsonView(Views.Public.class)
    @Schema(description = "Profile details")
    private Profile profile;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @Schema(description = "Profile information")
    public static class Profile {

        @JsonView(Views.Student.class)
        @Schema(description = "Student ID", example = "456")
        private Long studentId;

        @JsonView(Views.Teacher.class)
        @Schema(description = "Teacher ID", example = "789")
        private Long teacherId;

        @JsonView(Views.Student.class)
        @Schema(description = "Student code", example = "ST2024001")
        private String studentCode;

        @JsonView(Views.Teacher.class)
        @Schema(description = "Teacher code", example = "TC2024001")
        private String teacherCode;

        @JsonView(Views.Public.class)
        @Schema(description = "Full name", example = "John Doe")
        private String fullName;

        @JsonView(Views.Public.class)
        @Schema(description = "Phone number", example = "0901234567")
        private String phone;

        @JsonView(Views.Public.class)
        @Schema(description = "Birth date", example = "1990-01-15")
        private LocalDate birthDate;

        @JsonView(Views.Public.class)
        @Schema(description = "Biography", example = "Passionate educator")
        private String bio;

        @JsonView(Views.Public.class)
        @Schema(description = "Gender", example = "MALE")
        private Gender gender;

        @JsonView(Views.Teacher.class)
        @Schema(description = "Specialty/field of expertise", example = "Computer Science")
        private String specialty;

        @JsonView(Views.Teacher.class)
        @Schema(description = "Academic degree", example = "Ph.D.")
        private String degree;

        @JsonView(Views.Teacher.class)
        @Schema(description = "Whether teacher is approved", example = "true")
        private Boolean approved;

        @JsonView(Views.Teacher.class)
        @Schema(description = "ID of admin who approved", example = "10")
        private Long approvedBy;

        @JsonView(Views.Teacher.class)
        @Schema(description = "Approval timestamp", example = "2025-11-15T10:00:00Z")
        private Instant approvedAt;

        @JsonView(Views.Teacher.class)
        @Schema(description = "Reason for rejection (if rejected)", example = "Incomplete documents")
        private String rejectionReason;

        @JsonView(Views.Admin.class)
        @Schema(description = "Profile creation timestamp", example = "2025-11-01T08:00:00Z")
        private Instant createdAt;

        @JsonView(Views.Admin.class)
        @Schema(description = "Profile last update timestamp", example = "2025-11-20T14:30:00Z")
        private Instant updatedAt;
    }
}
