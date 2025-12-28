package vn.uit.lms.shared.dto.response.assignment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentAssignmentProgressResponse {

    private Long assignmentId;
    private String assignmentTitle;
    private Integer totalPoints;
    private Instant dueDate;

    private Boolean hasSubmitted;
    private Integer attemptCount;

    private Long latestSubmissionId;
    private String latestSubmissionStatus;
    private Double latestScore;

    private Double bestScore;
    private Boolean isPassing;
}

