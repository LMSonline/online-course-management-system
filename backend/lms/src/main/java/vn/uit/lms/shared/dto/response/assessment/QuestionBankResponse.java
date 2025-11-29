package vn.uit.lms.shared.dto.response.assessment;

import lombok.Builder;
import lombok.Data;
import java.time.Instant;

@Data
@Builder
public class QuestionBankResponse {
    private Long id;
    private String name;
    private String description;
    private Long teacherId;
    private Instant createdAt;
    private Instant updatedAt;
}
