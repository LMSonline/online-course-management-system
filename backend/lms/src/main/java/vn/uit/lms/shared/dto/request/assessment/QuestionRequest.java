package vn.uit.lms.shared.dto.request.assessment;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import vn.uit.lms.shared.constant.QuestionType;

import java.util.List;

@Data
@Schema(description = "Request DTO for creating or updating a question")
public class QuestionRequest {
    @NotBlank(message = "Content is required")
    @Schema(
        description = "Question content/text",
        example = "What is the capital of France?",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String content;

    @NotNull(message = "Type is required")
    @Schema(
        description = "Type of question",
        example = "MULTIPLE_CHOICE",
        requiredMode = Schema.RequiredMode.REQUIRED,
        allowableValues = {"MULTIPLE_CHOICE","MULTI_SELECT", "TRUE_FALSE", "SHORT_ANSWER", "ESSAY"}
    )
    private QuestionType type;

    @Schema(description = "Additional metadata in JSON format", example = "{\"difficulty\": \"medium\"}")
    private String metadata;

    @Schema(description = "Maximum points for this question", example = "10.0")
    private Double maxPoints;

    @Valid
    @Schema(description = "List of answer options for the question")
    private List<AnswerOptionRequest> answerOptions;
}
