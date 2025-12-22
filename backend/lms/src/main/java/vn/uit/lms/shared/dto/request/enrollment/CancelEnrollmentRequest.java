package vn.uit.lms.shared.dto.request.enrollment;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request to cancel enrollment")
public class CancelEnrollmentRequest {

    @NotBlank(message = "Cancellation reason is required")
    @Size(max = 1000, message = "Reason must not exceed 1000 characters")
    @Schema(description = "Reason for cancellation", example = "Changed my mind")
    private String reason;
}

