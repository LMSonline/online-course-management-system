package vn.uit.lms.shared.constant;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Status values for course versions
 */
@Schema(description = "Course version status")
public enum CourseStatus {
    @Schema(description = "Draft version, not ready for review")
    DRAFT,

    @Schema(description = "Pending admin approval")
    PENDING,

    @Schema(description = "Approved by admin, ready to publish")
    APPROVED,

    @Schema(description = "Rejected by admin")
    REJECTED,

    @Schema(description = "Published and available to students")
    PUBLISHED,

    @Schema(description = "Archived, no longer active")
    ARCHIVED
}

