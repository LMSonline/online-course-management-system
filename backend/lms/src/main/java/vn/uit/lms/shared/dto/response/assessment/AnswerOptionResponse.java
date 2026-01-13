package vn.uit.lms.shared.dto.response.assessment;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@Schema(description = "Response DTO for answer option")
public class AnswerOptionResponse {
    @Schema(description = "Answer option ID", example = "1")
    private Long id;

    @Schema(description = "Answer option content/text", example = "Paris")
    private String content;

    @Schema(description = "Whether this is the correct answer", example = "true")
    @JsonProperty("isCorrect")
    private boolean isCorrect;

    @Schema(description = "Display order index", example = "1")
    private Integer orderIndex;
}
