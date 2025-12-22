package vn.uit.lms.shared.dto.request.enrollment;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request to enroll in a course")
public class EnrollCourseRequest {

    @NotNull(message = "Payment transaction ID is required for paid courses")
    @Schema(description = "Payment transaction ID (null for free courses)", example = "1")
    private Long paymentTransactionId;

    @Schema(description = "Additional notes for enrollment", example = "Interested in learning")
    private String notes;
}

