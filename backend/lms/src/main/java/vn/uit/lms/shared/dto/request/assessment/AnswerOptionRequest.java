package vn.uit.lms.shared.dto.request.assessment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AnswerOptionRequest {
    private Long id; // Optional, for updates
    @NotBlank(message = "Content is required")
    private String content;
    @NotNull(message = "IsCorrect is required")
    private Boolean isCorrect;
    private Integer orderIndex;
}
