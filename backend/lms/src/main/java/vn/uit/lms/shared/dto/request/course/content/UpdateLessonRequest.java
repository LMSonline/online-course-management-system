package vn.uit.lms.shared.dto.request.course.content;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import vn.uit.lms.shared.constant.LessonType;

@Data
@Schema(description = "Request DTO for updating a lesson")
public class UpdateLessonRequest {

    @NotNull(message = "Lesson type is required")
    @Schema(
        description = "Type of lesson",
        example = "VIDEO",
        requiredMode = Schema.RequiredMode.REQUIRED,
        allowableValues = {"VIDEO", "DOCUMENT", "QUIZ", "ASSIGNMENT", "FINAL_EXAM"}
    )
    private LessonType type;

    @NotBlank(message = "Title is required")
    @Schema(
        description = "Lesson title",
        example = "Spring Boot Basics - Updated",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String title;

    @Schema(description = "Short description of the lesson")
    private String shortDescription;

    @Schema(description = "Whether this is a preview lesson (accessible without enrollment)")
    private Boolean isPreview;
}

