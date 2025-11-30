package vn.uit.lms.shared.dto.request.course.content;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request DTO for reordering chapters")
public class ChapterReorderRequest {

    @NotNull
    @Min(1)
    @Schema(
        description = "New position for the chapter (1-based index)",
        example = "3",
        requiredMode = Schema.RequiredMode.REQUIRED,
        minimum = "1"
    )
    private Integer newPosition;

}
