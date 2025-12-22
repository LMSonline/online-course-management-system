package vn.uit.lms.shared.dto.response.progress;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Course progress overview")
public class CourseProgressResponse {

    @Schema(description = "Course ID", example = "1")
    private Long courseId;

    @Schema(description = "Course title", example = "Java Spring Boot")
    private String courseTitle;

    @Schema(description = "Total lessons", example = "50")
    private Integer totalLessons;

    @Schema(description = "Completed lessons", example = "30")
    private Integer completedLessons;

    @Schema(description = "Viewed lessons", example = "35")
    private Integer viewedLessons;

    @Schema(description = "Completion percentage", example = "60.0")
    private Float completionPercentage;

    @Schema(description = "Total duration in seconds", example = "15000")
    private Integer totalDurationSeconds;

    @Schema(description = "Watched duration in seconds", example = "9000")
    private Integer watchedDurationSeconds;

    @Schema(description = "Average score", example = "8.5")
    private Float averageScore;

    @Schema(description = "Chapter progress list")
    private List<ChapterProgressResponse> chapterProgress;
}

