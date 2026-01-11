package vn.uit.lms.core.domain.assessment;

import jakarta.persistence.*;
import lombok.*;
import vn.uit.lms.shared.constant.QuestionType;
import vn.uit.lms.shared.entity.BaseEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class Question extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionType type;

    @Column(columnDefinition = "TEXT")
    private String metadata;

    @Column(name = "max_points")
    @Builder.Default
    private Double maxPoints = 1.0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_bank_id")
    private QuestionBank questionBank;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<AnswerOption> answerOptions = new ArrayList<>();

    /**
     * Validate question
     */
    public void validate() {
        if (content == null || content.isBlank()) {
            throw new IllegalStateException("Question content is required");
        }
        if (type == null) {
            throw new IllegalStateException("Question type is required");
        }
        if (maxPoints != null && maxPoints < 0) {
            throw new IllegalStateException("Max points cannot be negative");
        }

        // Validate answer options for multiple choice questions
        if (isMultipleChoice() || isSingleChoice()) {
            validateAnswerOptions();
        }
    }

    /**
     * Validate answer options
     */
    private void validateAnswerOptions() {
        if (answerOptions == null || answerOptions.isEmpty()) {
            throw new IllegalStateException("Multiple choice questions must have answer options");
        }

        long correctCount = answerOptions.stream()
                .filter(AnswerOption::isCorrectAnswer)
                .count();

        if (correctCount == 0) {
            throw new IllegalStateException("At least one answer option must be marked as correct");
        }

        if (isSingleChoice() && correctCount > 1) {
            throw new IllegalStateException("Single choice questions must have exactly one correct answer");
        }
    }

    /**
     * Check if question is multiple choice
     */
    public boolean isMultipleChoice() {
        return type == QuestionType.MULTIPLE_CHOICE;
    }

    /**
     * Check if question is single choice (same as multiple choice with single answer)
     */
    public boolean isSingleChoice() {
        return type == QuestionType.MULTIPLE_CHOICE;
    }

    /**
     * Check if question is essay/text type
     */
    public boolean isEssay() {
        return type == QuestionType.ESSAY;
    }

    /**
     * Check if question is true/false
     */
    public boolean isTrueFalse() {
        return type == QuestionType.TRUE_FALSE;
    }

    /**
     * Check if question needs manual grading
     */
    public boolean needsManualGrading() {
        return isEssay();
    }

    /**
     * Get correct answer options
     */
    public List<AnswerOption> getCorrectAnswers() {
        if (answerOptions == null) {
            return new ArrayList<>();
        }
        return answerOptions.stream()
                .filter(AnswerOption::isCorrectAnswer)
                .collect(Collectors.toList());
    }

    /**
     * Check if a single option is correct
     */
    public boolean isCorrectOption(Long optionId) {
        if (answerOptions == null || optionId == null) {
            return false;
        }
        return answerOptions.stream()
                .anyMatch(option -> option.getId().equals(optionId) && option.isCorrectAnswer());
    }

    /**
     * Check if multiple options are all correct
     */
    public boolean areCorrectOptions(List<Long> optionIds) {
        if (optionIds == null || optionIds.isEmpty()) {
            return false;
        }

        List<Long> correctIds = getCorrectAnswers().stream()
                .map(AnswerOption::getId)
                .collect(Collectors.toList());

        return optionIds.size() == correctIds.size()
                && correctIds.containsAll(optionIds);
    }

    /**
     * Calculate score for a given answer
     */
    public Double calculateScore(Long selectedOptionId) {
        if (selectedOptionId == null) {
            return 0.0;
        }
        return isCorrectOption(selectedOptionId) ? maxPoints : 0.0;
    }

    /**
     * Calculate score for multiple selected options
     */
    public Double calculateScoreForMultiple(List<Long> selectedOptionIds) {
        if (selectedOptionIds == null || selectedOptionIds.isEmpty()) {
            return 0.0;
        }
        return areCorrectOptions(selectedOptionIds) ? maxPoints : 0.0;
    }

    /**
     * Add answer option to question
     */
    public void addAnswerOption(AnswerOption option) {
        if (answerOptions == null) {
            answerOptions = new ArrayList<>();
        }
        option.setQuestion(this);
        answerOptions.add(option);
    }

    /**
     * Remove answer option from question
     */
    public void removeAnswerOption(AnswerOption option) {
        if (answerOptions != null) {
            answerOptions.remove(option);
            option.setQuestion(null);
        }
    }

    /**
     * Get number of answer options
     */
    public int getOptionCount() {
        return answerOptions != null ? answerOptions.size() : 0;
    }

    /**
     * Check if question belongs to a specific question bank
     */
    public boolean belongsToBank(Long bankId) {
        return questionBank != null && questionBank.getId().equals(bankId);
    }
}
