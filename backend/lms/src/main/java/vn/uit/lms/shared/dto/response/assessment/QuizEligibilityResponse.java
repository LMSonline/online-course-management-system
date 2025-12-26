package vn.uit.lms.shared.dto.response.assessment;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@Schema(description = "Response DTO for quiz eligibility check (for students)")
public class QuizEligibilityResponse {
    @Schema(description = "Quiz ID", example = "1")
    private Long quizId;

    @Schema(description = "Quiz title", example = "Week 1 Java Quiz")
    private String quizTitle;

    @Schema(description = "Whether student can attempt quiz", example = "true")
    private Boolean canAttempt;

    @Schema(description = "Current attempt count", example = "2")
    private Integer currentAttempts;

    @Schema(description = "Maximum attempts allowed", example = "3")
    private Integer maxAttempts;

    @Schema(description = "Remaining attempts", example = "1")
    private Integer remainingAttempts;

    @Schema(description = "Reason if cannot attempt", example = "Maximum attempts reached")
    private String reason;
}
