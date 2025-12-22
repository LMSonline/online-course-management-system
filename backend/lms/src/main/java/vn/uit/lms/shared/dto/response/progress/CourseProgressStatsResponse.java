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
@Schema(description = "Course progress statistics for teacher")
public class CourseProgressStatsResponse {

    @Schema(description = "Course ID", example = "1")
    private Long courseId;

    @Schema(description = "Course title", example = "Java Spring Boot")
    private String courseTitle;

    @Schema(description = "Total enrolled students", example = "100")
    private Integer totalEnrolledStudents;

    @Schema(description = "Students with progress", example = "85")
    private Integer studentsWithProgress;

    @Schema(description = "Students completed", example = "30")
    private Integer studentsCompleted;

    @Schema(description = "Average completion percentage", example = "45.5")
    private Float averageCompletionPercentage;

    @Schema(description = "Average score", example = "7.8")
    private Float averageScore;

    @Schema(description = "Most completed lesson ID", example = "1")
    private Long mostCompletedLessonId;

    @Schema(description = "Most completed lesson title", example = "Introduction")
    private String mostCompletedLessonTitle;

    @Schema(description = "Least completed lesson ID", example = "50")
    private Long leastCompletedLessonId;

    @Schema(description = "Least completed lesson title", example = "Advanced Topics")
    private String leastCompletedLessonTitle;
}

