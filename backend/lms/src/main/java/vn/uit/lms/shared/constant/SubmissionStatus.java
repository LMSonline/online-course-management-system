package vn.uit.lms.shared.constant;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Status of assignment submissions
 */
@Schema(description = "Assignment submission status")
public enum SubmissionStatus {
    @Schema(description = "Submitted, waiting for grading")
    PENDING,

    @Schema(description = "Graded by instructor")
    GRADED,

    @Schema(description = "Rejected by instructor")
    REJECTED
}
