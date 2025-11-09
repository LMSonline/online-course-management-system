package vn.uit.lms.core.entity.course;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.*;
import org.hibernate.annotations.*;
import vn.uit.lms.shared.constant.CourseStatus;
import vn.uit.lms.shared.entity.BaseEntity;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "course_version",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"course_id","version_number"})})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SQLDelete(sql = "UPDATE course_version SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
public class CourseVersion extends BaseEntity {

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "course_id")
    private Course course;

    @Column(nullable = false)
    private Integer versionNumber = 1;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private BigDecimal price = BigDecimal.ZERO;

    private Integer durationDays = 0;

    private Float passScore = 8.0f;

    private Float finalWeight = 0.6f;

    private Integer minProgressPct = 0;

    @Enumerated(EnumType.STRING)
    private CourseStatus status = CourseStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private Long approvedBy;
    private Instant approvedAt;
    private Instant publishedAt;
}
