package vn.uit.lms.shared.dto.request.course;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CourseVersionRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 255)
    private String title;

    @Size(max = 5000)
    private String description;

    @DecimalMin(value = "0.0", message = "Price must be >= 0")
    private BigDecimal price;

    @Min(value = 0, message = "Duration must be >= 0")
    private Integer durationDays;

    @DecimalMin(value = "0.0") @DecimalMax(value = "10.0")
    private Float passScore;

    @DecimalMin(value = "0.0") @DecimalMax(value = "1.0")
    private Float finalWeight;

    @Min(value = 0) @Max(value = 100)
    private Integer minProgressPct;

    @Size(max = 2000)
    private String notes;


}
