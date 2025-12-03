package vn.uit.lms.shared.dto.request.assessment;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
@Schema(description = "Request DTO for submitting an answer to a quiz question")
public class SubmitAnswerRequest {
    @NotNull
    @Schema(
        description = "ID of the question being answered",
        example = "1",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private Long questionId;

    @Schema(description = "ID of the selected option (for single choice questions)", example = "5")
    private Long selectedOptionId;

    @Schema(description = "Text answer (for short answer or essay questions)", example = "Spring Boot is a Java framework")
    private String answerText;

    @Schema(description = "List of selected option IDs (for multiple choice questions)", example = "[5, 7, 9]")
    private List<Long> selectedOptionIds;
}
