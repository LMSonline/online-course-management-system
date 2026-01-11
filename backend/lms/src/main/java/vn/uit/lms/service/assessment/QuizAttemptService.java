package vn.uit.lms.service.assessment;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.domain.Account;
import vn.uit.lms.core.domain.Student;
import vn.uit.lms.core.domain.assessment.*;
import vn.uit.lms.core.repository.StudentRepository;
import vn.uit.lms.core.repository.assessment.*;
import vn.uit.lms.service.AccountService;
import vn.uit.lms.service.learning.EnrollmentAccessService;
import vn.uit.lms.shared.constant.QuizAttemptStatus;
import vn.uit.lms.shared.dto.request.assessment.SubmitAnswerRequest;
import vn.uit.lms.shared.dto.response.assessment.QuizAttemptResponse;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.QuizAttemptMapper;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service for orchestrating quiz attempt use cases
 * Business logic is delegated to domain models
 *
 * Access Control:
 * - Students can only attempt quizzes if enrolled in the course
 * - Students can only view their own attempts
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class QuizAttemptService {
    private final QuizAttemptRepository quizAttemptRepository;
    private final QuizRepository quizRepository;
    private final StudentRepository studentRepository;
    private final AccountService accountService;
    private final QuestionRepository questionRepository;
    private final AnswerOptionRepository answerOptionRepository;
    private final QuizAttemptAnswerRepository quizAttemptAnswerRepository;
    private final EnrollmentAccessService enrollmentAccessService;

    /**
     * Use Case: Start a new quiz attempt (Student only)
     *
     * Access Control: Verifies student is enrolled in the course containing this quiz.
     */
    @Transactional
    public QuizAttemptResponse startQuiz(Long quizId) {
        log.info("Starting quiz attempt for quiz: {}", quizId);

        // STEP 1: Verify enrollment
        enrollmentAccessService.verifyCurrentStudentQuizAccess(quizId);

        // STEP 2: Load entities
        Account account = accountService.verifyCurrentAccount();
        Student student = loadStudent(account);
        Quiz quiz = loadQuiz(quizId);

        // STEP 3: Check if student can attempt (domain logic)
        long attemptCount = countStudentAttempts(student.getId(), quizId);
        if (!quiz.canAttempt((int) attemptCount)) {
            throw new InvalidRequestException("Maximum attempts reached for this quiz");
        }

        // STEP 4: Create and start attempt (domain logic)
        QuizAttempt attempt = QuizAttempt.builder()
                .quiz(quiz)
                .student(student)
                .attemptNumber((int) attemptCount + 1)
                .status(QuizAttemptStatus.IN_PROGRESS)
                .build();

        attempt.start(); // Domain logic
        attempt.validate(); // Domain validation

        // Persist and return
        attempt = quizAttemptRepository.save(attempt);
        log.info("Quiz attempt started: attemptId={}", attempt.getId());
        return QuizAttemptMapper.toResponse(attempt);
    }

    /**
     * Use Case: Get quiz attempt details
     */
    public QuizAttemptResponse getQuizAttempt(Long quizId, Long attemptId) {
        QuizAttempt attempt = loadAttempt(attemptId);
        validateAttemptBelongsToQuiz(attempt, quizId);
        return QuizAttemptMapper.toResponse(attempt);
    }

    /**
     * Use Case: Submit an answer for a question (Student only)
     *
     * Access Control: Verifies student is enrolled and owns the attempt.
     */
    @Transactional
    public void submitAnswer(Long quizId, Long attemptId, SubmitAnswerRequest request) {
        log.info("Submitting answer for attempt: {}", attemptId);

        // STEP 1: Verify enrollment
        enrollmentAccessService.verifyCurrentStudentQuizAccess(quizId);

        // STEP 2: Load entities
        QuizAttempt attempt = loadAttempt(attemptId);
        validateAttemptBelongsToQuiz(attempt, quizId);

        // STEP 3: Verify ownership (student can only submit to their own attempt)
        Account account = accountService.verifyCurrentAccount();
        Student student = loadStudent(account);
        if (!attempt.getStudent().getId().equals(student.getId())) {
            throw new InvalidRequestException("You can only submit answers to your own quiz attempt");
        }

        // Check if attempt is in progress (domain logic)
        if (!attempt.isInProgress()) {
            throw new InvalidRequestException("Quiz attempt is not in progress");
        }

        // Check time limit (domain logic)
        if (attempt.isTimeExceeded()) {
            attempt.abandon(); // Domain logic
            quizAttemptRepository.save(attempt);
            throw new InvalidRequestException("Time limit exceeded for this quiz");
        }

        // Load question and validate
        Question question = loadQuestion(request.getQuestionId());

        // Load and validate selected option(s)
        AnswerOption selectedOption = loadSelectedOption(request, question);
        String selectedOptionIdsJson = serializeSelectedOptions(request);

        // Find or create answer
        QuizAttemptAnswer answer = findOrCreateAnswer(attempt, question, attemptId, request.getQuestionId());

        // Update answer data
        answer.setSelectedOption(selectedOption);
        answer.setAnswerText(request.getAnswerText());
        answer.setSelectedOptionIds(selectedOptionIdsJson);

        // Save answer
        quizAttemptAnswerRepository.save(answer);
        log.info("Answer submitted for attempt: {}", attemptId);
    }

    /**
     * Use Case: Finish quiz attempt (Student only)
     *
     * Access Control: Verifies student is enrolled and owns the attempt.
     */
    @Transactional
    public QuizAttemptResponse finishQuiz(Long quizId, Long attemptId) {
        log.info("Finishing quiz attempt: {}", attemptId);

        // STEP 1: Verify enrollment
        enrollmentAccessService.verifyCurrentStudentQuizAccess(quizId);

        // STEP 2: Load attempt
        QuizAttempt attempt = loadAttempt(attemptId);
        validateAttemptBelongsToQuiz(attempt, quizId);

        // STEP 3: Verify ownership
        Account account = accountService.verifyCurrentAccount();
        Student student = loadStudent(account);
        if (!attempt.getStudent().getId().equals(student.getId())) {
            throw new InvalidRequestException("You can only finish your own quiz attempt");
        }

        if (attempt.isCompleted()) {
            return QuizAttemptMapper.toResponse(attempt);
        }

        // Use domain logic to finish with auto-grading
        attempt.finishWithAutoGrading();

        // Persist and return
        attempt = quizAttemptRepository.save(attempt);
        log.info("Quiz attempt finished: attemptId={}, score={}", attempt.getId(), attempt.getTotalScore());
        return QuizAttemptMapper.toResponse(attempt);
    }

    /**
     * Use Case: Abandon/cancel a quiz attempt
     */
    @Transactional
    public QuizAttemptResponse abandonQuizAttempt(Long quizId, Long attemptId) {
        QuizAttempt attempt = loadAttempt(attemptId);
        validateAttemptBelongsToQuiz(attempt, quizId);

        if (attempt.isCompleted()) {
            throw new InvalidRequestException("Cannot abandon a completed attempt");
        }

        // Use domain logic to abandon
        attempt.abandon();

        attempt = quizAttemptRepository.save(attempt);
        return QuizAttemptMapper.toResponse(attempt);
    }

    /**
     * Use Case: Get student's quiz attempts
     */
    public List<QuizAttemptResponse> getStudentQuizAttempts(Long studentId) {
        return quizAttemptRepository.findByStudentId(studentId).stream()
                .map(QuizAttemptMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Use Case: Get all attempts for a quiz
     */
    public List<QuizAttemptResponse> getQuizResults(Long quizId) {
        return quizAttemptRepository.findByQuizId(quizId).stream()
                .map(QuizAttemptMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Use Case: Get student's attempts for specific quiz
     */
    public List<QuizAttemptResponse> getStudentQuizAttemptsByQuiz(Long studentId, Long quizId) {
        return quizAttemptRepository.findByStudentId(studentId).stream()
                .filter(a -> a.getQuiz().getId().equals(quizId))
                .map(QuizAttemptMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Use Case: Get best score for a student on a quiz
     */
    public Double getBestScore(Long studentId, Long quizId) {
        return quizAttemptRepository.findByStudentId(studentId).stream()
                .filter(a -> a.getQuiz().getId().equals(quizId))
                .filter(QuizAttempt::isCompleted)
                .map(QuizAttempt::getTotalScore)
                .filter(score -> score != null)
                .max(Double::compare)
                .orElse(null);
    }

    // ========== Helper methods for orchestration ==========

    private Student loadStudent(Account account) {
        return studentRepository.findByAccount(account)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
    }

    private Quiz loadQuiz(Long quizId) {
        return quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));
    }

    private QuizAttempt loadAttempt(Long attemptId) {
        return quizAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz attempt not found"));
    }

    private Question loadQuestion(Long questionId) {
        return questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));
    }

    private void validateAttemptBelongsToQuiz(QuizAttempt attempt, Long quizId) {
        if (!attempt.getQuiz().getId().equals(quizId)) {
            throw new InvalidRequestException("Attempt does not belong to this quiz");
        }
    }

    private long countStudentAttempts(Long studentId, Long quizId) {
        return quizAttemptRepository.findByStudentId(studentId).stream()
                .filter(a -> a.getQuiz().getId().equals(quizId))
                .count();
    }

    private AnswerOption loadSelectedOption(SubmitAnswerRequest request, Question question) {
        if (request.getSelectedOptionId() == null) {
            return null;
        }

        AnswerOption selectedOption = answerOptionRepository.findById(request.getSelectedOptionId())
                .orElseThrow(() -> new ResourceNotFoundException("Answer option not found"));

        // Use domain logic to validate
        if (!selectedOption.belongsToQuestion(question.getId())) {
            throw new InvalidRequestException("Option does not belong to the question");
        }

        return selectedOption;
    }

    private String serializeSelectedOptions(SubmitAnswerRequest request) {
        if (request.getSelectedOptionIds() == null || request.getSelectedOptionIds().isEmpty()) {
            return null;
        }

        try {
            return new com.fasterxml.jackson.databind.ObjectMapper()
                    .writeValueAsString(request.getSelectedOptionIds());
        } catch (Exception e) {
            throw new InvalidRequestException("Invalid selectedOptionIds format");
        }
    }

    private QuizAttemptAnswer findOrCreateAnswer(QuizAttempt attempt, Question question,
                                                  Long attemptId, Long questionId) {
        Optional<QuizAttemptAnswer> existingAnswer = quizAttemptAnswerRepository
                .findByQuizAttemptIdAndQuestionId(attemptId, questionId);

        if (existingAnswer.isPresent()) {
            return existingAnswer.get();
        }

        return QuizAttemptAnswer.builder()
                .quizAttempt(attempt)
                .question(question)
                .build();
    }

    /**
     * Use Case: Get remaining time for an in-progress attempt
     */
    public Long getRemainingTime(Long attemptId) {
        QuizAttempt attempt = loadAttempt(attemptId);

        if (!attempt.isInProgress()) {
            return 0L;
        }

        return attempt.getRemainingTimeMinutes();
    }

    /**
     * Use Case: Auto-finish attempts that exceeded time limit (scheduled task)
     */
    @Transactional
    public void autoFinishExpiredAttempts() {
        List<QuizAttempt> inProgressAttempts = quizAttemptRepository.findAll().stream()
                .filter(QuizAttempt::isInProgress)
                .filter(QuizAttempt::isTimeExceeded)
                .collect(Collectors.toList());

        for (QuizAttempt attempt : inProgressAttempts) {
            // Use domain logic to finish with auto-grading
            attempt.finishWithAutoGrading();
            quizAttemptRepository.save(attempt);
        }
    }
}
