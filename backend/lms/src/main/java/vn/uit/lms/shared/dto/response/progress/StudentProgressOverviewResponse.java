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
@Schema(description = "Student overall progress summary")
public class StudentProgressOverviewResponse {

    @Schema(description = "Student ID", example = "1")
    private Long studentId;

    @Schema(description = "Student name", example = "Nguyen Van A")
    private String studentName;

    @Schema(description = "Total enrolled courses", example = "5")
    private Integer totalEnrolledCourses;

    @Schema(description = "Completed courses", example = "2")
    private Integer completedCourses;

    @Schema(description = "In progress courses", example = "3")
    private Integer inProgressCourses;

    @Schema(description = "Overall completion percentage", example = "45.5")
    private Float overallCompletionPercentage;

    @Schema(description = "Total watched hours", example = "120.5")
    private Float totalWatchedHours;

    @Schema(description = "Average score across all courses", example = "8.2")
    private Float averageScore;

    @Schema(description = "Course progress list")
    private List<CourseProgressSummary> courses;
}

