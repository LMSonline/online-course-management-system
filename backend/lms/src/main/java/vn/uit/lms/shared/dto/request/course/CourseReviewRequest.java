package vn.uit.lms.shared.dto.request.course;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Request DTO for creating or updating a course review")
public class CourseReviewRequest {

    @NotNull
    @Min(1)
    @Max(5)
    @Schema(
        description = "Rating score (1-5 stars)",
        example = "5",
        requiredMode = Schema.RequiredMode.REQUIRED,
        minimum = "1",
        maximum = "5"
    )
    private Byte rating;

    @Schema(description = "Review title", example = "Excellent course!")
    private String title;

    @Schema(description = "Review content/comment", example = "This course helped me learn Java quickly and effectively.")
    private String content;
}

