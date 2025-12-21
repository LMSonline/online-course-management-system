package vn.uit.lms.core.domain.community.report;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import vn.uit.lms.core.domain.Account;
import vn.uit.lms.core.domain.community.comment.Comment;
import vn.uit.lms.core.domain.course.Course;
import vn.uit.lms.core.domain.course.content.Lesson;
import vn.uit.lms.shared.constant.ViolationReportStatus;
import vn.uit.lms.shared.entity.BaseEntity;
@Entity
@Getter
@Setter
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

    @Column(name = "report_type")
    private String reportType;


    @Column(name = "description" , columnDefinition = "TEXT")
    private String description;


    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private ViolationReportStatus status = ViolationReportStatus.PENDING;
}
