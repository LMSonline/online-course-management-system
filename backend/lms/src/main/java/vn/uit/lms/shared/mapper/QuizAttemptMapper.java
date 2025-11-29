package vn.uit.lms.shared.mapper;

import vn.uit.lms.core.entity.assessment.QuizAttempt;
import vn.uit.lms.core.entity.assessment.QuizAttemptAnswer;
import vn.uit.lms.shared.dto.response.assessment.QuizAttemptAnswerResponse;
import vn.uit.lms.shared.dto.response.assessment.QuizAttemptResponse;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class QuizAttemptMapper {
    public static QuizAttemptResponse toResponse(QuizAttempt attempt) {
        List<QuizAttemptAnswerResponse> answers = Collections.emptyList();
        if (attempt.getAnswers() != null) {
            answers = attempt.getAnswers().stream()
                    .map(QuizAttemptMapper::toAnswerResponse)
                    .collect(Collectors.toList());
        }
        return QuizAttemptResponse.builder()
                .id(attempt.getId())
                .quizId(attempt.getQuiz().getId())
                .studentId(attempt.getStudent().getId())
                .startedAt(attempt.getStartedAt())
                .finishedAt(attempt.getFinishedAt())
                .totalScore(attempt.getTotalScore())
                .attemptNumber(attempt.getAttemptNumber())
                .status(attempt.getStatus())
                .metadata(attempt.getMetadata())
                .answers(answers)
                .build();
    }

    public static QuizAttemptAnswerResponse toAnswerResponse(QuizAttemptAnswer answer) {
        return QuizAttemptAnswerResponse.builder()
                .id(answer.getId())
                .questionId(answer.getQuestion().getId())
                .selectedOptionId(answer.getSelectedOption() != null ? answer.getSelectedOption().getId() : null)
                .answerText(answer.getAnswerText())
                .selectedOptionIds(answer.getSelectedOptionIds())
                .score(answer.getScore())
                .graded(answer.getGraded())
                .build();
    }
}
