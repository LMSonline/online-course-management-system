package vn.uit.lms.shared.dto.request.assignment;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import vn.uit.lms.shared.constant.AssignmentType;

@Data
public class AssignmentRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private AssignmentType assignmentType;

    private String description;
    private Integer totalPoints;
    private Integer timeLimitMinutes;
    private Integer maxAttempts;
}
