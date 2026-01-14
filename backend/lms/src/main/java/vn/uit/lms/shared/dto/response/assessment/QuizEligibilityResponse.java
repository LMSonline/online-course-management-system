package vn.uit.lms.shared.dto.response.assessment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizEligibilityResponse {
    private Long quizId;
    private String quizTitle;
    private boolean canAttempt;
    private int currentAttempts;
    private Integer maxAttempts;
    private int remainingAttempts;
    private String reason;
    private boolean isAvailable;
    private Instant startDate;
    private Instant endDate;
    private String availabilityMessage;
}

