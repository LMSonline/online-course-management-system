package vn.uit.lms.shared.dto.request.assignment;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FeedbackSubmissionRequest {
    @NotBlank(message = "Feedback is required")
    private String feedback;
}
