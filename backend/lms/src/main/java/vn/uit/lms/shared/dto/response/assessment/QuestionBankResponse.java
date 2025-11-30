package vn.uit.lms.shared.dto.response.assessment;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;
import java.time.Instant;

@Data
@Builder
@Schema(description = "Response DTO for question bank")
public class QuestionBankResponse {
    @Schema(description = "Question bank ID", example = "1")
    private Long id;

    @Schema(description = "Question bank name", example = "Java Programming Questions")
    private String name;

    @Schema(description = "Question bank description", example = "Collection of Java programming questions")
    private String description;

    @Schema(description = "ID of the teacher who owns this question bank", example = "5")
    private Long teacherId;

    @Schema(description = "Creation timestamp", example = "2025-11-01T08:00:00Z")
    private Instant createdAt;

    @Schema(description = "Last update timestamp", example = "2025-11-20T14:30:00Z")
    private Instant updatedAt;
}
