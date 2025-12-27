package vn.uit.lms.shared.dto.response.assignment;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.uit.lms.shared.constant.SubmissionStatus;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Response DTO for assignment submission details")
public class SubmissionResponse {

    @Schema(description = "Submission ID", example = "1")
    private Long id;

    @Schema(description = "Assignment ID", example = "5")
    private Long assignmentId;

    @Schema(description = "Student ID who submitted", example = "10")
    private Long studentId;

    @Schema(description = "Student full name", example = "John Doe")
    private String studentName;

    @Schema(description = "Submission timestamp", example = "2025-11-30T15:30:00Z")
    private Instant submittedAt;

    @Schema(description = "Submission text content", example = "Here is my solution to the assignment...")
    private String content;

    @Schema(description = "Score received (if graded)", example = "85.5")
    private Double score;

    @Schema(description = "ID of teacher who graded", example = "3")
    private Long gradedBy;

    @Schema(description = "Grading timestamp", example = "2025-12-01T10:00:00Z")
    private Instant gradedAt;

    @Schema(description = "Feedback from instructor", example = "Great work! Consider improving error handling.")
    private String feedback;

    @Schema(description = "Attempt number (1st, 2nd, 3rd...)", example = "1")
    private Integer attemptNumber;

    @Schema(description = "Submission status", example = "GRADED")
    private SubmissionStatus status;

    @Schema(description = "List of attached files")
    private List<SubmissionFileResponse> files;
}
