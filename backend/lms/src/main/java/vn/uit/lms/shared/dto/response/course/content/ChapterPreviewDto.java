package vn.uit.lms.shared.dto.response.course.content;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for chapter preview - shows all lessons but only allows access to preview lessons
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Chapter preview information")
public class ChapterPreviewDto {

    @Schema(description = "Chapter ID", example = "1")
    private Long id;

    @Schema(description = "Chapter title", example = "Getting Started")
    private String title;

    @Schema(description = "Chapter description", example = "Introduction to Java basics")
    private String description;

    @Schema(description = "Chapter order/position", example = "1")
    private Integer orderIndex;

    @Schema(description = "Total number of lessons in chapter", example = "5")
    private Integer totalLessons;

    @Schema(description = "Total duration in seconds", example = "3600")
    private Integer totalDurationSeconds;

    @Schema(description = "Formatted total duration", example = "01:00:00")
    private String formattedTotalDuration;

    @Schema(description = "List of lessons (preview lessons are accessible)")
    private List<LessonPreviewDto> lessons;
}

