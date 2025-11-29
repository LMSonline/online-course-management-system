package vn.uit.lms.shared.dto.request.assessment;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class QuizRequest {
    private String title;
    private String description;
    private Double totalPoints;
    private Integer timeLimitMinutes;
    private Integer maxAttempts;
    private Boolean randomizeQuestions;
    private Boolean randomizeOptions;
    private Double passingScore;
}
