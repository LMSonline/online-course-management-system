package vn.uit.lms.shared.dto.request.course.content;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request DTO for reordering chapters in a course version")
public class ChapterReorderRequest {

    @NotEmpty(message = "Chapter IDs list cannot be empty")
    @Schema(
        description = "Ordered list of chapter IDs (0-based indexing)",
        example = "[3, 1, 2, 4]",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private List<Long> chapterIds;

}
