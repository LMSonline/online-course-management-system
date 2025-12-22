package vn.uit.lms.shared.dto.request.progress;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request to update watched duration")
public class UpdateWatchedDurationRequest {

    @Min(value = 0, message = "Duration must be positive")
    @Schema(description = "Watched duration in seconds", example = "120")
    private Integer durationSeconds;

    @Schema(description = "Additional notes", example = "Completed this lesson")
    private String notes;
}

