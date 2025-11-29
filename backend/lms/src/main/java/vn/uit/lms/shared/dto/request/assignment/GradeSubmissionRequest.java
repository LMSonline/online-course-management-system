package vn.uit.lms.shared.dto.request.assignment;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GradeSubmissionRequest {
    @NotNull(message = "Grade is required")
    @Min(value = 0, message = "Grade must be at least 0")
    @Max(value = 10, message = "Grade must be at most 10")
    private Double grade;
    private String feedback;
}
