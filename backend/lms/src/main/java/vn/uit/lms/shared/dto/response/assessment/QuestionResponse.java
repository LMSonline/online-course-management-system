package vn.uit.lms.shared.dto.response.assessment;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;
import vn.uit.lms.shared.constant.QuestionType;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@Schema(description = "Response DTO for question details")
public class QuestionResponse {
    @Schema(description = "Question ID", example = "1")
    private Long id;

    @Schema(description = "Question content/text", example = "What is the capital of France?")
    private String content;

    @Schema(description = "Question type", example = "MULTIPLE_CHOICE")
    private QuestionType type;

    @Schema(description = "Additional metadata in JSON format", example = "{\"difficulty\": \"medium\"}")
    private String metadata;

    @Schema(description = "Maximum points for this question", example = "10.0")
    private Double maxPoints;

    @Schema(description = "ID of the question bank this belongs to", example = "5")
    private Long questionBankId;

    @Schema(description = "List of answer options")
    private List<AnswerOptionResponse> answerOptions;

    @Schema(description = "Creation timestamp", example = "2025-11-01T08:00:00Z")
    private Instant createdAt;

    @Schema(description = "Last update timestamp", example = "2025-11-20T14:30:00Z")
    private Instant updatedAt;
}
