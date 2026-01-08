package vn.uit.lms.shared.dto.response.course;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.uit.lms.shared.constant.CourseStatus;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Response DTO for detailed course version information")
public class CourseVersionResponse {

    @Schema(description = "Version ID", example = "1")
    private Long id;

    @Schema(description = "Course ID", example = "5")
    private Long courseId;

    @Schema(description = "Version number", example = "2")
    private Integer versionNumber;

    @Schema(description = "Version title", example = "Spring 2024 Edition")
    private String title;

    @Schema(description = "Version description", example = "Updated with latest Java 17 features")
    private String description;

    @Schema(description = "Course price", example = "99.99")
    private BigDecimal price;

    @Schema(description = "Course duration in days", example = "30")
    private Integer durationDays;

    @Schema(description = "Passing score (0-10 scale)", example = "7.0")
    private Float passScore;

    @Schema(description = "Weight of final exam (0-1)", example = "0.4")
    private Float finalWeight;

    @Schema(description = "Minimum progress percentage required", example = "80")
    private Integer minProgressPct;

    @Schema(description = "Course status", example = "PUBLISHED")
    private CourseStatus status;

    @Schema(description = "Additional notes", example = "This version includes new video lectures")
    private String notes;

    @Schema(description = "Username who approved the version", example = "admin_user")
    private String approvedBy;

    @Schema(description = "Approval timestamp", example = "2025-11-15T10:00:00Z")
    private Instant approvedAt;

    @Schema(description = "Publication timestamp", example = "2025-11-20T08:00:00Z")
    private Instant publishedAt;

    @Schema(description = "Number of chapters in this version", example = "10")
    private int chapterCount;

    @Schema(description = "Creation timestamp", example = "2025-11-10T09:00:00Z")
    private Instant createdAt;
}

