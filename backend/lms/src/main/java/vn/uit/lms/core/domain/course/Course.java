package vn.uit.lms.core.domain.course;

import jakarta.persistence.*;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Table;
import lombok.*;
import org.hibernate.annotations.*;
import vn.uit.lms.core.domain.Teacher;
import vn.uit.lms.shared.constant.CourseStatus;
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

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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
    @Builder.Default
    private Difficulty difficulty = Difficulty.BEGINNER;

    @Column(name = "is_closed")
    @Builder.Default
    private Boolean isClosed = false;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CourseVersion> versions = new ArrayList<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
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

    @Column(name = "thumbnail_public_id")
    private String thumbnailPublicId;

    private String seoKeywords;

    private String canonicalUrl;

    @Builder.Default
    private boolean isIndexed = true;

    public void addVersion(CourseVersion version) {
        version.setCourse(this);
        this.versions.add(version);
    }

    public CourseVersion getLastVersion() {
        return this.versions.stream()
                .max((v1, v2) -> v1.getVersionNumber().compareTo(v2.getVersionNumber()))
                .orElse(null);
    }

    /**
     * Get the currently published version (latest one)
     * Returns the most recently published version based on publishedAt timestamp
     */
    public CourseVersion getVersionPublish(){
        return this.versions.stream()
                .filter(version -> version.getStatus() == CourseStatus.PUBLISHED)
                .filter(version -> version.getPublishedAt() != null)
                .max(java.util.Comparator.comparing(CourseVersion::getPublishedAt))
                .orElse(null);
    }



}
