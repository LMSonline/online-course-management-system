package vn.uit.lms.shared.mapper;

import vn.uit.lms.core.entity.assessment.Quiz;
import vn.uit.lms.core.entity.assessment.QuizQuestion;
import vn.uit.lms.shared.dto.response.assessment.QuizQuestionResponse;
import vn.uit.lms.shared.dto.response.assessment.QuizResponse;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

public class QuizMapper {
    public static QuizResponse toResponse(Quiz quiz) {
        List<QuizQuestionResponse> questions = Collections.emptyList();
        if (quiz.getQuizQuestions() != null) {
            questions = quiz.getQuizQuestions().stream()
                    .sorted(Comparator.comparingInt(qq -> qq.getOrderIndex() != null ? qq.getOrderIndex() : 0))
                    .map(QuizMapper::toQuizQuestionResponse)
                    .collect(Collectors.toList());
        }

        return QuizResponse.builder()
                .id(quiz.getId())
                .title(quiz.getTitle())
                .description(quiz.getDescription())
                .lessonId(quiz.getLesson() != null ? quiz.getLesson().getId() : null)
                .totalPoints(quiz.getTotalPoints())
                .timeLimitMinutes(quiz.getTimeLimitMinutes())
                .maxAttempts(quiz.getMaxAttempts())
                .randomizeQuestions(quiz.getRandomizeQuestions())
                .randomizeOptions(quiz.getRandomizeOptions())
                .passingScore(quiz.getPassingScore())
                .questions(questions)
                .createdAt(quiz.getCreatedAt())
                .createdBy(quiz.getCreatedBy())
                .updatedAt(quiz.getUpdatedAt())
                .updatedBy(quiz.getUpdatedBy())
                .deletedAt(quiz.getDeletedAt())
                .build();
    }

    public static QuizQuestionResponse toQuizQuestionResponse(QuizQuestion quizQuestion) {
        return QuizQuestionResponse.builder()
                .id(quizQuestion.getId())
                .questionId(quizQuestion.getQuestion().getId())
                .questionContent(quizQuestion.getQuestion().getContent())
                .questionType(quizQuestion.getQuestion().getType().name())
                .points(quizQuestion.getPoints())
                .orderIndex(quizQuestion.getOrderIndex())
                .build();
    }
}
