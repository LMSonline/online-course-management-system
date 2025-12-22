package vn.uit.lms.shared.dto.response.enrollment;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Enrollment statistics")
public class EnrollmentStatsResponse {

    @Schema(description = "Total enrollments", example = "100")
    private Long totalEnrollments;

    @Schema(description = "Active enrollments", example = "80")
    private Long activeEnrollments;

    @Schema(description = "Completed enrollments", example = "15")
    private Long completedEnrollments;

    @Schema(description = "Cancelled enrollments", example = "3")
    private Long cancelledEnrollments;

    @Schema(description = "Expired enrollments", example = "2")
    private Long expiredEnrollments;

    @Schema(description = "Completion rate", example = "75.0")
    private Double completionRate;

    @Schema(description = "Average completion percentage", example = "68.5")
    private Double averageCompletionPercentage;

    @Schema(description = "Average score", example = "7.8")
    private Double averageScore;

    @Schema(description = "Certificates issued", example = "12")
    private Long certificatesIssued;
}

