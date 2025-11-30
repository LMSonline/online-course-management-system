package vn.uit.lms.shared.constant;

import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * User roles in the LMS system
 */
@Schema(description = "User roles")
public enum Role {
    @Schema(description = "Student role - Can enroll in courses and submit assignments")
    STUDENT,

    @Schema(description = "Teacher/Instructor role - Can create and manage courses")
    TEACHER,

    @Schema(description = "Administrator role - Full system access")
    ADMIN;

    /**
     * Create Role from string value (case-insensitive)
     * @param value Role name as string
     * @return Role enum
     * @throws IllegalArgumentException if value is invalid
     */
    @JsonCreator
    public static Role fromString(String value) {
        for (Role role : Role.values()) {
            if (role.name().equalsIgnoreCase(value)) {
                return role;
            }
        }
        throw new IllegalArgumentException("Invalid role value: " + value);
    }
}
