package vn.uit.lms.shared.dto.response.teacher;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Teacher revenue statistics response")
public class TeacherRevenueResponse {

    @Schema(description = "Total revenue", example = "15000000.0")
    private Double totalRevenue;

    @Schema(description = "Revenue this month", example = "2500000.0")
    private Double monthlyRevenue;

    @Schema(description = "Revenue this year", example = "15000000.0")
    private Double yearlyRevenue;

    @Schema(description = "Total number of enrollments", example = "250")
    private Long totalEnrollments;

    @Schema(description = "Number of enrollments this month", example = "35")
    private Long monthlyEnrollments;

    @Schema(description = "Revenue by course breakdown")
    private List<CourseRevenueDetail> revenueByCourse;

    @Schema(description = "Last updated timestamp")
    private Instant lastUpdated;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Revenue details per course")
    public static class CourseRevenueDetail {
        @Schema(description = "Course ID", example = "1")
        private Long courseId;

        @Schema(description = "Course title", example = "Java Programming")
        private String courseTitle;

        @Schema(description = "Number of enrollments", example = "50")
        private Long enrollmentCount;

        @Schema(description = "Total revenue from this course", example = "5000000.0")
        private Double revenue;
    }
}

