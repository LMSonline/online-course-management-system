package vn.uit.lms.shared.dto.response.assessment;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@Schema(description = "Response DTO for quiz statistics (for teachers)")
public class QuizStatisticsResponse {
    @Schema(description = "Quiz ID", example = "1")
    private Long quizId;

    @Schema(description = "Quiz title", example = "Week 1 Java Quiz")
    private String quizTitle;

    @Schema(description = "Total number of attempts", example = "75")
    private Integer totalAttempts;

    @Schema(description = "Number of completed attempts", example = "70")
    private Integer completedAttempts;

    @Schema(description = "Number of in-progress attempts", example = "3")
    private Integer inProgressAttempts;

    @Schema(description = "Number of cancelled attempts", example = "2")
    private Integer cancelledAttempts;

    @Schema(description = "Average score", example = "7.5")
    private Double averageScore;

    @Schema(description = "Highest score", example = "9.8")
    private Double highestScore;

    @Schema(description = "Lowest score", example = "4.2")
    private Double lowestScore;

    @Schema(description = "Pass rate percentage", example = "85.5")
    private Double passRate;

    @Schema(description = "Average time spent in minutes", example = "25.5")
    private Double averageTimeSpentMinutes;
}
