package vn.uit.lms.shared.dto.response.assessment;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@Schema(description = "Response DTO for quiz attempt answer")
public class QuizAttemptAnswerResponse {
    @Schema(description = "Answer ID", example = "1")
    private Long id;

    @Schema(description = "Question ID", example = "5")
    private Long questionId;

    @Schema(description = "Selected option ID (for single choice)", example = "10")
    private Long selectedOptionId;

    @Schema(description = "Text answer (for short answer/essay questions)", example = "Spring Boot is a Java framework")
    private String answerText;

    @Schema(description = "Selected option IDs (JSON string for multiple choice)", example = "[5, 7, 9]")
    private String selectedOptionIds;

    @Schema(description = "Score received for this answer", example = "8.5")
    private Double score;

    @Schema(description = "Whether the answer has been graded", example = "true")
    private Boolean graded;
}
