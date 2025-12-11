package vn.uit.lms.shared.dto.response.student;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Student learning progress information")
public class StudentProgressResponse {

    @Schema(description = "Total enrolled courses", example = "10")
    private Long totalEnrolledCourses;

    @Schema(description = "Completed courses", example = "5")
    private Long completedCourses;

    @Schema(description = "In-progress courses", example = "3")
    private Long inProgressCourses;

    @Schema(description = "Total certificates earned", example = "5")
    private Long totalCertificates;

    @Schema(description = "Total learning hours", example = "120.5")
    private Double totalLearningHours;

    @Schema(description = "Average progress percentage", example = "65.5")
    private Double averageProgressPercentage;

    @Schema(description = "Last activity timestamp")
    private Instant lastActivityAt;

    @Schema(description = "Total assignments submitted", example = "45")
    private Long totalAssignmentsSubmitted;

    @Schema(description = "Total assessments completed", example = "30")
    private Long totalAssessmentsCompleted;
}

