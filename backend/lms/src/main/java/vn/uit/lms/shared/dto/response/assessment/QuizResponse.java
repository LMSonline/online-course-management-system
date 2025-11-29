package vn.uit.lms.shared.dto.response.assessment;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
@Builder
public class QuizResponse {
    private Long id;
    private String title;
    private String description;
    private Long lessonId;
    private Double totalPoints;
    private Integer timeLimitMinutes;
    private Integer maxAttempts;
    private Boolean randomizeQuestions;
    private Boolean randomizeOptions;
    private Double passingScore;
    private List<QuizQuestionResponse> questions;
    private Instant createdAt;
    private String createdBy;
    private Instant updatedAt;
    private String updatedBy;
    private Instant deletedAt;
}
