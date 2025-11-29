package vn.uit.lms.shared.dto.response.assignment;

import lombok.Builder;
import lombok.Data;
import vn.uit.lms.shared.constant.AssignmentType;

import java.time.Instant;

@Data
@Builder
public class AssignmentResponse {
    private Long id;
    private Long lessonId;
    private AssignmentType assignmentType;
    private String title;
    private String description;
    private Integer totalPoints;
    private Integer timeLimitMinutes;
    private Integer maxAttempts;
    private Instant createdAt;
    private Instant updatedAt;
}
