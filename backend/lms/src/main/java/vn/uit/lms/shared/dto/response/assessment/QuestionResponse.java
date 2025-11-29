package vn.uit.lms.shared.dto.response.assessment;

import lombok.Builder;
import lombok.Data;
import vn.uit.lms.shared.constant.QuestionType;

import java.time.Instant;
import java.util.List;

@Data
@Builder
public class QuestionResponse {
    private Long id;
    private String content;
    private QuestionType type;
    private String metadata;
    private Double maxPoints;
    private Long questionBankId;
    private List<AnswerOptionResponse> answerOptions;
    private Instant createdAt;
    private Instant updatedAt;
}
