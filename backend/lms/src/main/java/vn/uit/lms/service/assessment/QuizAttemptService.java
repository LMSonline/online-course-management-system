package vn.uit.lms.service.assessment;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.domain.Account;
import vn.uit.lms.core.domain.Student;
import vn.uit.lms.core.domain.assessment.*;
import vn.uit.lms.core.repository.StudentRepository;
import vn.uit.lms.core.repository.assessment.*;
import vn.uit.lms.service.AccountService;
import vn.uit.lms.shared.constant.QuizAttemptStatus;
import vn.uit.lms.shared.dto.request.assessment.SubmitAnswerRequest;
import vn.uit.lms.shared.dto.response.assessment.QuizAttemptResponse;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.QuizAttemptMapper;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizAttemptService {
    private final QuizAttemptRepository quizAttemptRepository;
    private final QuizRepository quizRepository;
    private final StudentRepository studentRepository;
    private final AccountService accountService;
    private final QuestionRepository questionRepository;
    private final AnswerOptionRepository answerOptionRepository;
    private final QuizAttemptAnswerRepository quizAttemptAnswerRepository;

    @Transactional
    public QuizAttemptResponse startQuiz(Long quizId) {
        Account account = accountService.verifyCurrentAccount();
        Student student = studentRepository.findByAccount(account)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));

        // Count existing attempts
        long attemptCount = quizAttemptRepository.findByStudentId(student.getId()).stream()
                .filter(a -> a.getQuiz().getId().equals(quizId))
                .count();

        // Check if student can attempt using rich domain logic
        if (!quiz.canAttempt((int) attemptCount)) {
            throw new InvalidRequestException("Maximum attempts reached for this quiz");
        }

        QuizAttempt attempt = QuizAttempt.builder()
                .quiz(quiz)
                .student(student)
                .attemptNumber((int) attemptCount + 1)
                .status(QuizAttemptStatus.IN_PROGRESS)
                .build();

        // Use rich domain logic to start
        attempt.start();

        // Validate using rich domain logic
        attempt.validate();

        attempt = quizAttemptRepository.save(attempt);
        return QuizAttemptMapper.toResponse(attempt);
    }

    public QuizAttemptResponse getQuizAttempt(Long quizId, Long attemptId) {
        QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz attempt not found"));

        if (!attempt.getQuiz().getId().equals(quizId)) {
            throw new InvalidRequestException("Attempt does not belong to this quiz");
        }

        return QuizAttemptMapper.toResponse(attempt);
    }

    @Transactional
    public void submitAnswer(Long quizId, Long attemptId, SubmitAnswerRequest request) {
        QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz attempt not found"));

        if (!attempt.getQuiz().getId().equals(quizId)) {
            throw new InvalidRequestException("Attempt does not belong to this quiz");
        }

        // Check if attempt is in progress using rich domain logic
        if (!attempt.isInProgress()) {
            throw new InvalidRequestException("Quiz attempt is not in progress");
        }

        // Check time limit using rich domain logic
        if (attempt.isTimeExceeded()) {
            attempt.abandon();
            quizAttemptRepository.save(attempt);
            throw new InvalidRequestException("Time limit exceeded for this quiz");
        }

        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        AnswerOption selectedOption = null;
        if (request.getSelectedOptionId() != null) {
            selectedOption = answerOptionRepository.findById(request.getSelectedOptionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Answer option not found"));

            if (!selectedOption.getQuestion().getId().equals(question.getId())) {
                throw new InvalidRequestException("Option does not belong to the question");
            }
        }

        String selectedOptionIdsJson = null;
        if (request.getSelectedOptionIds() != null && !request.getSelectedOptionIds().isEmpty()) {
            try {
                selectedOptionIdsJson = new com.fasterxml.jackson.databind.ObjectMapper()
                        .writeValueAsString(request.getSelectedOptionIds());
            } catch (Exception e) {
                throw new InvalidRequestException("Invalid selectedOptionIds format");
            }
        }

        Optional<QuizAttemptAnswer> existingAnswer = quizAttemptAnswerRepository
                .findByQuizAttemptIdAndQuestionId(attemptId, request.getQuestionId());

        QuizAttemptAnswer answer;
        if (existingAnswer.isPresent()) {
            answer = existingAnswer.get();
            answer.setSelectedOption(selectedOption);
            answer.setAnswerText(request.getAnswerText());
            answer.setSelectedOptionIds(selectedOptionIdsJson);
        } else {
            answer = QuizAttemptAnswer.builder()
                    .quizAttempt(attempt)
                    .question(question)
                    .selectedOption(selectedOption)
                    .answerText(request.getAnswerText())
                    .selectedOptionIds(selectedOptionIdsJson)
                    .build();
        }
        quizAttemptAnswerRepository.save(answer);
    }

    @Transactional
    public QuizAttemptResponse finishQuiz(Long quizId, Long attemptId) {
        QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz attempt not found"));

        if (!attempt.getQuiz().getId().equals(quizId)) {
            throw new InvalidRequestException("Attempt does not belong to this quiz");
        }

        if (attempt.isCompleted()) {
            return QuizAttemptMapper.toResponse(attempt);
        }

        // Calculate score
        double score = calculateScore(attempt);

        // Use rich domain logic to finish
        attempt.finish(score);

        attempt = quizAttemptRepository.save(attempt);
        return QuizAttemptMapper.toResponse(attempt);
    }

    private double calculateScore(QuizAttempt attempt) {
        List<QuizAttemptAnswer> answers = attempt.getAnswers();
        if (answers == null || answers.isEmpty()) {
            return 0.0;
        }

        long correctCount = answers.stream()
                .filter(a -> a.getSelectedOption() != null && a.getSelectedOption().isCorrect())
                .count();

        int totalQuestions = attempt.getQuiz().getQuestionCount();
        if (totalQuestions == 0) {
            return 0.0;
        }

        // Calculate score based on total points if available
        Double totalPoints = attempt.getQuiz().getTotalPoints();
        if (totalPoints != null && totalPoints > 0) {
            return (double) correctCount / totalQuestions * totalPoints;
        }

        // Default: scale to 10
        return (double) correctCount / totalQuestions * 10.0;
    }

    public List<QuizAttemptResponse> getStudentQuizAttempts(Long studentId) {
        return quizAttemptRepository.findByStudentId(studentId).stream()
                .map(QuizAttemptMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<QuizAttemptResponse> getQuizResults(Long quizId) {
        return quizAttemptRepository.findByQuizId(quizId).stream()
                .map(QuizAttemptMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Abandon/cancel a quiz attempt (timeout or student gave up)
     */
    @Transactional
    public QuizAttemptResponse abandonQuizAttempt(Long quizId, Long attemptId) {
        QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz attempt not found"));

        if (!attempt.getQuiz().getId().equals(quizId)) {
            throw new InvalidRequestException("Attempt does not belong to this quiz");
        }

        if (attempt.isCompleted()) {
            throw new InvalidRequestException("Cannot abandon a completed attempt");
        }

        // Use rich domain logic to abandon
        attempt.abandon();

        attempt = quizAttemptRepository.save(attempt);
        return QuizAttemptMapper.toResponse(attempt);
    }

    /**
     * Get quiz attempts by student for a specific quiz
     */
    public List<QuizAttemptResponse> getStudentQuizAttemptsByQuiz(Long studentId, Long quizId) {
        return quizAttemptRepository.findByStudentId(studentId).stream()
                .filter(a -> a.getQuiz().getId().equals(quizId))
                .map(QuizAttemptMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get best attempt score for a student on a quiz
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

    /**
     * Get remaining time for an in-progress attempt
     */
    public Long getRemainingTime(Long attemptId) {
        QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz attempt not found"));

        if (!attempt.isInProgress()) {
            return 0L;
        }

        return attempt.getRemainingTimeMinutes();
    }

    /**
     * Auto-finish attempts that exceeded time limit (scheduled task)
     */
    @Transactional
    public void autoFinishExpiredAttempts() {
        List<QuizAttempt> inProgressAttempts = quizAttemptRepository.findAll().stream()
                .filter(QuizAttempt::isInProgress)
                .filter(QuizAttempt::isTimeExceeded)
                .collect(Collectors.toList());

        for (QuizAttempt attempt : inProgressAttempts) {
            // Calculate score from existing answers
            double score = calculateScore(attempt);
            attempt.finish(score);
            quizAttemptRepository.save(attempt);
        }
    }
}
