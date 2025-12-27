package vn.uit.lms.shared.dto.response.assessment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizStatisticsResponse {
    private Long quizId;
    private String quizTitle;
    private int totalAttempts;
    private int completedAttempts;
    private int inProgressAttempts;
    private int cancelledAttempts;
    private Double averageScore;
    private Double highestScore;
    private Double lowestScore;
    private Double passRate;
    private Double averageTimeSpentMinutes;
}

