package vn.uit.lms.shared.dto.request.account;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import vn.uit.lms.shared.constant.Gender;

import java.time.LocalDate;

@Data
@Schema(description = "Request DTO for updating user profile")
public class UpdateProfileRequest {

    @Size(max = 255, message = "Full name must not exceed 255 characters")
    @Schema(description = "Full name of the user", example = "John Doe", maxLength = 255)
    private String fullName;

    @Past(message = "Date of birth must be a past date")
    @Schema(description = "Date of birth", example = "1990-01-15", format = "date")
    private LocalDate birthDate;

    @Pattern(
            regexp = "^(\\+84|0)[1-9][0-9]{8,9}$",
            message = "Invalid phone number (e.g. 090xxxxxxx or +8490xxxxxxx)"
    )
    @Schema(description = "Phone number (Vietnamese format)", example = "0901234567")
    private String phone;

    @Size(max = 2000, message = "Bio must not exceed 2000 characters")
    @Schema(description = "Biography or description", example = "I am a software developer passionate about learning", maxLength = 2000)
    private String bio;

    @Schema(description = "Gender of the user", example = "MALE", allowableValues = {"MALE", "FEMALE", "OTHER"})
    private Gender gender;

    @Size(max = 255, message = "Specialty must not exceed 255 characters")
    @Schema(description = "Specialty or area of expertise (for instructors)", example = "Computer Science", maxLength = 255)
    private String specialty;

    @Size(max = 128, message = "Degree must not exceed 128 characters")
    @Schema(description = "Academic degree (for instructors)", example = "Ph.D. in Computer Science", maxLength = 128)
    private String degree;
}