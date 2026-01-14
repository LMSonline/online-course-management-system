package vn.uit.lms.core.domain.assessment;

import jakarta.persistence.*;
import lombok.*;
import vn.uit.lms.core.domain.course.content.Lesson;
import vn.uit.lms.shared.entity.BaseEntity;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quizzes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class Quiz extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "total_points")
    private Double totalPoints;

    @Column(name = "time_limit_minutes")
    private Integer timeLimitMinutes;

    @Column(name = "max_attempts")
    private Integer maxAttempts;

    @Column(name = "randomize_questions")
    private Boolean randomizeQuestions;

    @Column(name = "randomize_options")
    private Boolean randomizeOptions;

    @Column(name = "passing_score")
    private Double passingScore;

    @Column(name = "start_date")
    private Instant startDate;

    @Column(name = "end_date")
    private Instant endDate;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<QuizQuestion> quizQuestions = new ArrayList<>();

    /**
     * Check if quiz has time limit
     */
    public boolean hasTimeLimit() {
        return timeLimitMinutes != null && timeLimitMinutes > 0;
    }

    /**
     * Check if quiz allows multiple attempts
     */
    public boolean allowsMultipleAttempts() {
        return maxAttempts != null && maxAttempts > 1;
    }

    /**
     * Check if quiz randomizes questions
     */
    public boolean shouldRandomizeQuestions() {
        return randomizeQuestions != null && randomizeQuestions;
    }

    /**
     * Check if quiz randomizes options
     */
    public boolean shouldRandomizeOptions() {
        return randomizeOptions != null && randomizeOptions;
    }

    /**
     * Validate quiz configuration
     */
    public void validate() {
        if (title == null || title.isBlank()) {
            throw new IllegalStateException("Quiz title is required");
        }
        if (totalPoints != null && totalPoints < 0) {
            throw new IllegalStateException("Total points cannot be negative");
        }
        if (timeLimitMinutes != null && timeLimitMinutes < 0) {
            throw new IllegalStateException("Time limit cannot be negative");
        }
        if (maxAttempts != null && maxAttempts < 1) {
            throw new IllegalStateException("Max attempts must be at least 1");
        }
        if (passingScore != null) {
            if (passingScore < 0) {
                throw new IllegalStateException("Passing score cannot be negative");
            }
            if (totalPoints != null && passingScore > totalPoints) {
                throw new IllegalStateException("Passing score cannot exceed total points");
            }
        }
        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            throw new IllegalStateException("Start date must be before end date");
        }
    }

    /**
     * Check if a student can start a new attempt
     */
    public boolean canAttempt(int currentAttempts) {
        return maxAttempts == null || currentAttempts < maxAttempts;
    }

    /**
     * Get remaining attempts for a student
     */
    public int getRemainingAttempts(int currentAttempts) {
        if (maxAttempts == null) {
            return -1; // Unlimited
        }
        return Math.max(0, maxAttempts - currentAttempts);
    }

    /**
     * Check if a score passes the quiz
     */
    public boolean isPassing(Double score) {
        if (score == null || passingScore == null) {
            return false;
        }
        return score >= passingScore;
    }

    /**
     * Get number of questions in quiz
     */
    public int getQuestionCount() {
        return quizQuestions != null ? quizQuestions.size() : 0;
    }

    /**
     * Add question to quiz
     */
    public void addQuestion(QuizQuestion quizQuestion) {
        if (quizQuestions == null) {
            quizQuestions = new ArrayList<>();
        }
        quizQuestion.setQuiz(this);
        quizQuestions.add(quizQuestion);
    }

    /**
     * Remove question from quiz
     */
    public void removeQuestion(QuizQuestion quizQuestion) {
        if (quizQuestions != null) {
            quizQuestions.remove(quizQuestion);
            quizQuestion.setQuiz(null);
        }
    }

    /**
     * Calculate total points from all questions
     */
    public Double calculateTotalPoints() {
        if (quizQuestions == null || quizQuestions.isEmpty()) {
            return 0.0;
        }
        return quizQuestions.stream()
                .map(QuizQuestion::getEffectivePoints)
                .reduce(0.0, Double::sum);
    }

    /**
     * Update total points based on questions
     */
    public void recalculateTotalPoints() {
        this.totalPoints = calculateTotalPoints();
    }

    /**
     * Check if quiz has questions
     */
    public boolean hasQuestions() {
        return getQuestionCount() > 0;
    }

    /**
     * Check if quiz is ready to be taken (has questions and valid config)
     */
    public boolean isReadyToTake() {
        return hasQuestions() && totalPoints != null && totalPoints > 0;
    }

    /**
     * Get passing score percentage
     */
    public Double getPassingPercentage() {
        if (passingScore == null || totalPoints == null || totalPoints == 0) {
            return null;
        }
        return (passingScore / totalPoints) * 100;
    }

    /**
     * Check if quiz belongs to specific lesson
     */
    public boolean belongsToLesson(Long lessonId) {
        return lesson != null && lesson.getId().equals(lessonId);
    }

    /**
     * Check if quiz has unlimited attempts
     */
    public boolean hasUnlimitedAttempts() {
        return maxAttempts == null;
    }

    /**
     * Check if quiz has a start date
     */
    public boolean hasStartDate() {
        return startDate != null;
    }

    /**
     * Check if quiz has an end date
     */
    public boolean hasEndDate() {
        return endDate != null;
    }

    /**
     * Check if quiz is currently available (within time window)
     */
    public boolean isAvailable() {
        Instant now = Instant.now();

        // If start date is set and current time is before start date
        if (startDate != null && now.isBefore(startDate)) {
            return false;
        }

        // If end date is set and current time is after end date
        if (endDate != null && now.isAfter(endDate)) {
            return false;
        }

        return true;
    }

    /**
     * Check if quiz has not started yet
     */
    public boolean isNotStarted() {
        return startDate != null && Instant.now().isBefore(startDate);
    }

    /**
     * Check if quiz has ended
     */
    public boolean isEnded() {
        return endDate != null && Instant.now().isAfter(endDate);
    }

    /**
     * Check if quiz is currently in progress (started but not ended)
     */
    public boolean isInProgress() {
        Instant now = Instant.now();
        boolean started = startDate == null || now.isAfter(startDate) || now.equals(startDate);
        boolean notEnded = endDate == null || now.isBefore(endDate);
        return started && notEnded;
    }

    /**
     * Get availability message for display
     */
    public String getAvailabilityMessage() {
        if (isNotStarted()) {
            return "Quiz will be available starting from " + startDate;
        }
        if (isEnded()) {
            return "Quiz ended on " + endDate;
        }
        if (endDate != null) {
            return "Quiz is available until " + endDate;
        }
        return "Quiz is available";
    }
}
