package vn.uit.lms.shared.dto.response.assessment;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@Schema(description = "Response DTO for quiz question (simplified)")
public class QuizQuestionResponse {
    @Schema(description = "Quiz question mapping ID", example = "1")
    private Long id;

    @Schema(description = "Question ID", example = "5")
    private Long questionId;

    @Schema(description = "Question content/text", example = "What is the capital of France?")
    private String questionContent;

    @Schema(description = "Question type", example = "MULTIPLE_CHOICE")
    private String questionType;

    @Schema(description = "Points for this question in the quiz", example = "10.0")
    private Double points;

    @Schema(description = "Order index in the quiz", example = "1")
    private Integer orderIndex;
}
