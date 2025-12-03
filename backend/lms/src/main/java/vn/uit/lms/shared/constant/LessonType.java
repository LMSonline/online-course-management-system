package vn.uit.lms.shared.constant;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Types of lessons in a course
 */
@Schema(description = "Types of lessons")
public enum LessonType {
    @Schema(description = "Video lesson")
    VIDEO,

    @Schema(description = "Document/reading material")
    DOCUMENT,

    @Schema(description = "Assignment lesson")
    ASSIGNMENT,

    @Schema(description = "Quiz lesson")
    QUIZ,

    @Schema(description = "Final exam")
    FINAL_EXAM
}