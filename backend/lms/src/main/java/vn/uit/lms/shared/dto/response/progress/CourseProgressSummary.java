package vn.uit.lms.shared.dto.response.progress;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Course progress summary")
public class CourseProgressSummary {

    @Schema(description = "Course ID", example = "1")
    private Long courseId;

    @Schema(description = "Course title", example = "Java Spring Boot")
    private String courseTitle;

    @Schema(description = "Completion percentage", example = "60.0")
    private Float completionPercentage;

    @Schema(description = "Average score", example = "8.5")
    private Float averageScore;

    @Schema(description = "Total lessons", example = "50")
    private Integer totalLessons;

    @Schema(description = "Completed lessons", example = "30")
    private Integer completedLessons;
}

