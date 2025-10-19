package vn.uit.lms.shared.constant;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum Role {
    STUDENT, TEACHER, ADMIN;

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
