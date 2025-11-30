package vn.uit.lms.shared.dto.response.course;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Schema(description = "Response DTO for public course version information")
public class CourseVersionPublicResponse {

    @Schema(description = "Version ID", example = "1")
    private Long id;

    @Schema(description = "Version title", example = "Spring 2024 Edition")
    private String title;

    @Schema(description = "Version description", example = "Updated with latest features")
    private String description;

    @Schema(description = "Course price", example = "99.99")
    private BigDecimal price;

    @Schema(description = "Course duration in days", example = "30")
    private int durationDays;

    @Schema(description = "Whether this version is published", example = "true")
    private boolean published;

    @Schema(description = "Course ID", example = "5")
    private Long courseId;
}