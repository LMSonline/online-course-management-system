package vn.uit.lms.core.domain.community.report;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import vn.uit.lms.core.domain.Account;
import vn.uit.lms.core.domain.community.comment.Comment;
import vn.uit.lms.core.domain.course.Course;
import vn.uit.lms.core.domain.course.content.Lesson;
import vn.uit.lms.shared.constant.ViolationReportStatus;
import vn.uit.lms.shared.entity.BaseEntity;
import vn.uit.lms.shared.exception.InvalidRequestException;

import java.time.Instant;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "violation_report")
@SQLDelete(sql = "UPDATE violation_report SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class ViolationReport extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "reporter_account_id")
    private Account reporter;

    @ManyToOne
    @JoinColumn(name = "target_account_id")
    private Account target;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    @ManyToOne
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    @ManyToOne
    @JoinColumn(name = "comment_id")
    private Comment comment;

    @Column(name = "report_type", nullable = false)
    private String reportType;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private ViolationReportStatus status = ViolationReportStatus.PENDING;

    @Column(name = "admin_note", columnDefinition = "TEXT")
    private String adminNote;

    @ManyToOne
    @JoinColumn(name = "reviewed_by_account_id")
    private Account reviewedBy;

    @Column(name = "reviewed_at")
    private Instant reviewedAt;

    @Column(name = "action_taken", length = 100)
    private String actionTaken;

    /**
     * Factory method: Create a violation report
     */
    public static ViolationReport create(Account reporter, String reportType, String description) {
        if (reporter == null) {
            throw new InvalidRequestException("Reporter cannot be null");
        }
        if (reportType == null || reportType.isBlank()) {
            throw new InvalidRequestException("Report type cannot be empty");
        }
        if (description == null || description.isBlank()) {
            throw new InvalidRequestException("Description cannot be empty");
        }

        ViolationReport report = new ViolationReport();
        report.reporter = reporter;
        report.reportType = reportType.trim();
        report.description = description.trim();
        report.status = ViolationReportStatus.PENDING;
        return report;
    }

    /**
     * Set the target account being reported
     */
    public void setTargetAccount(Account target) {
        this.target = target;
    }

    /**
     * Set the course being reported
     */
    public void setTargetCourse(Course course) {
        this.course = course;
    }

    /**
     * Set the lesson being reported
     */
    public void setTargetLesson(Lesson lesson) {
        this.lesson = lesson;
    }

    /**
     * Set the comment being reported
     */
    public void setTargetComment(Comment comment) {
        this.comment = comment;
    }

    /**
     * Move report to IN_REVIEW status
     */
    public void startReview(Account reviewer, String note) {
        if (reviewer == null) {
            throw new InvalidRequestException("Reviewer cannot be null");
        }
        if (this.status != ViolationReportStatus.PENDING) {
            throw new InvalidRequestException("Only pending reports can be reviewed");
        }

        this.status = ViolationReportStatus.IN_REVIEW;
        this.reviewedBy = reviewer;
        this.reviewedAt = Instant.now();
        this.adminNote = note;
    }

    /**
     * Dismiss the report as invalid
     */
    public void dismiss(Account reviewer, String reason) {
        if (reviewer == null) {
            throw new InvalidRequestException("Reviewer cannot be null");
        }
        if (this.status == ViolationReportStatus.DISMISSED ||
            this.status == ViolationReportStatus.ACTION_TAKEN) {
            throw new InvalidRequestException("Report already closed");
        }

        this.status = ViolationReportStatus.DISMISSED;
        this.reviewedBy = reviewer;
        this.reviewedAt = Instant.now();
        this.adminNote = reason;
    }

    /**
     * Mark action as taken on this report
     */
    public void takeAction(Account reviewer, String action, String note) {
        if (reviewer == null) {
            throw new InvalidRequestException("Reviewer cannot be null");
        }
        if (action == null || action.isBlank()) {
            throw new InvalidRequestException("Action cannot be empty");
        }
        if (this.status == ViolationReportStatus.DISMISSED) {
            throw new InvalidRequestException("Cannot take action on dismissed report");
        }
        if (this.status == ViolationReportStatus.ACTION_TAKEN) {
            throw new InvalidRequestException("Action already taken on this report");
        }

        this.status = ViolationReportStatus.ACTION_TAKEN;
        this.actionTaken = action;
        this.reviewedBy = reviewer;
        this.reviewedAt = Instant.now();
        this.adminNote = note;
    }

    /**
     * Check if report is closed (resolved)
     */
    public boolean isClosed() {
        return this.status == ViolationReportStatus.DISMISSED ||
               this.status == ViolationReportStatus.ACTION_TAKEN;
    }

    /**
     * Check if report is pending
     */
    public boolean isPending() {
        return this.status == ViolationReportStatus.PENDING;
    }

    /**
     * Check if report belongs to a specific reporter
     */
    public boolean isReportedBy(Account account) {
        return this.reporter != null && this.reporter.equals(account);
    }

    /**
     * Get the target type as a string
     */
    public String getTargetType() {
        if (comment != null) return "COMMENT";
        if (course != null) return "COURSE";
        if (lesson != null) return "LESSON";
        if (target != null) return "USER";
        return "UNKNOWN";
    }

    /**
     * Get the target ID as a string
     */
    public String getTargetId() {
        if (comment != null) return comment.getId().toString();
        if (course != null) return course.getId().toString();
        if (lesson != null) return lesson.getId().toString();
        if (target != null) return target.getId().toString();
        return null;
    }
}

