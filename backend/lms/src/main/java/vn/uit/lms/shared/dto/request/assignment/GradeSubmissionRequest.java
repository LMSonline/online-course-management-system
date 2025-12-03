package vn.uit.lms.shared.dto.request.assignment;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "Request DTO for grading a submission")
public class GradeSubmissionRequest {
    @NotNull(message = "Grade is required")
    @Min(value = 0, message = "Grade must be at least 0")
    @Max(value = 10, message = "Grade must be at most 10")
    @Schema(
        description = "Grade for the submission (0-10 scale)",
        example = "8.5",
        requiredMode = Schema.RequiredMode.REQUIRED,
        minimum = "0",
        maximum = "10"
    )
    private Double grade;

    @Schema(description = "Feedback for the student", example = "Excellent work! Keep it up.")
    private String feedback;
}
