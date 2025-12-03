package vn.uit.lms.shared.dto.request.course.content;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "Request DTO for creating or updating a chapter")
public class ChapterRequest {

    @NotBlank
    @Schema(
        description = "Chapter title",
        example = "Introduction to Spring Framework",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String title;

}
