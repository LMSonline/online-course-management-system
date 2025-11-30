package vn.uit.lms.shared.dto.response.assessment;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;
import vn.uit.lms.shared.constant.QuizAttemptStatus;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@Schema(description = "Response DTO for quiz attempt details")
public class QuizAttemptResponse {
    @Schema(description = "Attempt ID", example = "1")
    private Long id;

    @Schema(description = "Quiz ID", example = "5")
    private Long quizId;

    @Schema(description = "Student ID who took the quiz", example = "10")
    private Long studentId;

    @Schema(description = "When the attempt started", example = "2025-11-30T10:00:00Z")
    private Instant startedAt;

    @Schema(description = "When the attempt finished", example = "2025-11-30T11:00:00Z")
    private Instant finishedAt;

    @Schema(description = "Total score achieved", example = "85.5")
    private Double totalScore;

    @Schema(description = "Attempt number (1st, 2nd, 3rd...)", example = "1")
    private Integer attemptNumber;

    @Schema(description = "Status of the attempt", example = "COMPLETED")
    private QuizAttemptStatus status;

    @Schema(description = "Additional metadata in JSON format", example = "{\"ip\": \"192.168.1.1\"}")
    private String metadata;

    @Schema(description = "List of answers submitted")
    private List<QuizAttemptAnswerResponse> answers;
}
