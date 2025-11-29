package vn.uit.lms.shared.dto.response.assessment;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AnswerOptionResponse {
    private Long id;
    private String content;
    private boolean isCorrect;
    private Integer orderIndex;
}
