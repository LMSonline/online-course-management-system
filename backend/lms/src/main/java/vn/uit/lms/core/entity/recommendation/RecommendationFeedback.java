package vn.uit.lms.core.entity.recommendation;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
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

    @Column(columnDefinition = "JSON")
    private String metadata;

    private java.time.LocalDateTime createdAt;
}
