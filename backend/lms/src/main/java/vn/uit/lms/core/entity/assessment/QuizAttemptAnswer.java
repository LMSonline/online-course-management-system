package vn.uit.lms.core.entity.assessment;

import jakarta.persistence.*;
import lombok.*;
import vn.uit.lms.shared.entity.BaseEntity;

@Entity
@Table(name = "quiz_attempt_answers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class QuizAttemptAnswer extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_attempt_id")
    private QuizAttempt quizAttempt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "selected_option_id")
    private AnswerOption selectedOption;

    @Column(name = "answer_text", columnDefinition = "TEXT")
    private String answerText;

    @Column(name = "selected_option_ids", columnDefinition = "TEXT")
    private String selectedOptionIds; // JSON array of IDs

    private Double score;

    private Boolean graded;
}
