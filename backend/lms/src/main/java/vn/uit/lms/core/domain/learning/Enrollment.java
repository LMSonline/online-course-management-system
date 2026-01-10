package vn.uit.lms.core.domain.learning;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.type.SqlTypes;
import vn.uit.lms.core.domain.Student;
import vn.uit.lms.core.domain.course.Course;
import vn.uit.lms.core.domain.course.CourseVersion;
import vn.uit.lms.shared.constant.EnrollmentStatus;
import vn.uit.lms.shared.entity.BaseEntity;

import java.time.Instant;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;

@Entity
@Table(
        name = "enrollments",
        indexes = {
                @Index(name = "idx_enrollment_student", columnList = "student_id"),
                @Index(name = "idx_enrollment_course", columnList = "course_id"),
                @Index(name = "idx_enrollment_version", columnList = "course_version_id"),
                @Index(name = "idx_enrollment_status", columnList = "status"),
                @Index(name = "idx_enrollment_dates", columnList = "enrolled_at, end_at")
        },
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_enrollment_student_version",
                        columnNames = {"student_id", "course_version_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SQLDelete(sql = "UPDATE enrollments SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
public class Enrollment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_version_id", nullable = false)
    private CourseVersion courseVersion;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private EnrollmentStatus status = EnrollmentStatus.ENROLLED;

    @Column(name = "enrolled_at", nullable = false)
    @Builder.Default
    private Instant enrolledAt = Instant.now();

    @Column(name = "start_at")
    private Instant startAt;

    @Column(name = "end_at")
    private Instant endAt;

    @Column(name = "certificate_issued", nullable = false)
    @Builder.Default
    private Boolean certificateIssued = false;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "certificate_id")
    private Certificate certificate;

    @Column(name = "average_score")
    private Float averageScore;

    @Column(name = "completion_percentage")
    @Builder.Default
    private Float completionPercentage = 0.0f;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Column(name = "cancellation_reason", columnDefinition = "TEXT")
    private String cancellationReason;

    @Column(name = "cancelled_at")
    private Instant cancelledAt;

    /**
     * List of quiz scores for calculating average
     * Format: [{quizId: 1, score: 8.5, isFinalExam: false}, ...]
     */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "quiz_scores", columnDefinition = "JSON")
    private List<Map<String, Object>> quizScores;

    /**
     * Final exam score
     */
    @Column(name = "final_exam_score")
    private Float finalExamScore;

    /**
     * Final exam weight (k factor)
     */
    @Column(name = "final_exam_weight")
    private Float finalExamWeight;

    /**
     * Ban reason if kicked from course
     */
    @Column(name = "ban_reason", columnDefinition = "TEXT")
    private String banReason;

    /**
     * Banned at timestamp
     */
    @Column(name = "banned_at")
    private Instant bannedAt;


    public void start() {
        if (this.startAt != null) return;

        this.startAt = Instant.now();

        if (this.courseVersion != null && this.courseVersion.getDurationDays() > 0) {
            this.endAt = this.startAt
                    .atZone(ZoneId.systemDefault())
                    .plusDays(this.courseVersion.getDurationDays())
                    .toInstant();
        }
    }

    public boolean canComplete() {
        if (this.status != EnrollmentStatus.ENROLLED || this.courseVersion == null) {
            return false;
        }

        Float passScore = this.courseVersion.getPassScore();
        Integer minProgress = this.courseVersion.getMinProgressPct();

        boolean scorePass = passScore == null
                || (this.averageScore != null && this.averageScore >= passScore);

        boolean progressPass = minProgress == null
                || (this.completionPercentage != null && this.completionPercentage >= minProgress);

        return scorePass && progressPass;
    }

    public void complete() {
        if (!canComplete()) {
            throw new IllegalStateException("Cannot complete enrollment");
        }

        this.status = EnrollmentStatus.COMPLETED;
        this.completedAt = Instant.now();
    }

    public void issueCertificate(Certificate certificate) {
        if (this.status != EnrollmentStatus.COMPLETED) {
            throw new IllegalStateException("Enrollment not completed");
        }

        if (isExpired()) {
            throw new IllegalStateException("Enrollment expired");
        }

        this.certificate = certificate;
        this.certificateIssued = true;
    }

    public void cancel(String reason) {
        if (this.status == EnrollmentStatus.COMPLETED) {
            throw new IllegalStateException("Cannot cancel completed enrollment");
        }

        this.status = EnrollmentStatus.CANCELLED;
        this.cancellationReason = reason;
        this.cancelledAt = Instant.now();
    }

    public boolean isExpired() {
        return this.endAt != null && Instant.now().isAfter(this.endAt);
    }

    public void markAsExpired() {
        if (this.status == EnrollmentStatus.ENROLLED) {
            this.status = EnrollmentStatus.EXPIRED;
        }
    }

    public void updateProgress(float percentage) {
        if (this.status != EnrollmentStatus.ENROLLED) return;

        if (percentage < 0 || percentage > 100) {
            throw new IllegalArgumentException("Progress must be 0–100");
        }

        this.completionPercentage = percentage;

        if (canComplete()) {
            complete();
        }
    }

    public void updateAverageScore(float score) {
        if (this.status != EnrollmentStatus.ENROLLED) return;

        if (score < 0 || score > 10) {
            throw new IllegalArgumentException("Score must be 0–10");
        }

        this.averageScore = score;

        if (canComplete()) {
            complete();
        }
    }

    public boolean isActive() {
        return this.status == EnrollmentStatus.ENROLLED && !isExpired();
    }

    public boolean canTakeFinalExam() {
        if (this.courseVersion == null) return false;

        Integer minProgress = this.courseVersion.getMinProgressPct();
        return minProgress == null
                || (this.completionPercentage != null && this.completionPercentage >= minProgress);
    }

    /**
     * Kick student from course (Ban)
     *
     * @param reason Ban reason
     */
    public void kick(String reason) {
        if (this.status == EnrollmentStatus.COMPLETED) {
            throw new IllegalStateException("Cannot kick student who completed the course");
        }

        this.status = EnrollmentStatus.CANCELLED;
        this.banReason = reason;
        this.bannedAt = Instant.now();
    }

    /**
     * Add quiz score to enrollment
     *
     * @param quizId Quiz ID
     * @param score Score (0-10)
     * @param isFinalExam Is this the final exam
     */
    public void addQuizScore(Long quizId, Float score, boolean isFinalExam) {
        if (score < 0 || score > 10) {
            throw new IllegalArgumentException("Score must be between 0 and 10");
        }

        if (this.quizScores == null) {
            this.quizScores = new java.util.ArrayList<>();
        }

        Map<String, Object> quizScore = new java.util.HashMap<>();
        quizScore.put("quizId", quizId);
        quizScore.put("score", score);
        quizScore.put("isFinalExam", isFinalExam);
        quizScore.put("timestamp", java.time.Instant.now().toString());

        this.quizScores.add(quizScore);

        if (isFinalExam) {
            this.finalExamScore = score;
        }

        // Recalculate average score
        calculateAverageScore();
    }

    /**
     * Calculate average score using formula:
     * DTB = (Σ DKTBT_i + DKTCK × k) / (n + k)
     *
     * Where:
     * - DKTBT_i: Score of regular quiz i
     * - DKTCK: Final exam score
     * - k: Final exam weight
     * - n: Number of regular quizzes
     */
    public void calculateAverageScore() {
        if (this.quizScores == null || this.quizScores.isEmpty()) {
            this.averageScore = null;
            return;
        }

        // Get final exam weight from course version
        Float k = this.finalExamWeight;
        if (k == null && this.courseVersion != null) {
            k = this.courseVersion.getFinalWeight();
        }
        if (k == null) {
            k = 0.6f; // Default weight
        }

        // Separate regular quizzes and final exam
        List<Float> regularScores = new java.util.ArrayList<>();
        Float finalExamScore = null;

        for (Map<String, Object> quizScore : this.quizScores) {
            Float score = ((Number) quizScore.get("score")).floatValue();
            Boolean isFinalExam = (Boolean) quizScore.getOrDefault("isFinalExam", false);

            if (Boolean.TRUE.equals(isFinalExam)) {
                finalExamScore = score;
            } else {
                regularScores.add(score);
            }
        }

        // Calculate DTB
        float sumRegular = (float) regularScores.stream()
                .mapToDouble(Float::doubleValue)
                .sum();

        int n = regularScores.size();

        if (finalExamScore != null) {
            // DTB = (Σ DKTBT_i + DKTCK × k) / (n + k)
            this.averageScore = (sumRegular + (finalExamScore * k)) / (n + k);
        } else {
            // No final exam yet, only regular quizzes
            this.averageScore = n > 0 ? sumRegular / n : 0f;
        }

        // Check if can complete
        if (canComplete()) {
            complete();
        }
    }

    /**
     * Check if eligible for certificate
     *
     * @return true if student can receive certificate
     */
    public boolean isEligibleForCertificate() {
        if (this.status != EnrollmentStatus.COMPLETED) {
            return false;
        }

        if (isExpired()) {
            return false;
        }

        if (this.courseVersion == null) {
            return false;
        }

        Float passScore = this.courseVersion.getPassScore();
        if (passScore == null) {
            return true; // No pass score requirement
        }

        return this.averageScore != null && this.averageScore >= passScore;
    }

    public Long getRemainingDays() {
        if (this.endAt == null) return null;

        long seconds = this.endAt.getEpochSecond() - Instant.now().getEpochSecond();
        return Math.max(0, seconds / (24 * 3600));
    }
}

