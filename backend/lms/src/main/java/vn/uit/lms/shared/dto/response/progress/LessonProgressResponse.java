package vn.uit.lms.shared.dto.response.progress;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.uit.lms.shared.constant.ProgressStatus;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Lesson progress information")
public class LessonProgressResponse {

    @Schema(description = "Progress ID", example = "1")
    private Long id;

    @Schema(description = "Lesson ID", example = "1")
    private Long lessonId;

    @Schema(description = "Lesson title", example = "Introduction to Java")
    private String lessonTitle;

    @Schema(description = "Lesson type", example = "VIDEO")
    private String lessonType;

    @Schema(description = "Lesson duration in seconds", example = "300")
    private Integer lessonDurationSeconds;

    @Schema(description = "Progress status", example = "COMPLETED")
    private ProgressStatus status;

    @Schema(description = "Viewed at", example = "2025-12-22T00:00:00Z")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'", timezone = "UTC")
    private Instant viewedAt;

    @Schema(description = "Times viewed", example = "3")
    private Integer timesViewed;

    @Schema(description = "Watched duration in seconds", example = "270")
    private Integer watchedDurationSeconds;

    @Schema(description = "Watched percentage", example = "90.0")
    private Float watchedPercentage;

    @Schema(description = "Completed at", example = "2025-12-22T01:00:00Z")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'", timezone = "UTC")
    private Instant completedAt;

    @Schema(description = "Is bookmarked", example = "false")
    private Boolean isBookmarked;

    @Schema(description = "Notes", example = "Great lesson!")
    private String notes;
}

