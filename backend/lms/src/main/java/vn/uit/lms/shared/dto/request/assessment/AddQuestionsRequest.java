package vn.uit.lms.shared.dto.request.assessment;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class AddQuestionsRequest {
    @NotEmpty(message = "Question IDs cannot be empty")
    private List<Long> questionIds;
}
