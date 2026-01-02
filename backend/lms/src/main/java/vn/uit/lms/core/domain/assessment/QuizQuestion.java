package vn.uit.lms.core.domain.assessment;

import jakarta.persistence.*;
import lombok.*;
import vn.uit.lms.shared.entity.BaseEntity;

@Entity
@Table(name = "quiz_questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class QuizQuestion extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;

    @Column(name = "points")
    private Double points;

    @Column(name = "order_index")
    private Integer orderIndex;

    /**
     * Validate quiz question
     */
    public void validate() {
        if (quiz == null) {
            throw new IllegalStateException("Quiz is required");
        }
        if (question == null) {
            throw new IllegalStateException("Question is required");
        }
        if (points != null && points < 0) {
            throw new IllegalStateException("Points cannot be negative");
        }
        if (orderIndex != null && orderIndex < 0) {
            throw new IllegalStateException("Order index cannot be negative");
        }
    }

    /**
     * Get effective points (use quiz question points or question max points)
     */
    public Double getEffectivePoints() {
        if (points != null) {
            return points;
        }
        return question != null ? question.getMaxPoints() : 0.0;
    }

    /**
     * Check if question belongs to specific quiz
     */
    public boolean belongsToQuiz(Long quizId) {
        return quiz != null && quiz.getId().equals(quizId);
    }

    /**
     * Check if this is a custom scored question (overrides question's max points)
     */
    public boolean hasCustomPoints() {
        return points != null;
    }

    /**
     * Set custom points for this question in the quiz
     */
    public void setCustomPoints(Double customPoints) {
        if (customPoints != null && customPoints < 0) {
            throw new IllegalArgumentException("Custom points cannot be negative");
        }
        this.points = customPoints;
    }
}
