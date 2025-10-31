package vn.uit.lms.shared.dto.request.account;

import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import vn.uit.lms.shared.constant.Gender;

import java.time.LocalDate;

@Data
public class UpdateProfileRequest {

    @Size(max = 255, message = "Full name must not exceed 255 characters")
    private String fullName;

    @Past(message = "Date of birth must be a past date")
    private LocalDate birthDate;

    @Pattern(
            regexp = "^(\\+84|0)[1-9][0-9]{8,9}$",
            message = "Invalid phone number (e.g. 090xxxxxxx or +8490xxxxxxx)"
    )
    private String phone;

    @Size(max = 2000, message = "Bio must not exceed 2000 characters")
    private String bio;

    private Gender gender;

    @Size(max = 255, message = "Specialty must not exceed 255 characters")
    private String specialty;

    @Size(max = 128, message = "Degree must not exceed 128 characters")
    private String degree;
}