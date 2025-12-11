package vn.uit.lms.shared.dto.response.student;

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
@Schema(description = "Student information response")
public class StudentResponse {

    @Schema(description = "Student ID", example = "1")
    private Long id;

    @Schema(description = "Student code", example = "SV2024001")
    private String studentCode;

    @Schema(description = "Student full name", example = "Nguyen Van A")
    private String fullName;

    @Schema(description = "Student email", example = "student@example.com")
    private String email;

    @Schema(description = "Student phone", example = "0123456789")
    private String phone;

    @Schema(description = "Student birth date", example = "2000-01-01")
    private LocalDate birthDate;

    @Schema(description = "Student gender", example = "MALE")
    private Gender gender;

    @Schema(description = "Student biography")
    private String bio;

    @Schema(description = "Avatar URL")
    private String avatarUrl;

    @Schema(description = "Account status", example = "ACTIVE")
    private AccountStatus accountStatus;

    @Schema(description = "Creation timestamp")
    private Instant createdAt;

    @Schema(description = "Last update timestamp")
    private Instant updatedAt;
}

