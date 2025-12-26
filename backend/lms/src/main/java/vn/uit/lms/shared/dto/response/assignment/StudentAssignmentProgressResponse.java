package vn.uit.lms.shared.dto.response.assignment;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
@Schema(description = "Response DTO for student assignment progress")
public class StudentAssignmentProgressResponse {
    @Schema(description = "Assignment ID", example = "1")
    private Long assignmentId;

    @Schema(description = "Assignment title", example = "Week 1 Programming Assignment")
    private String assignmentTitle;

    @Schema(description = "Total points", example = "100")
    private Integer totalPoints;

    @Schema(description = "Due date", example = "2024-12-31T23:59:59Z")
    private Instant dueDate;

    @Schema(description = "Has submitted", example = "true")
    private Boolean hasSubmitted;

    @Schema(description = "Number of attempts", example = "2")
    private Integer attemptCount;

    @Schema(description = "Latest submission ID", example = "123")
    private Long latestSubmissionId;

    @Schema(description = "Latest submission status", example = "GRADED")
    private String latestSubmissionStatus;

    @Schema(description = "Latest score", example = "85.5")
    private Double latestScore;

    @Schema(description = "Best score across all attempts", example = "90.0")
    private Double bestScore;

    @Schema(description = "Whether passed (score >= 60%)", example = "true")
    private Boolean isPassing;
}
