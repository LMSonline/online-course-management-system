package vn.uit.lms.core.entity.recommendation;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "recommendation_log")
public class RecommendationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long studentId;

    @Column(name = "recommended_course_id")
    private Long recommendedCourseId;

    private String algorithmVersion;
    private Float score;

    @Column(columnDefinition = "JSON")
    private String context;

    private java.time.LocalDateTime createdAt;
}
