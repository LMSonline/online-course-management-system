package vn.uit.lms.shared.dto.response.course.content;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.uit.lms.shared.constant.LessonType;
import vn.uit.lms.shared.constant.VideoStatus;

/**
 * DTO for lesson preview - indicates if lesson is accessible for preview
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Lesson preview information")
public class LessonPreviewDto {

    @Schema(description = "Lesson ID", example = "1")
    private Long id;

    @Schema(description = "Lesson type", example = "VIDEO")
    private LessonType type;

    @Schema(description = "Lesson title", example = "Introduction to Variables")
    private String title;

    @Schema(description = "Short description", example = "Learn about variables in Java")
    private String shortDescription;

    @Schema(description = "Video status", example = "READY")
    private VideoStatus videoStatus;

    @Schema(description = "Duration in seconds", example = "600")
    private Integer durationSeconds;

    @Schema(description = "Lesson order/position", example = "1")
    private Integer orderIndex;

    @Schema(description = "Whether this lesson is available for preview without enrollment", example = "true")
    private Boolean isPreview;

    @Schema(description = "Whether the video is ready to play", example = "true")
    private Boolean isVideoReady;

    @Schema(description = "Formatted duration", example = "10:00")
    private String formattedDuration;
}

