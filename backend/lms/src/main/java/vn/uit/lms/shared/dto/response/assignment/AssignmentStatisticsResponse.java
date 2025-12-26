package vn.uit.lms.shared.dto.response.assignment;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@Schema(description = "Response DTO for assignment statistics (for teachers)")
public class AssignmentStatisticsResponse {
    @Schema(description = "Assignment ID", example = "1")
    private Long assignmentId;

    @Schema(description = "Assignment title", example = "Week 1 Programming Assignment")
    private String assignmentTitle;

    @Schema(description = "Total number of students enrolled", example = "50")
    private Integer totalStudents;

    @Schema(description = "Number of students who submitted", example = "45")
    private Integer submittedCount;

    @Schema(description = "Number of graded submissions", example = "40")
    private Integer gradedCount;

    @Schema(description = "Number of pending submissions", example = "5")
    private Integer pendingCount;

    @Schema(description = "Average score", example = "85.5")
    private Double averageScore;

    @Schema(description = "Highest score", example = "98.0")
    private Double highestScore;

    @Schema(description = "Lowest score", example = "62.0")
    private Double lowestScore;

    @Schema(description = "Submission rate percentage", example = "90.0")
    private Double submissionRate;
}
