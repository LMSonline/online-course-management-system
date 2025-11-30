package vn.uit.lms.shared.constant;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Types of questions in quizzes and assessments
 */
@Schema(description = "Question types")
public enum QuestionType {
    @Schema(description = "Multiple choice (single answer)")
    MULTIPLE_CHOICE,

    @Schema(description = "Multiple select (multiple answers)")
    MULTI_SELECT,

    @Schema(description = "Essay question (long text answer)")
    ESSAY,

    @Schema(description = "Fill in the blank")
    FILL_BLANK,

    @Schema(description = "True or False question")
    TRUE_FALSE
}
