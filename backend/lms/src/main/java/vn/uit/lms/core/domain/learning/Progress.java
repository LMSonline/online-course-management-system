package vn.uit.lms.core.domain.learning;

import jakarta.persistence.*;
import lombok.*;
import vn.uit.lms.core.domain.Student;
import vn.uit.lms.core.domain.course.Course;
import vn.uit.lms.core.domain.course.CourseVersion;
import vn.uit.lms.core.domain.course.content.Lesson;
import vn.uit.lms.shared.constant.ProgressStatus;
import vn.uit.lms.shared.entity.BaseEntity;

import java.time.Instant;

@Entity
@Table(
        name = "progress",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_progress_student_lesson_version",
                        columnNames = {"student_id", "lesson_id", "course_version_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Progress extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_version_id", nullable = false)
    private CourseVersion courseVersion;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private ProgressStatus status = ProgressStatus.NOT_VIEWED;

    @Column(name = "viewed_at")
    private Instant viewedAt;

    @Column(name = "times_viewed", nullable = false)
    @Builder.Default
    private Integer timesViewed = 0;

    @Column(name = "watched_duration_seconds")
    private Integer watchedDurationSeconds;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "is_bookmarked", nullable = false)
    @Builder.Default
    private Boolean isBookmarked = false;

    /* ================= DOMAIN ================= */

    public void markAsViewed() {
        if (this.status == ProgressStatus.NOT_VIEWED) {
            this.status = ProgressStatus.VIEWED;
            this.timesViewed++;
            this.viewedAt = Instant.now();
        }
    }

    public void markAsCompleted() {
        if (this.status == ProgressStatus.COMPLETED) return;

        this.status = ProgressStatus.COMPLETED;
        this.completedAt = Instant.now();

        if (this.viewedAt == null) {
            this.viewedAt = Instant.now();
        }

        if (this.timesViewed == 0) {
            this.timesViewed = 1;
        }
    }

    public void updateWatchedDuration(int seconds) {
        this.watchedDurationSeconds = seconds;

        if (this.lesson == null || this.lesson.getDurationSeconds() == null) {
            markAsViewed();
            return;
        }

        int total = this.lesson.getDurationSeconds();
        if (total > 0 && seconds >= total * 0.9) {
            markAsCompleted();
        } else {
            markAsViewed();
        }
    }

    public void reset() {
        this.status = ProgressStatus.NOT_VIEWED;
        this.viewedAt = null;
        this.completedAt = null;
        this.timesViewed = 0;
        this.watchedDurationSeconds = 0;
    }

    public boolean isCompleted() {
        return this.status == ProgressStatus.COMPLETED;
    }

    public Float getWatchedPercentage() {
        if (this.lesson == null || this.lesson.getDurationSeconds() == null
                || this.watchedDurationSeconds == null) {
            return null;
        }

        int total = this.lesson.getDurationSeconds();
        if (total == 0) return 0.0f;

        return Math.min(
                100.0f,
                (this.watchedDurationSeconds * 100.0f) / total
        );
    }
}
