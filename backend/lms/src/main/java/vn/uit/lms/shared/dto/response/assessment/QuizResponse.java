package vn.uit.lms.shared.dto.response.assessment;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@Schema(description = "Response DTO for quiz details")
public class QuizResponse {
    @Schema(description = "Quiz ID", example = "1")
    private Long id;

    @Schema(description = "Quiz title", example = "Java Basics Quiz")
    private String title;

    @Schema(description = "Quiz description", example = "Test your knowledge of Java fundamentals")
    private String description;

    @Schema(description = "ID of the lesson this quiz belongs to", example = "5")
    private Long lessonId;

    @Schema(description = "Total points for the quiz", example = "100.0")
    private Double totalPoints;

    @Schema(description = "Time limit in minutes", example = "60")
    private Integer timeLimitMinutes;

    @Schema(description = "Maximum number of attempts allowed", example = "3")
    private Integer maxAttempts;

    @Schema(description = "Whether questions are randomized", example = "true")
    private Boolean randomizeQuestions;

    @Schema(description = "Whether answer options are randomized", example = "true")
    private Boolean randomizeOptions;

    @Schema(description = "Minimum score to pass", example = "70.0")
    private Double passingScore;

    @Schema(description = "Quiz start date/time", example = "2026-01-15T08:00:00Z")
    private Instant startDate;

    @Schema(description = "Quiz end date/time", example = "2026-01-30T23:59:59Z")
    private Instant endDate;

    @Schema(description = "Whether quiz is currently available", example = "true")
    private Boolean isAvailable;

    @Schema(description = "Availability message", example = "Quiz is available until 2026-01-30T23:59:59Z")
    private String availabilityMessage;

    @Schema(description = "List of questions in the quiz")
    private List<QuizQuestionResponse> questions;

    @Schema(description = "Creation timestamp", example = "2025-11-01T08:00:00Z")
    private Instant createdAt;

    @Schema(description = "Username who created the quiz", example = "john_doe")
    private String createdBy;

    @Schema(description = "Last update timestamp", example = "2025-11-20T14:30:00Z")
    private Instant updatedAt;

    @Schema(description = "Username who last updated the quiz", example = "jane_doe")
    private String updatedBy;

    @Schema(description = "Deletion timestamp (soft delete)", example = "2025-11-25T10:00:00Z")
    private Instant deletedAt;
}
