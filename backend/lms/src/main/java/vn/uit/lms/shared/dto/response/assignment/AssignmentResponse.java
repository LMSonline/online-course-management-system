package vn.uit.lms.shared.dto.response.assignment;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;
import vn.uit.lms.shared.constant.AssignmentType;

import java.time.Instant;

@Data
@Builder
@Schema(description = "Response DTO for assignment details")
public class AssignmentResponse {
    @Schema(description = "Assignment ID", example = "1")
    private Long id;

    @Schema(description = "ID of the lesson this assignment belongs to", example = "5")
    private Long lessonId;

    @Schema(description = "Type of assignment", example = "HOMEWORK")
    private AssignmentType assignmentType;

    @Schema(description = "Assignment title", example = "Week 1 Programming Assignment")
    private String title;

    @Schema(description = "Assignment description/instructions", example = "Complete the Java exercises in chapter 3")
    private String description;

    @Schema(description = "Total points for the assignment", example = "100")
    private Integer totalPoints;

    @Schema(description = "Time limit in minutes (if applicable)", example = "120")
    private Integer timeLimitMinutes;

    @Schema(description = "Maximum number of submission attempts", example = "3")
    private Integer maxAttempts;

    @Schema(description = "Creation timestamp", example = "2025-11-01T08:00:00Z")
    private Instant createdAt;

    @Schema(description = "Last update timestamp", example = "2025-11-20T14:30:00Z")
    private Instant updatedAt;
}
