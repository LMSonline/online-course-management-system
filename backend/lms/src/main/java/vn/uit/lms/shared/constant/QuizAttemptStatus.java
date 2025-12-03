package vn.uit.lms.shared.constant;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Status of a quiz attempt
 */
@Schema(description = "Quiz attempt status")
public enum QuizAttemptStatus {
    @Schema(description = "Quiz attempt in progress")
    IN_PROGRESS,

    @Schema(description = "Quiz attempt completed")
    COMPLETED,

    @Schema(description = "Quiz attempt cancelled")
    CANCELLED
}
