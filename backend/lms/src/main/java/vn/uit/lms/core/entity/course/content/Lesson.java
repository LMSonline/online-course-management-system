package vn.uit.lms.core.entity.course.content;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;
import vn.uit.lms.shared.constant.LessonType;
import vn.uit.lms.shared.entity.BaseEntity;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "lessons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lesson extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chapter_id", nullable = false)
    private Chapter chapter;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private LessonType type;

    @Column(nullable = false)
    private String title;

    @Column(name = "short_description", length = 1024)
    private String shortDescription;

    @Column(name = "content_url", columnDefinition = "TEXT")
    private String contentUrl;

    @Column(name = "duration_seconds")
    private Integer durationSeconds = 0;

    @Column(name = "order_index")
    private Integer orderIndex = 0;

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL)
    private List<LessonResource> resources = new ArrayList<>();
}
