package vn.uit.lms.shared.constant;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Gender options for user profiles
 */
@Schema(description = "Gender values")
public enum Gender {
    @Schema(description = "Male")
    MALE,

    @Schema(description = "Female")
    FEMALE,

    @Schema(description = "Other or prefer not to say")
    OTHER
}
