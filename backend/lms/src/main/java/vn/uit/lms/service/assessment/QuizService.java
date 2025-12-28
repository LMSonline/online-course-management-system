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

    /**
     * Get quiz with questions for taking (for students)
     * This returns quiz configuration and questions without showing correct answers
     */
    public QuizResponse getQuizForTaking(Long id) {
        Quiz quiz = getQuizEntity(id);
        QuizResponse response = QuizMapper.toResponse(quiz);
        
        // If randomize is enabled, shuffle questions
        if (quiz.shouldRandomizeQuestions() && response.getQuestions() != null) {
            java.util.Collections.shuffle(response.getQuestions());
        }
        
        return response;
    }

    /**
     * Clone quiz to another lesson (for teachers)
     */
    @Transactional
    public QuizResponse cloneQuiz(Long quizId, Long targetLessonId) {
        Quiz sourceQuiz = getQuizEntity(quizId);
        Lesson targetLesson = lessonRepository.findById(targetLessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Target lesson not found"));
        
        // Create new quiz with same configuration
        Quiz clonedQuiz = Quiz.builder()
                .title(sourceQuiz.getTitle() + " (Copy)")
                .description(sourceQuiz.getDescription())
                .lesson(targetLesson)
                .totalPoints(sourceQuiz.getTotalPoints())
                .timeLimitMinutes(sourceQuiz.getTimeLimitMinutes())
                .maxAttempts(sourceQuiz.getMaxAttempts())
                .randomizeQuestions(sourceQuiz.getRandomizeQuestions())
                .randomizeOptions(sourceQuiz.getRandomizeOptions())
                .passingScore(sourceQuiz.getPassingScore())
                .build();
        
        clonedQuiz.validate();
        clonedQuiz = quizRepository.save(clonedQuiz);
        
        // Copy questions
        if (sourceQuiz.getQuizQuestions() != null) {
            for (QuizQuestion sourceQQ : sourceQuiz.getQuizQuestions()) {
                QuizQuestion clonedQQ = QuizQuestion.builder()
                        .quiz(clonedQuiz)
                        .question(sourceQQ.getQuestion())
                        .orderIndex(sourceQQ.getOrderIndex())
                        .build();
                quizQuestionRepository.save(clonedQQ);
            }
        }
        
        return QuizMapper.toResponse(clonedQuiz);
    }

    /**
     * Reorder questions in quiz
     */
    @Transactional
    public void reorderQuestions(Long quizId, List<Long> questionIdsInOrder) {
        if (!quizRepository.existsById(quizId)) {
            throw new ResourceNotFoundException("Quiz not found");
        }
        
        for (int i = 0; i < questionIdsInOrder.size(); i++) {
            Long questionId = questionIdsInOrder.get(i);
            QuizQuestion quizQuestion = quizQuestionRepository.findByQuizIdAndQuestionId(quizId, questionId)
                    .orElseThrow(() -> new ResourceNotFoundException("Question not found in quiz"));
            quizQuestion.setOrderIndex(i + 1);
            quizQuestionRepository.save(quizQuestion);
        }
    }

    /**
     * Get question count for a quiz
     */
    public int getQuestionCount(Long quizId) {
        Quiz quiz = getQuizEntity(quizId);
        return quiz.getQuestionCount();
    }

    /**
     * Update quiz time limit (for teachers)
     */
    @Transactional
    public QuizResponse updateTimeLimit(Long quizId, Integer timeLimitMinutes) {
        Quiz quiz = getQuizEntity(quizId);

        if (timeLimitMinutes != null && timeLimitMinutes < 0) {
            throw new vn.uit.lms.shared.exception.InvalidRequestException("Time limit cannot be negative");
        }

        quiz.setTimeLimitMinutes(timeLimitMinutes);
        quiz = quizRepository.save(quiz);

        return QuizMapper.toResponse(quiz);
    }

    /**
     * Update quiz passing score (for teachers)
     */
    @Transactional
    public QuizResponse updatePassingScore(Long quizId, Double passingScore) {
        Quiz quiz = getQuizEntity(quizId);

        if (passingScore != null && passingScore < 0) {
            throw new vn.uit.lms.shared.exception.InvalidRequestException("Passing score cannot be negative");
        }

        if (passingScore != null && quiz.getTotalPoints() != null && passingScore > quiz.getTotalPoints()) {
            throw new vn.uit.lms.shared.exception.InvalidRequestException(
                "Passing score cannot exceed total points: " + quiz.getTotalPoints()
            );
        }

        quiz.setPassingScore(passingScore);
        quiz = quizRepository.save(quiz);

        return QuizMapper.toResponse(quiz);
    }

    /**
     * Batch add questions from a question bank
     */
    @Transactional
    public QuizResponse addQuestionsFromBank(Long quizId, Long questionBankId, Integer count) {
        Quiz quiz = getQuizEntity(quizId);

        List<Question> bankQuestions = questionRepository.findByQuestionBankId(questionBankId);

        if (bankQuestions.isEmpty()) {
            throw new ResourceNotFoundException("No questions found in question bank");
        }

        // Shuffle and take specified count
        java.util.Collections.shuffle(bankQuestions);
        int questionsToAdd = count != null ? Math.min(count, bankQuestions.size()) : bankQuestions.size();

        int currentOrder = quiz.getQuestionCount();

        for (int i = 0; i < questionsToAdd; i++) {
            Question question = bankQuestions.get(i);

            // Check if already exists
            if (quizQuestionRepository.findByQuizIdAndQuestionId(quizId, question.getId()).isPresent()) {
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

    /**
     * Remove all questions from quiz
     */
    @Transactional
    public void removeAllQuestions(Long quizId) {
        if (!quizRepository.existsById(quizId)) {
            throw new ResourceNotFoundException("Quiz not found");
        }

        List<QuizQuestion> quizQuestions = quizQuestionRepository.findByQuizId(quizId);
        quizQuestionRepository.deleteAll(quizQuestions);
    }

    /**
     * Update max attempts for quiz
     */
    @Transactional
    public QuizResponse updateMaxAttempts(Long quizId, Integer maxAttempts) {
        Quiz quiz = getQuizEntity(quizId);

        if (maxAttempts != null && maxAttempts < 1) {
            throw new vn.uit.lms.shared.exception.InvalidRequestException("Max attempts must be at least 1");
        }

        quiz.setMaxAttempts(maxAttempts);
        quiz = quizRepository.save(quiz);

        return QuizMapper.toResponse(quiz);
    }
}
