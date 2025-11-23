package vn.uit.lms.core.entity.course;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import vn.uit.lms.core.entity.Student;
import vn.uit.lms.shared.entity.BaseEntity;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
        name = "course_review",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"course_id", "student_id"})
        }
)
public class CourseReview extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;


    @Column(nullable = false)
    private Byte rating; // 1–5

    @Column(length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

}
