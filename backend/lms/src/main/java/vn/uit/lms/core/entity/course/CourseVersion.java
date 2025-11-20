package vn.uit.lms.core.entity.course;

import jakarta.persistence.*;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Table;
import lombok.*;
import org.hibernate.annotations.*;
import vn.uit.lms.core.entity.course.content.Chapter;
import vn.uit.lms.shared.constant.CourseStatus;
import vn.uit.lms.shared.entity.BaseEntity;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "course_versions",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"course_id","version_number"})})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SQLDelete(sql = "UPDATE course_versions SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
public class CourseVersion extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "version_number", nullable = false)
    private Integer versionNumber = 1;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(precision = 12, scale = 2)
    private BigDecimal price = BigDecimal.ZERO;

    @Column(name = "duration_days")
    private int durationDays = 0;

    @Column(name = "pass_score")
    private Float passScore = 8.0f;

    @Column(name = "final_weight")
    private Float finalWeight = 0.6f;

    @Column(name = "min_progress_pct")
    private Integer minProgressPct = 0;

    @Enumerated(EnumType.STRING)
    private CourseStatus status = CourseStatus.DRAFT;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "approved_by")
    private Long approvedBy;

    @Column(name = "approved_at")
    private Instant approvedAt;

    @Column(name = "published_at")
    private Instant publishedAt;

    @OneToMany(mappedBy = "courseVersion", cascade = CascadeType.ALL)
    private List<Chapter> chapters = new ArrayList<>();
}
