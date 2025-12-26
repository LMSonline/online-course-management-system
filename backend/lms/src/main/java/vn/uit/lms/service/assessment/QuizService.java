package vn.uit.lms.service.assessment;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.domain.assessment.Question;
import vn.uit.lms.core.domain.assessment.Quiz;
import vn.uit.lms.core.domain.assessment.QuizQuestion;
import vn.uit.lms.core.domain.course.content.Lesson;
import vn.uit.lms.core.repository.assessment.QuestionRepository;
import vn.uit.lms.core.repository.assessment.QuizQuestionRepository;
import vn.uit.lms.core.repository.assessment.QuizRepository;
import vn.uit.lms.core.repository.course.content.LessonRepository;
import vn.uit.lms.shared.dto.request.assessment.AddQuestionsRequest;
import vn.uit.lms.shared.dto.request.assessment.QuizRequest;
import vn.uit.lms.shared.dto.response.assessment.QuizResponse;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.QuizMapper;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizService {
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final LessonRepository lessonRepository;

    @Transactional
    public QuizResponse createQuiz(Long lessonId, QuizRequest request) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));

        Quiz quiz = Quiz.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .lesson(lesson)
                .totalPoints(request.getTotalPoints())
                .timeLimitMinutes(request.getTimeLimitMinutes())
                .maxAttempts(request.getMaxAttempts())
                .randomizeQuestions(request.getRandomizeQuestions())
                .randomizeOptions(request.getRandomizeOptions())
                .passingScore(request.getPassingScore())
                .build();

        // Validate using rich domain logic
        quiz.validate();

        quiz = quizRepository.save(quiz);
        return QuizMapper.toResponse(quiz);
    }

    public List<QuizResponse> getQuizzesByLesson(Long lessonId) {
        return quizRepository.findByLessonId(lessonId).stream()
                .map(QuizMapper::toResponse)
                .collect(Collectors.toList());
    }

    public QuizResponse getQuizById(Long id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));
        return QuizMapper.toResponse(quiz);
    }

    @Transactional
    public QuizResponse updateQuiz(Long id, QuizRequest request) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));

        quiz.setTitle(request.getTitle());
        quiz.setDescription(request.getDescription());
        quiz.setTotalPoints(request.getTotalPoints());
        quiz.setTimeLimitMinutes(request.getTimeLimitMinutes());
        quiz.setMaxAttempts(request.getMaxAttempts());
        quiz.setRandomizeQuestions(request.getRandomizeQuestions());
        quiz.setRandomizeOptions(request.getRandomizeOptions());
        quiz.setPassingScore(request.getPassingScore());

        // Validate using rich domain logic
        quiz.validate();

        quiz = quizRepository.save(quiz);
        return QuizMapper.toResponse(quiz);
    }

    @Transactional
    public void deleteQuiz(Long id) {
        if (!quizRepository.existsById(id)) {
            throw new ResourceNotFoundException("Quiz not found");
        }
        quizRepository.deleteById(id);
    }

    @Transactional
    public QuizResponse addQuestionsToQuiz(Long quizId, AddQuestionsRequest request) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));

        int currentOrder = quiz.getQuestionCount();

        for (Long questionId : request.getQuestionIds()) {
            Question question = questionRepository.findById(questionId)
                    .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + questionId));

            // Check if already exists
            if (quizQuestionRepository.findByQuizIdAndQuestionId(quizId, questionId).isPresent()) {
                continue;
            }

            QuizQuestion quizQuestion = QuizQuestion.builder()
                    .quiz(quiz)
                    .question(question)
                    .orderIndex(++currentOrder)
                    .build();

            quizQuestionRepository.save(quizQuestion);
        }

        return getQuizById(quizId);
    }

    @Transactional
    public void removeQuestionFromQuiz(Long quizId, Long questionId) {
        if (!quizRepository.existsById(quizId)) {
            throw new ResourceNotFoundException("Quiz not found");
        }
        
        QuizQuestion quizQuestion = quizQuestionRepository.findByQuizIdAndQuestionId(quizId, questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found in this quiz"));

        quizQuestionRepository.delete(quizQuestion);
    }

    /**
     * Get quiz entity
     */
    public Quiz getQuizEntity(Long id) {
        return quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));
    }
}
