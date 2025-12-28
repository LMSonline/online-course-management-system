package vn.uit.lms.shared.dto.response.community.comment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentStatisticsResponse {

    private Long totalQuestions;
    private Long answeredQuestions;
    private Long unansweredQuestions;
    private Long totalReplies;
    private Long instructorReplies;

    // Response rate percentage
    private BigDecimal responseRate;

    // Average response time in hours
    private Double averageResponseTimeHours;

    // Engagement metrics
    private Long totalUpvotes;
    private Double averageUpvotesPerQuestion;

    /**
     * Calculate response rate as percentage
     */
    public static BigDecimal calculateResponseRate(long answered, long total) {
        if (total == 0) {
            return BigDecimal.ZERO;
        }
        return BigDecimal.valueOf(answered)
                .multiply(BigDecimal.valueOf(100))
                .divide(BigDecimal.valueOf(total), 2, RoundingMode.HALF_UP);
    }

    /**
     * Calculate average upvotes per question
     */
    public static Double calculateAverageUpvotes(long totalUpvotes, long totalQuestions) {
        if (totalQuestions == 0) {
            return 0.0;
        }
        return (double) totalUpvotes / totalQuestions;
    }
}

