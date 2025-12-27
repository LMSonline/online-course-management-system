package vn.uit.lms.shared.dto.response.assignment;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@Schema(description = "Response DTO for assignment eligibility check (for students)")
public class AssignmentEligibilityResponse {
    @Schema(description = "Assignment ID", example = "1")
    private Long assignmentId;

    @Schema(description = "Assignment title", example = "Week 1 Programming Assignment")
    private String assignmentTitle;

    @Schema(description = "Whether student can submit", example = "true")
    private Boolean canSubmit;

    @Schema(description = "Current attempt count", example = "1")
    private Integer currentAttempts;

    @Schema(description = "Maximum attempts allowed", example = "3")
    private Integer maxAttempts;

    @Schema(description = "Remaining attempts", example = "2")
    private Integer remainingAttempts;

    @Schema(description = "Whether assignment is past due", example = "false")
    private Boolean isPastDue;

    @Schema(description = "Reason if cannot submit", example = "Assignment is past due date")
    private String reason;
}
