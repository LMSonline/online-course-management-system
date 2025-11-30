package vn.uit.lms.shared.dto.request.course.content;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Request DTO for updating video lesson details")
public class UpdateVideoRequest {
    @NotBlank(message = "objectKey is required")
    @Schema(
        description = "MinIO object key for the video file",
        example = "videos/course-1/lesson-5/video.mp4",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String objectKey;

    @NotNull(message = "Duration is required")
    @Positive(message = "Duration must be positive")
    @Schema(
        description = "Video duration in seconds",
        example = "1800",
        requiredMode = Schema.RequiredMode.REQUIRED,
        minimum = "1"
    )
    private Integer durationSeconds;
}

