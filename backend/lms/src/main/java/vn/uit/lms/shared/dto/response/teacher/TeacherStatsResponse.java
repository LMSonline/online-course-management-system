package vn.uit.lms.shared.dto.response.teacher;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Teacher statistics response")
public class TeacherStatsResponse {

    @Schema(description = "Total number of courses", example = "10")
    private Long totalCourses;

    @Schema(description = "Number of published courses", example = "8")
    private Long publishedCourses;

    @Schema(description = "Number of draft courses", example = "2")
    private Long draftCourses;

    @Schema(description = "Total number of students enrolled in all courses", example = "250")
    private Long totalStudents;

    @Schema(description = "Total number of course reviews", example = "45")
    private Long totalReviews;

    @Schema(description = "Average course rating", example = "4.5")
    private Double averageRating;

    @Schema(description = "Total revenue (if applicable)", example = "15000000.0")
    private Double totalRevenue;
}

