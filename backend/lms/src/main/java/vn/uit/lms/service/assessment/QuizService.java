package vn.uit.lms.service.assessment;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.domain.Teacher;
import vn.uit.lms.core.domain.assessment.Question;
import vn.uit.lms.core.domain.assessment.Quiz;
import vn.uit.lms.core.domain.assessment.QuizQuestion;
import vn.uit.lms.core.domain.course.content.Lesson;
import vn.uit.lms.core.repository.assessment.QuestionRepository;
import vn.uit.lms.core.repository.assessment.QuizQuestionRepository;
import vn.uit.lms.core.repository.assessment.QuizRepository;
import vn.uit.lms.core.repository.course.content.LessonRepository;
import vn.uit.lms.service.TeacherService;
import vn.uit.lms.shared.dto.request.assessment.AddQuestionsRequest;
import vn.uit.lms.shared.dto.request.assessment.QuizRequest;
import vn.uit.lms.shared.dto.response.assessment.QuizResponse;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.QuizMapper;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for quiz management - orchestrates use cases
 * Business logic delegated to rich domain models (Quiz, QuizQuestion)
 */
@Service
@RequiredArgsConstructor
public class QuizService {
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final LessonRepository lessonRepository;
    private final TeacherService teacherService;

    /**
     * Use Case: Create quiz
     */
    @Transactional
    public QuizResponse createQuiz(Long lessonId, QuizRequest request) {
        // Load lesson
        Lesson lesson = loadLesson(lessonId);

        // Validate ownership - teacher can only create quiz in their own course's lessons
        Teacher lessonOwner = getLessonOwner(lesson);
        teacherService.validateTeacherAccess(lessonOwner);

        // Build quiz entity
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

        // Use rich domain validation
        quiz.validate();

        // Persist
        quiz = quizRepository.save(quiz);
        return QuizMapper.toResponse(quiz);
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
     * Use Case: Get quiz by ID
     */
    public QuizResponse getQuizById(Long id) {
        Quiz quiz = loadQuiz(id);
        return QuizMapper.toResponse(quiz);
    }

    /**
     * Use Case: Update quiz
     */
    @Transactional
    public QuizResponse updateQuiz(Long id, QuizRequest request) {
        Quiz quiz = loadQuiz(id);

        // Validate ownership - teacher can only update quiz in their own course's lessons
        Teacher lessonOwner = getLessonOwner(quiz.getLesson());
        teacherService.validateTeacherAccess(lessonOwner);

        // Update fields
        quiz.setTitle(request.getTitle());
        quiz.setDescription(request.getDescription());
        quiz.setTotalPoints(request.getTotalPoints());
        quiz.setTimeLimitMinutes(request.getTimeLimitMinutes());
        quiz.setMaxAttempts(request.getMaxAttempts());
        quiz.setRandomizeQuestions(request.getRandomizeQuestions());
        quiz.setRandomizeOptions(request.getRandomizeOptions());
        quiz.setPassingScore(request.getPassingScore());

        // Use rich domain validation
        quiz.validate();

        // Persist
        quiz = quizRepository.save(quiz);
        return QuizMapper.toResponse(quiz);
    }

    /**
     * Use Case: Delete quiz
     */
    @Transactional
    public void deleteQuiz(Long id) {
        Quiz quiz = loadQuiz(id);

        // Validate ownership - teacher can only delete quiz in their own course's lessons
        Teacher lessonOwner = getLessonOwner(quiz.getLesson());
        teacherService.validateTeacherAccess(lessonOwner);

        quizRepository.deleteById(id);
    }

    /**
     * Use Case: Add questions to quiz
     */
    @Transactional
    public QuizResponse addQuestionsToQuiz(Long quizId, AddQuestionsRequest request) {
        Quiz quiz = loadQuiz(quizId);

        // Validate ownership - teacher can only modify their own quiz
        Teacher lessonOwner = getLessonOwner(quiz.getLesson());
        teacherService.validateTeacherAccess(lessonOwner);

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

        return getQuizById(quizId);
    }

    /**
     * Use Case: Remove question from quiz
     */
    @Transactional
    public void removeQuestionFromQuiz(Long quizId, Long questionId) {
        Quiz quiz = loadQuiz(quizId);

        // Validate ownership - teacher can only modify their own quiz
        Teacher lessonOwner = getLessonOwner(quiz.getLesson());
        teacherService.validateTeacherAccess(lessonOwner);

        QuizQuestion quizQuestion = quizQuestionRepository.findByQuizIdAndQuestionId(quizId, questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found in this quiz"));

        // Use rich domain method to remove
        quiz.removeQuestion(quizQuestion);

        // Save quiz (cascade will handle quizQuestion deletion)
        quizRepository.save(quiz);
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
     * Use Case: Clone quiz to another lesson
     */
    @Transactional
    public QuizResponse cloneQuiz(Long quizId, Long targetLessonId) {
        Quiz sourceQuiz = loadQuiz(quizId);
        Lesson targetLesson = loadLesson(targetLessonId);

        // Validate ownership of target lesson
        Teacher targetLessonOwner = getLessonOwner(targetLesson);
        teacherService.validateTeacherAccess(targetLessonOwner);

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

        return QuizMapper.toResponse(clonedQuiz);
    }

    /**
     * Use Case: Reorder questions in quiz
     */
    @Transactional
    public void reorderQuestions(Long quizId, List<Long> questionIdsInOrder) {
        Quiz quiz = loadQuiz(quizId);

        // Validate ownership
        Teacher lessonOwner = getLessonOwner(quiz.getLesson());
        teacherService.validateTeacherAccess(lessonOwner);

        for (int i = 0; i < questionIdsInOrder.size(); i++) {
            Long questionId = questionIdsInOrder.get(i);
            QuizQuestion quizQuestion = quizQuestionRepository.findByQuizIdAndQuestionId(quizId, questionId)
                    .orElseThrow(() -> new ResourceNotFoundException("Question not found in quiz"));

            quizQuestion.setOrderIndex(i + 1);
            quizQuestionRepository.save(quizQuestion);
        }
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
     * Use Case: Update time limit
     */
    @Transactional
    public QuizResponse updateTimeLimit(Long quizId, Integer timeLimitMinutes) {
        Quiz quiz = loadQuiz(quizId);

        // Validate ownership
        Teacher lessonOwner = getLessonOwner(quiz.getLesson());
        teacherService.validateTeacherAccess(lessonOwner);

        // Basic validation (rich domain validate() will do full validation)
        if (timeLimitMinutes != null && timeLimitMinutes < 0) {
            throw new InvalidRequestException("Time limit cannot be negative");
        }

        quiz.setTimeLimitMinutes(timeLimitMinutes);

        // Use rich domain validation
        quiz.validate();

        quiz = quizRepository.save(quiz);
        return QuizMapper.toResponse(quiz);
    }

    /**
     * Use Case: Update passing score
     */
    @Transactional
    public QuizResponse updatePassingScore(Long quizId, Double passingScore) {
        Quiz quiz = loadQuiz(quizId);

        // Validate ownership
        Teacher lessonOwner = getLessonOwner(quiz.getLesson());
        teacherService.validateTeacherAccess(lessonOwner);

        quiz.setPassingScore(passingScore);

        // Use rich domain validation (includes passing score validation)
        quiz.validate();

        quiz = quizRepository.save(quiz);
        return QuizMapper.toResponse(quiz);
    }

    /**
     * Use Case: Add questions from question bank
     */
    @Transactional
    public QuizResponse addQuestionsFromBank(Long quizId, Long questionBankId, Integer count) {
        Quiz quiz = loadQuiz(quizId);

        // Validate ownership
        Teacher lessonOwner = getLessonOwner(quiz.getLesson());
        teacherService.validateTeacherAccess(lessonOwner);

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
     * Use Case: Remove all questions from quiz
     */
    @Transactional
    public void removeAllQuestions(Long quizId) {
        Quiz quiz = loadQuiz(quizId);

        // Validate ownership
        Teacher lessonOwner = getLessonOwner(quiz.getLesson());
        teacherService.validateTeacherAccess(lessonOwner);

        List<QuizQuestion> quizQuestions = quizQuestionRepository.findByQuizId(quizId);

        // Use rich domain method to remove each question
        for (QuizQuestion qq : quizQuestions) {
            quiz.removeQuestion(qq);
        }

        // Reset total points
        quiz.setTotalPoints(0.0);

        quizRepository.save(quiz);
    }

    /**
     * Use Case: Update max attempts
     */
    @Transactional
    public QuizResponse updateMaxAttempts(Long quizId, Integer maxAttempts) {
        Quiz quiz = loadQuiz(quizId);

        // Validate ownership
        Teacher lessonOwner = getLessonOwner(quiz.getLesson());
        teacherService.validateTeacherAccess(lessonOwner);

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

    private Quiz loadQuiz(Long id) {
        return quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));
    }

    private Lesson loadLesson(Long id) {
        return lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));
    }

    private Question loadQuestion(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));
    }

    /**
     * Get teacher owner from lesson through: Lesson -> Chapter -> CourseVersion -> Course -> Teacher
     */
    private Teacher getLessonOwner(Lesson lesson) {
        if (lesson.getChapter() == null) {
            throw new IllegalStateException("Lesson must belong to a chapter");
        }
        if (lesson.getChapter().getCourseVersion() == null) {
            throw new IllegalStateException("Chapter must belong to a course version");
        }
        if (lesson.getChapter().getCourseVersion().getCourse() == null) {
            throw new IllegalStateException("Course version must belong to a course");
        }
        if (lesson.getChapter().getCourseVersion().getCourse().getTeacher() == null) {
            throw new IllegalStateException("Course must have a teacher");
        }
        return lesson.getChapter().getCourseVersion().getCourse().getTeacher();
    }
}

