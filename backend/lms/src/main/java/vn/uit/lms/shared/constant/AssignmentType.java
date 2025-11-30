package vn.uit.lms.shared.constant;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Types of assignments in the LMS
 */
@Schema(description = "Types of assignments")
public enum AssignmentType {
    @Schema(description = "Practice assignment")
    PRACTICE,

    @Schema(description = "Homework assignment")
    HOMEWORK,

    @Schema(description = "Project assignment")
    PROJECT,

    @Schema(description = "Final report assignment")
    FINAL_REPORT
}
