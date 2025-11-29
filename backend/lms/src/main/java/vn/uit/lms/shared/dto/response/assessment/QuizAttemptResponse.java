package vn.uit.lms.shared.dto.response.assessment;

import lombok.Builder;
import lombok.Data;
import vn.uit.lms.shared.constant.QuizAttemptStatus;

import java.time.Instant;
import java.util.List;

@Data
@Builder
public class QuizAttemptResponse {
    private Long id;
    private Long quizId;
    private Long studentId;
    private Instant startedAt;
    private Instant finishedAt;
    private Double totalScore;
    private Integer attemptNumber;
    private QuizAttemptStatus status;
    private String metadata;
    private List<QuizAttemptAnswerResponse> answers;
}
