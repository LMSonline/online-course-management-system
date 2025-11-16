package vn.uit.lms.core.entity.course;

import jakarta.persistence.*;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Table;
import lombok.*;
import org.hibernate.annotations.*;
import vn.uit.lms.core.entity.Teacher;
import vn.uit.lms.shared.constant.Difficulty;
import vn.uit.lms.shared.entity.BaseEntity;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SQLDelete(sql = "UPDATE courses SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
public class Course extends BaseEntity {

    @Column(nullable = false, length = 255)
    private String title;

    @Column(name = "short_description", length = 1024)
    private String shortDescription;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;

    @Enumerated(EnumType.STRING)
    private Difficulty difficulty = Difficulty.BEGINNER;

    @Column(name = "is_closed")
    private Boolean isClosed = false;


    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    private List<CourseVersion> versions = new ArrayList<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    private List<CourseTag> courseTags = new ArrayList<>();

    //support for SEO
    @Column(nullable = false, unique = true)
    private String slug;

    @Column(name = "meta_title", length = 255)
    private String metaTitle;

    @Column(name = "meta_description", columnDefinition = "TEXT")
    private String metaDescription;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    private String seoKeywords;

    private String canonicalUrl;

    private boolean isIndexed = true;
}
