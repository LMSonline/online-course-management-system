package vn.uit.lms.shared.dto.response.assessment;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QuizQuestionResponse {
    private Long id;
    private Long questionId;
    private String questionContent;
    private String questionType;
    private Double points;
    private Integer orderIndex;
}
