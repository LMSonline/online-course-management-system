package vn.uit.lms.shared.dto.request.student;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.uit.lms.shared.constant.Gender;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request to update student information")
public class UpdateStudentRequest {

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 255, message = "Full name must be between 2 and 255 characters")
    @Schema(description = "Student full name", example = "Nguyen Van A")
    private String fullName;

    @Past(message = "Birth date must be in the past")
    @Schema(description = "Student birth date", example = "2000-01-01")
    private LocalDate birthDate;

    @Schema(description = "Student gender", example = "MALE")
    private Gender gender;

    @Pattern(regexp = "^[0-9]{10,15}$", message = "Phone number must be 10-15 digits")
    @Schema(description = "Student phone number", example = "0123456789")
    private String phone;

    @Size(max = 1000, message = "Bio must not exceed 1000 characters")
    @Schema(description = "Student biography", example = "I am a student")
    private String bio;

    @Size(max = 50, message = "Student code must not exceed 50 characters")
    @Schema(description = "Student code", example = "SV2024001")
    private String studentCode;
}

