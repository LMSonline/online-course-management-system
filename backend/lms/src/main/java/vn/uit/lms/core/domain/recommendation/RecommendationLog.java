package vn.uit.lms.core.domain.recommendation;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

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

    @Column(name = "context")
    @JdbcTypeCode(SqlTypes.JSON)
    private String context;


    private java.time.LocalDateTime createdAt;
}
