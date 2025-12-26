package vn.uit.lms.core.domain.assessment;

import jakarta.persistence.*;
import lombok.*;
import vn.uit.lms.core.domain.Student;
import vn.uit.lms.shared.constant.QuizAttemptStatus;
import vn.uit.lms.shared.entity.BaseEntity;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "quiz_attempts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class QuizAttempt extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;

    @Column(name = "started_at")
    private Instant startedAt;

    @Column(name = "finished_at")
    private Instant finishedAt;

    @Column(name = "total_score")
    private Double totalScore;

    @Column(name = "attempt_number")
    private Integer attemptNumber;

    @Enumerated(EnumType.STRING)
    private QuizAttemptStatus status;

    @Column(columnDefinition = "TEXT")
    private String metadata;

    @OneToMany(mappedBy = "quizAttempt", cascade = CascadeType.ALL)
    private List<QuizAttemptAnswer> answers;

    /**
     * Check if attempt is in progress
     */
    public boolean isInProgress() {
        return status == QuizAttemptStatus.IN_PROGRESS;
    }

    /**
     * Check if attempt is completed
     */
    public boolean isCompleted() {
        return status == QuizAttemptStatus.COMPLETED;
    }

    /**
     * Check if attempt is abandoned/cancelled
     */
    public boolean isAbandoned() {
        return status == QuizAttemptStatus.CANCELLED;
    }

    /**
     * Check if time limit has been exceeded
     */
    public boolean isTimeExceeded() {
        if (quiz == null || !quiz.hasTimeLimit() || startedAt == null) {
            return false;
        }
        
        Instant now = Instant.now();
        long minutesElapsed = Duration.between(startedAt, now).toMinutes();
        return minutesElapsed > quiz.getTimeLimitMinutes();
    }

    /**
     * Get remaining time in minutes
     */
    public long getRemainingTimeMinutes() {
        if (quiz == null || !quiz.hasTimeLimit() || startedAt == null) {
            return -1; // No time limit
        }

        Instant now = Instant.now();
        long minutesElapsed = Duration.between(startedAt, now).toMinutes();
        long remaining = quiz.getTimeLimitMinutes() - minutesElapsed;
        return Math.max(0, remaining);
    }

    /**
     * Get time spent in minutes
     */
    public long getTimeSpentMinutes() {
        if (startedAt == null) {
            return 0;
        }

        Instant endTime = finishedAt != null ? finishedAt : Instant.now();
        return Duration.between(startedAt, endTime).toMinutes();
    }

    /**
     * Start the attempt
     */
    public void start() {
        if (isInProgress() || isCompleted()) {
            throw new IllegalStateException("Cannot start an attempt that is already in progress or completed");
        }
        this.startedAt = Instant.now();
        this.status = QuizAttemptStatus.IN_PROGRESS;
    }

    /**
     * Finish the attempt
     */
    public void finish(Double totalScore) {
        if (!isInProgress()) {
            throw new IllegalStateException("Can only finish an attempt that is in progress");
        }
        this.finishedAt = Instant.now();
        this.totalScore = totalScore;
        this.status = QuizAttemptStatus.COMPLETED;
    }

    /**
     * Abandon the attempt (timeout or student gave up)
     */
    public void abandon() {
        if (isCompleted()) {
            throw new IllegalStateException("Cannot abandon a completed attempt");
        }
        this.status = QuizAttemptStatus.CANCELLED;
    }

    /**
     * Check if attempt passed based on quiz passing score
     */
    public boolean isPassing() {
        if (!isCompleted() || totalScore == null || quiz == null) {
            return false;
        }
        return quiz.isPassing(totalScore);
    }

    /**
     * Get score percentage
     */
    public Double getScorePercentage() {
        if (totalScore == null || quiz == null || quiz.getTotalPoints() == null || quiz.getTotalPoints() == 0) {
            return null;
        }
        return (totalScore / quiz.getTotalPoints()) * 100;
    }

    /**
     * Validate attempt before save
     */
    public void validate() {
        if (quiz == null) {
            throw new IllegalStateException("Quiz is required");
        }
        if (student == null) {
            throw new IllegalStateException("Student is required");
        }
        if (attemptNumber == null || attemptNumber < 1) {
            throw new IllegalStateException("Attempt number must be at least 1");
        }
    }
}
