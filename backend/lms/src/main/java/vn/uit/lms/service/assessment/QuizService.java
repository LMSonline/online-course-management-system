package vn.uit.lms.service.assessment;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.domain.assessment.Question;
import vn.uit.lms.core.domain.assessment.Quiz;
import vn.uit.lms.core.domain.assessment.QuizQuestion;
import vn.uit.lms.core.domain.course.content.Lesson;
import vn.uit.lms.core.repository.assessment.QuestionRepository;
import vn.uit.lms.core.repository.assessment.QuizAttemptRepository;
import vn.uit.lms.core.repository.assessment.QuizQuestionRepository;
import vn.uit.lms.core.repository.assessment.QuizRepository;
import vn.uit.lms.core.repository.course.content.LessonRepository;
import vn.uit.lms.service.learning.EnrollmentAccessService;
import vn.uit.lms.shared.dto.request.assessment.AddQuestionsRequest;
import vn.uit.lms.shared.dto.request.assessment.QuizRequest;
import vn.uit.lms.shared.dto.response.assessment.QuizResponse;
import vn.uit.lms.shared.dto.response.assessment.QuizQuestionResponse;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.QuizMapper;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for quiz management - orchestrates use cases
 * Business logic delegated to rich domain models (Quiz, QuizQuestion)
 *
 * Access Control:
 * - Teachers can CRUD quizzes in their own course lessons
 * - Students can take quizzes if enrolled in the course
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class QuizService {
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final LessonRepository lessonRepository;
    private final EnrollmentAccessService enrollmentAccessService;

    /**
     * Use Case: Create independent quiz (Teacher only) - NEW API
     * Quiz is created without being linked to any lesson.
     * Can be linked to lessons later via linkQuizToLesson().
     *
     * This follows Association pattern: Quiz exists independently.
     */
    @Transactional
    public QuizResponse createIndependentQuiz(QuizRequest request) {
        log.info("Creating independent quiz: {}", request.getTitle());

        // Build quiz entity WITHOUT lesson
        Quiz quiz = Quiz.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .lesson(null) // Explicitly null - quiz is independent
                .totalPoints(request.getTotalPoints())
                .timeLimitMinutes(request.getTimeLimitMinutes())
                .maxAttempts(request.getMaxAttempts())
                .randomizeQuestions(request.getRandomizeQuestions())
                .randomizeOptions(request.getRandomizeOptions())
                .passingScore(request.getPassingScore())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();

        // Use rich domain validation
        quiz.validate();

        // Persist
        quiz = quizRepository.save(quiz);
        log.info("Independent quiz created with id: {}", quiz.getId());
        return QuizMapper.toResponse(quiz);
    }

    /**
     * Use Case: Link quiz to lesson (Teacher only) - NEW API
     * Associates an existing independent quiz with a lesson.
     *
     * Access Control: Verifies teacher owns the lesson.
     */
    @Transactional
    public QuizResponse linkQuizToLesson(Long quizId, Long lessonId) {
        log.info("Linking quiz {} to lesson: {}", quizId, lessonId);

        // Verify teacher ownership of lesson
        Lesson lesson = enrollmentAccessService.verifyTeacherLessonOwnership(lessonId);

        // Load quiz
        Quiz quiz = loadQuiz(quizId);

        // Business rule: Allow re-linking (re-usable quiz pattern)
        quiz.setLesson(lesson);
        quiz = quizRepository.save(quiz);

        log.info("Quiz {} linked to lesson: {}", quizId, lessonId);
        return QuizMapper.toResponse(quiz);
    }

    /**
     * Use Case: Unlink quiz from lesson (Teacher only) - NEW API
     * Removes association between quiz and lesson.
     * Quiz becomes independent again.
     *
     * Access Control: Verifies teacher owns the quiz.
     */
    @Transactional
    public QuizResponse unlinkQuizFromLesson(Long lessonId, Long quizId) {
        log.info("Unlinking quiz {} from lesson: {}", quizId, lessonId);

        // Verify teacher ownership
        Quiz quiz = enrollmentAccessService.verifyTeacherQuizOwnership(quizId);

        // Verify quiz is actually linked to this lesson
        if (quiz.getLesson() == null || !quiz.getLesson().getId().equals(lessonId)) {
            throw new InvalidRequestException("Quiz is not linked to this lesson");
        }

        // Unlink
        quiz.setLesson(null);
        quiz = quizRepository.save(quiz);

        log.info("Quiz {} unlinked from lesson: {}", quizId, lessonId);
        return QuizMapper.toResponse(quiz);
    }

    /**
     * Use Case: Create quiz and link to lesson (Teacher only) - LEGACY/CONVENIENCE API
     * This is a convenience method that combines createIndependentQuiz + linkQuizToLesson.
     * Kept for backward compatibility and UX (quick creation during lesson editing).
     *
     * Access Control: Verifies teacher owns the lesson's course.
     */
    @Transactional
    public QuizResponse createQuiz(Long lessonId, QuizRequest request) {
        log.info("Creating quiz in lesson (convenience method): {}", lessonId);

        // Step 1: Create independent quiz
        QuizResponse quizResponse = createIndependentQuiz(request);

        // Step 2: Link to lesson
        return linkQuizToLesson(quizResponse.getId(), lessonId);
    }

    /**
     * Use Case: Get quizzes by lesson
     */
    public List<QuizResponse> getQuizzesByLesson(Long lessonId) {
        return quizRepository.findByLessonId(lessonId).stream()
                .map(QuizMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Use Case: Get all independent quizzes (not linked to any lesson) - NEW API
     * Useful for showing quiz pool/library for teachers to select from.
     */
    public List<QuizResponse> getAllIndependentQuizzes() {
        return quizRepository.findByLessonIsNull().stream()
                .map(QuizMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Use Case: Get quiz by ID
     */
    public QuizResponse getQuizById(Long id) {
        Quiz quiz = loadQuiz(id);
        return QuizMapper.toResponse(quiz);
    }

    /**
     * Use Case: Update quiz (Teacher only)
     *
     * Access Control: Verifies teacher owns the quiz.
     */
    @Transactional
    public QuizResponse updateQuiz(Long id, QuizRequest request) {
        log.info("Updating quiz: {}", id);

        // Verify teacher ownership using centralized service
        Quiz quiz = enrollmentAccessService.verifyTeacherQuizOwnership(id);

        // Update fields
        quiz.setTitle(request.getTitle());
        quiz.setDescription(request.getDescription());
        quiz.setTotalPoints(request.getTotalPoints());
        quiz.setTimeLimitMinutes(request.getTimeLimitMinutes());
        quiz.setMaxAttempts(request.getMaxAttempts());
        quiz.setRandomizeQuestions(request.getRandomizeQuestions());
        quiz.setRandomizeOptions(request.getRandomizeOptions());
        quiz.setPassingScore(request.getPassingScore());
        quiz.setStartDate(request.getStartDate());
        quiz.setEndDate(request.getEndDate());

        // Use rich domain validation
        quiz.validate();

        // Persist
        quiz = quizRepository.save(quiz);
        log.info("Quiz updated successfully: {}", id);
        return QuizMapper.toResponse(quiz);
    }

    /**
     * Use Case: Delete quiz (Teacher only)
     *
     * Access Control: Verifies teacher owns the quiz.
     * Business Rule: Cannot delete quiz if it has attempts (use soft delete or archive instead).
     * Cascade Delete: Deletes quiz questions to prevent orphaned data.
     */
    @Transactional
    public void deleteQuiz(Long id) {
        log.info("Deleting quiz: {}", id);

        // Verify teacher ownership using centralized service
        Quiz quiz = enrollmentAccessService.verifyTeacherQuizOwnership(id);

        // BUSINESS RULE: Check if quiz has attempts
        long attemptCount = quizAttemptRepository.countByQuizId(id);
        if (attemptCount > 0) {
            throw new InvalidRequestException(
                    String.format("Cannot delete quiz with %d student attempt(s). Consider unlinking from lesson or archiving instead.", attemptCount)
            );
        }

        // CASCADE DELETE to prevent foreign key constraint errors
        // STEP 1: Delete all quiz questions (composition relationship)
        log.debug("Deleting quiz questions for quiz: {}", id);
        quizQuestionRepository.deleteByQuizId(id);

        // STEP 2: Delete quiz (aggregate root)
        quizRepository.deleteById(id);
        log.info("Quiz deleted successfully: {}", id);
    }

    /**
     * Use Case: Add questions to quiz (Teacher only)
     *
     * Access Control: Verifies teacher owns the quiz.
     */
    @Transactional
    public QuizResponse addQuestionsToQuiz(Long quizId, AddQuestionsRequest request) {
        log.info("Adding questions to quiz: {}", quizId);

        // Verify teacher ownership using centralized service
        Quiz quiz = enrollmentAccessService.verifyTeacherQuizOwnership(quizId);

        // Use rich domain method to get current count
        int currentOrder = quiz.getQuestionCount();

        for (Long questionId : request.getQuestionIds()) {
            Question question = loadQuestion(questionId);

            // Check if already exists
            if (quizQuestionRepository.findByQuizIdAndQuestionId(quizId, questionId).isPresent()) {
                continue;
            }

            // Create quiz-question association
            QuizQuestion quizQuestion = QuizQuestion.builder()
                    .quiz(quiz)
                    .question(question)
                    .orderIndex(++currentOrder)
                    .build();

            // Use rich domain validation
            quizQuestion.validate();

            quizQuestionRepository.save(quizQuestion);
        }

        // Optionally recalculate total points using rich domain
        quiz.recalculateTotalPoints();
        quizRepository.save(quiz);

        log.info("Questions added successfully to quiz: {}", quizId);
        return getQuizById(quizId);
    }

    /**
     * Use Case: Remove question from quiz (Teacher only)
     *
     * Access Control: Verifies teacher owns the quiz.
     */
    @Transactional
    public void removeQuestionFromQuiz(Long quizId, Long questionId) {
        log.info("Removing question {} from quiz: {}", questionId, quizId);

        // Verify teacher ownership using centralized service
        Quiz quiz = enrollmentAccessService.verifyTeacherQuizOwnership(quizId);

        QuizQuestion quizQuestion = quizQuestionRepository.findByQuizIdAndQuestionId(quizId, questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found in this quiz"));

        // Use rich domain method to remove
        quiz.removeQuestion(quizQuestion);

        // Save quiz (cascade will handle quizQuestion deletion)
        quizRepository.save(quiz);
        log.info("Question removed successfully from quiz: {}", quizId);
    }

    /**
     * Use Case: Get quiz for taking (students)
     * Returns quiz with questions, optionally randomized
     */
    public QuizResponse getQuizForTaking(Long id) {
        Quiz quiz = loadQuiz(id);

        // Use rich domain method to check readiness
        if (!quiz.isReadyToTake()) {
            throw new InvalidRequestException("Quiz is not ready to take (no questions or invalid configuration)");
        }

        QuizResponse response = QuizMapper.toResponse(quiz);

        // Use rich domain method to check if should randomize
        if (quiz.shouldRandomizeQuestions() && response.getQuestions() != null) {
            java.util.Collections.shuffle(response.getQuestions());
        }

        return response;
    }

    /**
     * Use Case: Clone quiz to another lesson (Teacher only)
     *
     * Access Control: Verifies teacher owns the target lesson.
     */
    @Transactional
    public QuizResponse cloneQuiz(Long quizId, Long targetLessonId) {
        log.info("Cloning quiz {} to lesson: {}", quizId, targetLessonId);

        Quiz sourceQuiz = loadQuiz(quizId);

        // Verify teacher ownership of target lesson using centralized service
        Lesson targetLesson = enrollmentAccessService.verifyTeacherLessonOwnership(targetLessonId);

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
                .startDate(sourceQuiz.getStartDate())
                .endDate(sourceQuiz.getEndDate())
                .build();

        // Use rich domain validation
        clonedQuiz.validate();
        clonedQuiz = quizRepository.save(clonedQuiz);

        // Copy questions using rich domain methods
        if (sourceQuiz.getQuizQuestions() != null) {
            for (QuizQuestion sourceQQ : sourceQuiz.getQuizQuestions()) {
                QuizQuestion clonedQQ = QuizQuestion.builder()
                        .quiz(clonedQuiz)
                        .question(sourceQQ.getQuestion())
                        .orderIndex(sourceQQ.getOrderIndex())
                        .points(sourceQQ.getPoints()) // Preserve custom points if any
                        .build();

                // Use rich domain validation
                clonedQQ.validate();

                // Use rich domain method to add question
                clonedQuiz.addQuestion(clonedQQ);
            }

            // Save with all questions
            quizRepository.save(clonedQuiz);
        }

        log.info("Quiz cloned successfully to lesson: {}", targetLessonId);
        return QuizMapper.toResponse(clonedQuiz);
    }

    /**
     * Use Case: Reorder questions in quiz (Teacher only)
     *
     * Access Control: Verifies teacher owns the quiz.
     */
    @Transactional
    public void reorderQuestions(Long quizId, List<Long> questionIdsInOrder) {
        log.info("Reordering questions in quiz: {}", quizId);

        // Verify teacher ownership using centralized service
        Quiz quiz = enrollmentAccessService.verifyTeacherQuizOwnership(quizId);

        for (int i = 0; i < questionIdsInOrder.size(); i++) {
            Long questionId = questionIdsInOrder.get(i);
            QuizQuestion quizQuestion = quizQuestionRepository.findByQuizIdAndQuestionId(quizId, questionId)
                    .orElseThrow(() -> new ResourceNotFoundException("Question not found in quiz"));

            quizQuestion.setOrderIndex(i + 1);
            quizQuestionRepository.save(quizQuestion);
        }

        log.info("Questions reordered in quiz: {}", quizId);
    }

    /**
     * Use Case: Get question count
     */
    public int getQuestionCount(Long quizId) {
        Quiz quiz = loadQuiz(quizId);
        // Use rich domain method
        return quiz.getQuestionCount();
    }

    /**
     * Use Case: Update time limit (Teacher only)
     *
     * Access Control: Verifies teacher owns the quiz.
     */
    @Transactional
    public QuizResponse updateTimeLimit(Long quizId, Integer timeLimitMinutes) {
        log.info("Updating time limit for quiz: {}", quizId);

        // Verify teacher ownership using centralized service
        Quiz quiz = enrollmentAccessService.verifyTeacherQuizOwnership(quizId);

        // Basic validation (rich domain validate() will do full validation)
        if (timeLimitMinutes != null && timeLimitMinutes < 0) {
            throw new InvalidRequestException("Time limit cannot be negative");
        }

        quiz.setTimeLimitMinutes(timeLimitMinutes);

        // Use rich domain validation
        quiz.validate();

        quiz = quizRepository.save(quiz);
        log.info("Time limit updated for quiz: {}", quizId);
        return QuizMapper.toResponse(quiz);
    }

    /**
     * Use Case: Update passing score (Teacher only)
     *
     * Access Control: Verifies teacher owns the quiz.
     */
    @Transactional
    public QuizResponse updatePassingScore(Long quizId, Double passingScore) {
        log.info("Updating passing score for quiz: {}", quizId);

        // Verify teacher ownership using centralized service
        Quiz quiz = enrollmentAccessService.verifyTeacherQuizOwnership(quizId);

        quiz.setPassingScore(passingScore);

        // Use rich domain validation (includes passing score validation)
        quiz.validate();

        quiz = quizRepository.save(quiz);
        log.info("Passing score updated for quiz: {}", quizId);
        return QuizMapper.toResponse(quiz);
    }

    /**
     * Use Case: Add questions from question bank (Teacher only)
     *
     * Access Control: Verifies teacher owns the quiz.
     */
    @Transactional
    public QuizResponse addQuestionsFromBank(Long quizId, Long questionBankId, Integer count) {
        log.info("Adding questions from bank {} to quiz: {}", questionBankId, quizId);

        // Verify teacher ownership using centralized service
        Quiz quiz = enrollmentAccessService.verifyTeacherQuizOwnership(quizId);

        // Load questions from bank
        List<Question> bankQuestions = questionRepository.findByQuestionBankId(questionBankId);

        if (bankQuestions.isEmpty()) {
            throw new ResourceNotFoundException("No questions found in question bank");
        }

        // Shuffle and take specified count
        java.util.Collections.shuffle(bankQuestions);
        int questionsToAdd = count != null ? Math.min(count, bankQuestions.size()) : bankQuestions.size();

        // Use rich domain method to get current count
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

            // Use rich domain validation
            quizQuestion.validate();

            // Use rich domain method to add
            quiz.addQuestion(quizQuestion);
        }

        // Recalculate total points using rich domain
        quiz.recalculateTotalPoints();

        quiz = quizRepository.save(quiz);
        return QuizMapper.toResponse(quiz);
    }

    /**
     * Use Case: Remove all questions from quiz (Teacher only)
     *
     * Access Control: Verifies teacher owns the quiz.
     */
    @Transactional
    public void removeAllQuestions(Long quizId) {
        log.info("Removing all questions from quiz: {}", quizId);

        // Verify teacher ownership using centralized service
        Quiz quiz = enrollmentAccessService.verifyTeacherQuizOwnership(quizId);

        List<QuizQuestion> quizQuestions = quizQuestionRepository.findByQuizId(quizId);

        // Use rich domain method to remove each question
        for (QuizQuestion qq : quizQuestions) {
            quiz.removeQuestion(qq);
        }

        // Reset total points
        quiz.setTotalPoints(0.0);

        quizRepository.save(quiz);
        log.info("All questions removed from quiz: {}", quizId);
    }

    /**
     * Use Case: Update max attempts (Teacher only)
     *
     * Access Control: Verifies teacher owns the quiz.
     */
    @Transactional
    public QuizResponse updateMaxAttempts(Long quizId, Integer maxAttempts) {
        log.info("Updating max attempts for quiz: {}", quizId);

        // Verify teacher ownership using centralized service
        Quiz quiz = enrollmentAccessService.verifyTeacherQuizOwnership(quizId);

        quiz.setMaxAttempts(maxAttempts);

        // Use rich domain validation (includes max attempts validation)
        quiz.validate();

        quiz = quizRepository.save(quiz);
        return QuizMapper.toResponse(quiz);
    }

    // ========== Helper methods for orchestration ==========

    /**
     * Load quiz entity
     */
    public Quiz getQuizEntity(Long id) {
        return loadQuiz(id);
    }

    /**
     * Use Case: Get quiz questions
     * Access Control:
     * - Teachers: can get questions for their own quizzes
     * - Students: can get questions for quizzes in enrolled courses
     */
    public List<QuizQuestionResponse> getQuizQuestions(Long quizId) {
        log.info("Getting questions for quiz: {}", quizId);

        Quiz quiz = loadQuiz(quizId);

        // Access control handled by mapper (doesn't expose answers)
        return quiz.getQuizQuestions().stream()
                .sorted(java.util.Comparator.comparingInt(qq -> qq.getOrderIndex() != null ? qq.getOrderIndex() : 0))
                .map(QuizMapper::toQuizQuestionResponse)
                .collect(Collectors.toList());
    }

    private Quiz loadQuiz(Long id) {
        return quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));
    }

    private Question loadQuestion(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));
    }
}

