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
@Schema(description = "Chapter progress information")
public class ChapterProgressResponse {

    @Schema(description = "Chapter ID", example = "1")
    private Long chapterId;

    @Schema(description = "Chapter title", example = "Chapter 1: Introduction")
    private String chapterTitle;

    @Schema(description = "Total lessons", example = "10")
    private Integer totalLessons;

    @Schema(description = "Completed lessons", example = "7")
    private Integer completedLessons;

    @Schema(description = "Completion percentage", example = "70.0")
    private Float completionPercentage;

    @Schema(description = "Lesson progress list")
    private List<LessonProgressResponse> lessonProgress;
}

