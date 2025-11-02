package vn.uit.lms.shared.dto.response.account;

import com.fasterxml.jackson.annotation.JsonView;
import lombok.*;
import vn.uit.lms.shared.constant.*;
import vn.uit.lms.shared.view.Views;

import java.time.Instant;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountProfileResponse {

    @JsonView(Views.Public.class)
    private Long accountId;

    @JsonView(Views.Public.class)
    private String username;

    @JsonView(Views.Public.class)
    private String email;

    @JsonView(Views.Public.class)
    private Instant lastLoginAt;

    @JsonView(Views.Public.class)
    private Role role;

    @JsonView(Views.Public.class)
    private AccountStatus status;

    @JsonView(Views.Public.class)
    private String avatarUrl;

    @JsonView(Views.Public.class)
    private Profile profile;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Profile {

        // Student-only
        @JsonView(Views.Student.class)
        private String studentCode;

        // Teacher-only
        @JsonView(Views.Teacher.class)
        private String teacherCode;

        @JsonView(Views.Public.class)
        private String fullName;

        @JsonView(Views.Public.class)
        private String phone;

        @JsonView(Views.Public.class)
        private LocalDate birthDate;

        @JsonView(Views.Public.class)
        private String bio;

        @JsonView(Views.Public.class)
        private Gender gender;

        // Teacher-only
        @JsonView(Views.Teacher.class)
        private String specialty;

        @JsonView(Views.Teacher.class)
        private String degree;

        @JsonView(Views.Teacher.class)
        private Boolean approved;

        @JsonView(Views.Teacher.class)
        private Long approvedBy;

        @JsonView(Views.Teacher.class)
        private Instant approvedAt;

        @JsonView(Views.Teacher.class)
        private String rejectionReason;

        @JsonView(Views.Public.class)
        private Instant createdAt;

        @JsonView(Views.Public.class)
        private Instant updatedAt;


    }
}
