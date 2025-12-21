package vn.uit.lms.shared.dto.request.course.content;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
@Schema(description = "Request DTO for reordering lessons in a chapter")
public class ReorderLessonsRequest {

    @NotEmpty(message = "Lesson IDs list cannot be empty")
    @Schema(
        description = "Ordered list of lesson IDs",
        example = "[3, 1, 2, 4]",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private List<Long> lessonIds;
}

