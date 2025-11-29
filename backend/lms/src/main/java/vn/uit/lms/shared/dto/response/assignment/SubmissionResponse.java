package vn.uit.lms.shared.dto.response.assignment;

import lombok.Builder;
import lombok.Data;
import vn.uit.lms.shared.constant.SubmissionStatus;

import java.time.Instant;
import java.util.List;

@Data
@Builder
public class SubmissionResponse {
    private Long id;
    private Long assignmentId;
    private Long studentId;
    private String studentName;
    private Instant submittedAt;
    private String content;
    private Double score;
    private Long gradedBy;
    private Instant gradedAt;
    private String feedback;
    private Integer attemptNumber;
    private SubmissionStatus status;
    private List<SubmissionFileResponse> files;
}
