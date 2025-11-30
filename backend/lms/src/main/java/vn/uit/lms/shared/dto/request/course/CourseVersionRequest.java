package vn.uit.lms.shared.dto.request.course;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Schema(description = "Request DTO for creating or updating a course version")
public class CourseVersionRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 255)
    @Schema(
        description = "Version title",
        example = "Spring 2024 Edition",
        requiredMode = Schema.RequiredMode.REQUIRED,
        maxLength = 255
    )
    private String title;

    @Size(max = 5000)
    @Schema(description = "Detailed description of this version", example = "Updated with latest Java 17 features", maxLength = 5000)
    private String description;

    @DecimalMin(value = "0.0", message = "Price must be >= 0")
    @Schema(description = "Course price", example = "99.99", minimum = "0")
    private BigDecimal price;

    @Min(value = 0, message = "Duration must be >= 0")
    @Schema(description = "Course duration in days", example = "30", minimum = "0")
    private Integer durationDays;

    @DecimalMin(value = "0.0") @DecimalMax(value = "10.0")
    @Schema(description = "Passing score (0-10 scale)", example = "7.0", minimum = "0", maximum = "10")
    private Float passScore;

    @DecimalMin(value = "0.0") @DecimalMax(value = "1.0")
    @Schema(description = "Weight of final exam (0-1)", example = "0.4", minimum = "0", maximum = "1")
    private Float finalWeight;

    @Min(value = 0) @Max(value = 100)
    @Schema(description = "Minimum progress percentage required", example = "80", minimum = "0", maximum = "100")
    private Integer minProgressPct;

    @Size(max = 2000)
    @Schema(description = "Additional notes", example = "This version includes new video lectures", maxLength = 2000)
    private String notes;

}
