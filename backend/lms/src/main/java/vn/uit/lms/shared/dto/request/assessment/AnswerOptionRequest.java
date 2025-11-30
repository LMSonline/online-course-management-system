package vn.uit.lms.shared.dto.request.assessment;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "Request DTO for answer option in a question")
public class AnswerOptionRequest {
    @Schema(description = "Option ID (optional, for updates)", example = "1")
    private Long id;

    @NotBlank(message = "Content is required")
    @Schema(
        description = "Content of the answer option",
        example = "Paris",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String content;

    @NotNull(message = "IsCorrect is required")
    @Schema(
        description = "Whether this option is correct",
        example = "true",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private Boolean isCorrect;

    @Schema(description = "Display order of the option", example = "1")
    private Integer orderIndex;
}
