package vn.uit.lms.core.domain.assignment;

import jakarta.persistence.*;
import lombok.*;
import vn.uit.lms.core.domain.Account;
import vn.uit.lms.core.domain.Student;
import vn.uit.lms.shared.constant.SubmissionStatus;
import vn.uit.lms.shared.entity.BaseEntity;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "submissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class Submission extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id")
    private Assignment assignment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;

    @Column(name = "submitted_at")
    @Builder.Default
    private Instant submittedAt = Instant.now();

    @Column(columnDefinition = "TEXT")
    private String content;

    private Double score;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "graded_by")
    private Account gradedBy;

    @Column(name = "graded_at")
    private Instant gradedAt;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @Column(name = "attempt_number")
    @Builder.Default
    private Integer attemptNumber = 1;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private SubmissionStatus status = SubmissionStatus.PENDING;

    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SubmissionFile> files;

    /**
     * Check if submission has been graded
     */
    public boolean isGraded() {
        return status == SubmissionStatus.GRADED;
    }

    /**
     * Check if submission is pending
     */
    public boolean isPending() {
        return status == SubmissionStatus.PENDING;
    }

    /**
     * Check if submission is rejected
     */
    public boolean isRejected() {
        return status == SubmissionStatus.REJECTED;
    }

    /**
     * Check if submission was late
     */
    public boolean isLate() {
        if (assignment == null || !assignment.hasDueDate()) {
            return false;
        }
        return submittedAt != null && submittedAt.isAfter(assignment.getDueDate());
    }

    /**
     * Grade the submission
     */
    public void grade(Double score, Account gradedBy, String feedback) {
        validateScore(score);
        this.score = score;
        this.gradedBy = gradedBy;
        this.gradedAt = Instant.now();
        this.feedback = feedback;
        this.status = SubmissionStatus.GRADED;
    }

    /**
     * Reject the submission
     */
    public void reject(String feedback) {
        this.feedback = feedback;
        this.status = SubmissionStatus.REJECTED;
    }

    /**
     * Add feedback without grading
     */
    public void addFeedback(String feedback) {
        this.feedback = feedback;
    }

    /**
     * Validate submission score
     */
    private void validateScore(Double score) {
        if (score == null) {
            throw new IllegalArgumentException("Score cannot be null");
        }
        if (score < 0) {
            throw new IllegalArgumentException("Score cannot be negative");
        }
        if (assignment != null && assignment.getTotalPoints() != null && score > assignment.getTotalPoints()) {
            throw new IllegalArgumentException("Score cannot exceed total points: " + assignment.getTotalPoints());
        }
    }

    /**
     * Check if submission can be edited (deleted/modified)
     */
    public boolean canBeEdited() {
        return isPending();
    }

    /**
     * Check if submission passed (score >= 60% of total points)
     */
    public boolean isPassing() {
        if (!isGraded() || score == null || assignment == null || assignment.getTotalPoints() == null) {
            return false;
        }
        double passingThreshold = assignment.getTotalPoints() * 0.6;
        return score >= passingThreshold;
    }

    /**
     * Get score percentage
     */
    public Double getScorePercentage() {
        if (score == null || assignment == null || assignment.getTotalPoints() == null || assignment.getTotalPoints() == 0) {
            return null;
        }
        return (score / assignment.getTotalPoints()) * 100;
    }

    /**
     * Validate submission before save
     */
    public void validate() {
        if (assignment == null) {
            throw new IllegalStateException("Assignment is required");
        }
        if (student == null) {
            throw new IllegalStateException("Student is required");
        }
        if (score != null) {
            validateScore(score);
        }
    }
}
