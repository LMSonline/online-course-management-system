package vn.uit.lms.core.domain.recommendation;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import vn.uit.lms.shared.constant.FeedbackType;

@Getter
@Setter
@Entity
@Table(name = "recommendation_feedback")
public class RecommendationFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long recommendationId;
    private Long studentId;

    @Enumerated(EnumType.STRING)
    private FeedbackType feedbackType;

    @Column(name = "metadata")
    @JdbcTypeCode(SqlTypes.JSON)
    private String metadata;


    private java.time.LocalDateTime createdAt;
}
