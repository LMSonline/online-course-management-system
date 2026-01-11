package vn.uit.lms.core.domain.assessment;

import jakarta.persistence.*;
import lombok.*;
import vn.uit.lms.shared.entity.BaseEntity;

@Entity
@Table(name = "answer_options")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class AnswerOption extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "is_correct", nullable = false)
    private boolean isCorrect;

    @Column(name = "order_index")
    private Integer orderIndex;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;

    /**
     * Check if this option is correct answer
     */
    public boolean isCorrectAnswer() {
        return this.isCorrect;
    }

    /**
     * Validate answer option
     */
    public void validate() {
        if (content == null || content.isBlank()) {
            throw new IllegalStateException("Answer option content is required");
        }
        if (orderIndex != null && orderIndex < 0) {
            throw new IllegalStateException("Order index cannot be negative");
        }
    }

    /**
     * Check if this option belongs to a specific question
     */
    public boolean belongsToQuestion(Long questionId) {
        return this.question != null && this.question.getId().equals(questionId);
    }

    /**
     * Mark this option as correct
     */
    public void markAsCorrect() {
        this.isCorrect = true;
    }

    /**
     * Mark this option as incorrect
     */
    public void markAsIncorrect() {
        this.isCorrect = false;
    }
}
