package vn.uit.lms.shared.dto.response.assessment;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QuizAttemptAnswerResponse {
    private Long id;
    private Long questionId;
    private Long selectedOptionId;
    private String answerText;
    private String selectedOptionIds; // Keeping as String (JSON) for simplicity in response, or could parse it.
    private Double score;
    private Boolean graded;
}
