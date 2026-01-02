package vn.uit.lms.shared.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.MappedSuperclass;
import lombok.Builder;
import lombok.Data;
import vn.uit.lms.shared.constant.Gender;
import vn.uit.lms.shared.exception.InvalidFileException;

import java.time.LocalDate;

/**
 * PersonBase with Rich Domain Model - encapsulates common person profile logic
 */
@Data
@MappedSuperclass
public abstract class PersonBase extends BaseEntity {

    @Column(name = "full_name", nullable = false, length = 255)
    private String fullName;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(length = 30)
    private String phone;

    @Column(columnDefinition = "TEXT")
    private String bio;


    /**
     * Update profile information with validation
     */
    public void updateProfile(String fullName, String bio, Gender gender, LocalDate birthDate, String phone) {
        if (fullName == null || fullName.isBlank()) {
            throw new InvalidFileException("Full name cannot be empty");
        }
        this.fullName = fullName;
        this.bio = bio;
        this.gender = gender;
        this.birthDate = birthDate;
        this.phone = phone;
    }

    /**
     * Check if profile is complete
     */
    public boolean isProfileComplete() {
        return fullName != null && !fullName.isBlank() && gender != null;
    }

}
