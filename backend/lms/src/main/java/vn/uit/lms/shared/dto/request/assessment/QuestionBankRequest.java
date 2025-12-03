package vn.uit.lms.shared.dto.request.assessment;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "Request DTO for creating or updating a question bank")
public class QuestionBankRequest {
    @NotBlank(message = "Name is required")
    @Schema(
        description = "Name of the question bank",
        example = "Java Programming Questions",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String name;

    @Schema(description = "Description of the question bank", example = "Collection of Java programming questions")
    private String description;
}
