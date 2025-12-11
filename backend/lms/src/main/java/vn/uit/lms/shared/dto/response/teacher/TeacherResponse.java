package vn.uit.lms.shared.dto.response.teacher;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.uit.lms.shared.constant.AccountStatus;
import vn.uit.lms.shared.constant.Gender;

import java.time.Instant;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Teacher basic information response")
public class TeacherResponse {

    @Schema(description = "Teacher ID", example = "1")
    private Long id;

    @Schema(description = "Teacher code", example = "GV2024001")
    private String teacherCode;

    @Schema(description = "Full name", example = "Nguyen Van A")
    private String fullName;

    @Schema(description = "Email address", example = "teacher@example.com")
    private String email;

    @Schema(description = "Phone number", example = "0901234567")
    private String phone;

    @Schema(description = "Birth date", example = "1990-01-01")
    private LocalDate birthDate;

    @Schema(description = "Gender", example = "MALE")
    private Gender gender;

    @Schema(description = "Biography")
    private String bio;

    @Schema(description = "Specialty/Expertise", example = "Software Engineering")
    private String specialty;

    @Schema(description = "Academic degree", example = "Master of Science")
    private String degree;

    @Schema(description = "Avatar URL")
    private String avatarUrl;

    @Schema(description = "Whether teacher is approved", example = "true")
    private boolean approved;

    @Schema(description = "Account status", example = "ACTIVE")
    private AccountStatus accountStatus;

    @Schema(description = "Created at timestamp")
    private Instant createdAt;

    @Schema(description = "Updated at timestamp")
    private Instant updatedAt;
}

