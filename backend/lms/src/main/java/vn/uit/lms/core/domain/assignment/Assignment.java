package vn.uit.lms.core.domain.assignment;

import jakarta.persistence.*;
import lombok.*;
import vn.uit.lms.core.domain.course.content.Lesson;
import vn.uit.lms.shared.constant.AssignmentType;
import vn.uit.lms.shared.entity.BaseEntity;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "assignments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class Assignment extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "assignment_type", nullable = false)
    @Builder.Default
    private AssignmentType assignmentType = AssignmentType.PRACTICE;

    @Column(name = "total_points")
    @Builder.Default
    private Integer totalPoints = 10;

    @Column(name = "time_limit_minutes")
    private Integer timeLimitMinutes;

    @Column(name = "max_attempts")
    @Builder.Default
    private Integer maxAttempts = 1;

    @Column(name = "due_date")
    private Instant dueDate;

    @OneToMany(mappedBy = "assignment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Submission> submissions;

    /**
     * Check if assignment has a due date
     */
    public boolean hasDueDate() {
        return dueDate != null;
    }

    /**
     * Check if assignment is past due
     */
    public boolean isPastDue() {
        return hasDueDate() && Instant.now().isAfter(dueDate);
    }

    /**
     * Check if assignment has time limit
     */
    public boolean hasTimeLimit() {
        return timeLimitMinutes != null && timeLimitMinutes > 0;
    }

    /**
     * Check if assignment allows multiple attempts
     */
    public boolean allowsMultipleAttempts() {
        return maxAttempts != null && maxAttempts > 1;
    }

    /**
     * Validate assignment configuration
     */
    public void validate() {
        if (title == null || title.isBlank()) {
            throw new IllegalStateException("Assignment title is required");
        }
        if (assignmentType == null) {
            throw new IllegalStateException("Assignment type is required");
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
    }

    /**
     * Check if a student can submit based on their attempt count
     */
    public boolean canSubmit(int currentAttempts) {
        if (isPastDue()) {
            return false;
        }
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
     * Check if assignment is graded type (not practice)
     */
    public boolean isGraded() {
        return assignmentType != AssignmentType.PRACTICE;
    }

    /**
     * Check if assignment is practice type
     */
    public boolean isPractice() {
        return assignmentType == AssignmentType.PRACTICE;
    }

    /**
     * Check if assignment belongs to a specific lesson
     */
    public boolean belongsToLesson(Long lessonId) {
        return lesson != null && lesson.getId().equals(lessonId);
    }

    /**
     * Get number of submissions
     */
    public int getSubmissionCount() {
        return submissions != null ? submissions.size() : 0;
    }

    /**
     * Check if assignment has unlimited attempts
     */
    public boolean hasUnlimitedAttempts() {
        return maxAttempts == null;
    }

    /**
     * Add submission to assignment
     */
    public void addSubmission(Submission submission) {
        if (submissions == null) {
            submissions = new java.util.ArrayList<>();
        }
        submission.setAssignment(this);
        submissions.add(submission);
    }
}
