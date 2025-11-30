package vn.uit.lms.shared.dto.request.assessment;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
@Schema(description = "Request DTO for adding questions to a quiz")
public class AddQuestionsRequest {
    @NotEmpty(message = "Question IDs cannot be empty")
    @Schema(
        description = "List of question IDs to add to the quiz",
        example = "[1, 2, 3]",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private List<Long> questionIds;
}
