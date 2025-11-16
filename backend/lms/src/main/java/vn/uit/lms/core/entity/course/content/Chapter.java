package vn.uit.lms.core.entity.course.content;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import vn.uit.lms.core.entity.course.CourseVersion;
import vn.uit.lms.shared.entity.BaseEntity;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "chapters")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SQLDelete(sql = "UPDATE chapters SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
public class Chapter extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_version_id", nullable = false)
    private CourseVersion courseVersion;

    @Column(nullable = false)
    private String title;

    @Column(name = "order_index")
    private Integer orderIndex = 0;

    @OneToMany(mappedBy = "chapter", cascade = CascadeType.ALL)
    private List<Lesson> lessons = new ArrayList<>();
}
