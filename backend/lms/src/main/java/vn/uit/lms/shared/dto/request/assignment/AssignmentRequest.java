package vn.uit.lms.shared.dto.request.assignment;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import vn.uit.lms.shared.constant.AssignmentType;

import java.time.Instant;

@Data
@Schema(description = "Request DTO for creating or updating an assignment")
public class AssignmentRequest {
    @NotBlank(message = "Title is required")
    @Schema(
        description = "Assignment title",
        example = "Week 1 Programming Assignment",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String title;

    @Schema(
        description = "Type of assignment",
        example = "HOMEWORK",
        allowableValues = {"HOMEWORK", "PROJECT", "ESSAY", "QUIZ"}
    )
    private AssignmentType assignmentType;

    @Schema(description = "Assignment description/instructions", example = "Complete the Java exercises in chapter 3")
    private String description;

    @Schema(description = "Total points for the assignment", example = "100")
    private Integer totalPoints;

    @Schema(description = "Time limit in minutes (if applicable)", example = "120")
    private Integer timeLimitMinutes;

    @Schema(description = "Maximum number of submission attempts", example = "3")
    private Integer maxAttempts;

    @Schema(description = "Due date for the assignment", example = "2024-12-31T23:59:59Z")
    private Instant dueDate;
}
