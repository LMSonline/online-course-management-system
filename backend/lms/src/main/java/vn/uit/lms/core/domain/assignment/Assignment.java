package vn.uit.lms.core.domain.assignment;

import jakarta.persistence.*;
import lombok.*;
import vn.uit.lms.core.domain.course.content.Lesson;
import vn.uit.lms.shared.constant.AssignmentType;
import vn.uit.lms.shared.entity.BaseEntity;

import java.util.List;

@Entity
@Table(name = "assignments")
@Data
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

    @OneToMany(mappedBy = "assignment", cascade = CascadeType.ALL)
    private List<Submission> submissions;
}
