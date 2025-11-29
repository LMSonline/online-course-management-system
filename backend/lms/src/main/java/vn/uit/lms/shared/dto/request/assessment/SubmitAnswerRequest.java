package vn.uit.lms.shared.dto.request.assessment;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class SubmitAnswerRequest {
    @NotNull
    private Long questionId;

    private Long selectedOptionId;

    private String answerText;

    private List<Long> selectedOptionIds;
}
