package vn.uit.lms.shared.dto.request.assessment;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "Request DTO for creating or updating a quiz")
public class QuizRequest {
    @Schema(description = "Quiz title", example = "Java Basics Quiz")
    private String title;

    @Schema(description = "Quiz description", example = "Test your knowledge of Java fundamentals")
    private String description;

    @Schema(description = "Total points for the quiz", example = "100.0")
    private Double totalPoints;

    @Schema(description = "Time limit in minutes", example = "60")
    private Integer timeLimitMinutes;

    @Schema(description = "Maximum number of attempts allowed", example = "3")
    private Integer maxAttempts;

    @Schema(description = "Whether to randomize question order", example = "true")
    private Boolean randomizeQuestions;

    @Schema(description = "Whether to randomize answer option order", example = "true")
    private Boolean randomizeOptions;

    @Schema(description = "Minimum score to pass the quiz", example = "70.0")
    private Double passingScore;
}
