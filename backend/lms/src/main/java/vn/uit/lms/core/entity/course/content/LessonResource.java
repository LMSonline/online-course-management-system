package vn.uit.lms.core.entity.course.content;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import vn.uit.lms.shared.constant.ResourceType;
import vn.uit.lms.shared.entity.BaseEntity;

@Entity
@Table(name = "lesson_resources")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonResource extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "file_id")
    private FileStorage file;

    @Column(name = "title")
    private String title;

    @Column(name = "url", columnDefinition = "TEXT")
    private String url;

    @Enumerated(EnumType.STRING)
    @Column(name = "resource_type", length = 20)
    private ResourceType resourceType = ResourceType.FILE;
}
