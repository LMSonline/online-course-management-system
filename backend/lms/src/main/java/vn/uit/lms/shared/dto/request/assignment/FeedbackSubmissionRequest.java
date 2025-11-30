package vn.uit.lms.shared.dto.request.assignment;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "Request DTO for providing feedback on a submission")
public class FeedbackSubmissionRequest {
    @NotBlank(message = "Feedback is required")
    @Schema(
        description = "Feedback text for the submission",
        example = "Great work! However, consider improving the error handling section.",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String feedback;
}
