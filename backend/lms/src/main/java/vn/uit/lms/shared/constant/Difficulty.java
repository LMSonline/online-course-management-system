package vn.uit.lms.shared.constant;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Difficulty levels for courses
 */
@Schema(description = "Course difficulty levels")
public enum Difficulty {
    @Schema(description = "Beginner level - No prerequisites required")
    BEGINNER,

    @Schema(description = "Intermediate level - Some knowledge required")
    INTERMEDIATE,

    @Schema(description = "Advanced level - Strong background required")
    ADVANCED
}

