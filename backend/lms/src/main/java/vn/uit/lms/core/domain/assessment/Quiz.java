package vn.uit.lms.core.domain.assessment;

import jakarta.persistence.*;
import lombok.*;
import vn.uit.lms.core.domain.course.content.Lesson;
import vn.uit.lms.shared.entity.BaseEntity;

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

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuizQuestion> quizQuestions;

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
}
