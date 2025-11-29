package vn.uit.lms.shared.dto.request.assessment;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import vn.uit.lms.shared.constant.QuestionType;

import java.util.List;

@Data
public class QuestionRequest {
    @NotBlank(message = "Content is required")
    private String content;

    @NotNull(message = "Type is required")
    private QuestionType type;

    private String metadata;

    private Double maxPoints;

    @Valid
    private List<AnswerOptionRequest> answerOptions;
}
