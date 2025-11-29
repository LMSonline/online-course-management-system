package vn.uit.lms.shared.dto.request.course.content;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateVideoRequest {
    @NotBlank(message = "objectKey is required")
    private String objectKey;

    @NotNull(message = "Duration is required")
    @Positive(message = "Duration must be positive")
    private Integer durationSeconds;
}

