package vn.uit.lms.core.domain.assessment;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import lombok.*;
import vn.uit.lms.shared.entity.BaseEntity;

import java.util.Arrays;
import java.util.List;

@Entity
@Table(name = "quiz_attempt_answers")
@Getter
@Setter
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

    @Builder.Default
    private Boolean graded = false;

    /**
     * Check if answer has been graded
     */
    public boolean isGraded() {
        return graded != null && graded;
    }

    /**
     * Check if answer is correct (for auto-graded questions)
     */
    public boolean isCorrect() {
        if (!isGraded() || score == null || question == null) {
            return false;
        }
        return score.equals(question.getMaxPoints());
    }

    /**
     * Auto-grade single choice answer
     */
    public void autoGradeSingleChoice() {
        if (question == null || !question.isSingleChoice()) {
            throw new IllegalStateException("Can only auto-grade single choice questions");
        }

        if (selectedOption == null) {
            this.score = 0.0;
        } else {
            this.score = question.calculateScore(selectedOption.getId());
        }

        this.graded = true;
    }

    /**
     * Auto-grade multiple choice answer
     */
    public void autoGradeMultipleChoice() {
        if (question == null || !question.isMultipleChoice()) {
            throw new IllegalStateException("Can only auto-grade multiple choice questions");
        }

        List<Long> selectedIds = parseSelectedOptionIds();
        if (selectedIds == null || selectedIds.isEmpty()) {
            this.score = 0.0;
        } else {
            this.score = question.calculateScoreForMultiple(selectedIds);
        }

        this.graded = true;
    }

    /**
     * Auto-grade true/false answer
     */
    public void autoGradeTrueFalse() {
        if (question == null || !question.isTrueFalse()) {
            throw new IllegalStateException("Can only auto-grade true/false questions");
        }

        if (selectedOption == null) {
            this.score = 0.0;
        } else {
            this.score = question.calculateScore(selectedOption.getId());
        }

        this.graded = true;
    }

    /**
     * Grade essay answer manually
     */
    public void gradeManually(Double score) {
        if (question == null || !question.needsManualGrading()) {
            throw new IllegalStateException("This question does not require manual grading");
        }

        validateScore(score);
        this.score = score;
        this.graded = true;
    }

    /**
     * Auto-grade based on question type
     */
    public void autoGrade() {
        if (question == null) {
            throw new IllegalStateException("Question is required for grading");
        }

        if (question.needsManualGrading()) {
            throw new IllegalStateException("This question requires manual grading");
        }

        if (question.isSingleChoice() || question.isTrueFalse()) {
            autoGradeSingleChoice();
        } else if (question.isMultipleChoice()) {
            autoGradeMultipleChoice();
        } else {
            throw new IllegalStateException("Unsupported question type for auto-grading");
        }
    }

    /**
     * Validate score
     */
    private void validateScore(Double score) {
        if (score == null) {
            throw new IllegalArgumentException("Score cannot be null");
        }
        if (score < 0) {
            throw new IllegalArgumentException("Score cannot be negative");
        }
        if (question != null && question.getMaxPoints() != null && score > question.getMaxPoints()) {
            throw new IllegalArgumentException("Score cannot exceed max points: " + question.getMaxPoints());
        }
    }

    /**
     * Parse selected option IDs from JSON string
     */
    private List<Long> parseSelectedOptionIds() {
        if (selectedOptionIds == null || selectedOptionIds.isBlank()) {
            return null;
        }

        try {
            ObjectMapper mapper = new ObjectMapper();
            Long[] ids = mapper.readValue(selectedOptionIds, Long[].class);
            return Arrays.asList(ids);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Invalid selected option IDs format", e);
        }
    }

    /**
     * Set selected option IDs from list
     */
    public void setSelectedOptionIdsList(List<Long> optionIds) {
        if (optionIds == null || optionIds.isEmpty()) {
            this.selectedOptionIds = null;
            return;
        }

        try {
            ObjectMapper mapper = new ObjectMapper();
            this.selectedOptionIds = mapper.writeValueAsString(optionIds);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Failed to serialize option IDs", e);
        }
    }

    /**
     * Get score percentage
     */
    public Double getScorePercentage() {
        if (score == null || question == null || question.getMaxPoints() == null || question.getMaxPoints() == 0) {
            return null;
        }
        return (score / question.getMaxPoints()) * 100;
    }

    /**
     * Check if answer has content (text or selected option)
     */
    public boolean hasAnswer() {
        return (answerText != null && !answerText.isBlank())
                || selectedOption != null
                || (selectedOptionIds != null && !selectedOptionIds.isBlank());
    }

    /**
     * Validate answer
     */
    public void validate() {
        if (question == null) {
            throw new IllegalStateException("Question is required");
        }
        if (quizAttempt == null) {
            throw new IllegalStateException("Quiz attempt is required");
        }
    }
}
