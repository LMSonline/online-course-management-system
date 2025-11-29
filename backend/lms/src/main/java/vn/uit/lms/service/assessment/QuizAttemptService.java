package vn.uit.lms.service.assessment;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.entity.Account;
import vn.uit.lms.core.entity.Student;
import vn.uit.lms.core.entity.assessment.*;
import vn.uit.lms.core.repository.StudentRepository;
import vn.uit.lms.core.repository.assessment.*;
import vn.uit.lms.service.AccountService;
import vn.uit.lms.shared.constant.QuizAttemptStatus;
import vn.uit.lms.shared.dto.request.assessment.SubmitAnswerRequest;
import vn.uit.lms.shared.dto.response.assessment.QuizAttemptResponse;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.QuizAttemptMapper;

import java.time.Instant;
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

        // Calculate attempt number
        // This is a bit naive, might need a repository method to count attempts for this student and quiz
        // Assuming we can just count existing attempts + 1
        // But we don't have a count method exposed in repository yet, let's assume we can fetch list or add method.
        // For now, let's just fetch all and count. Not efficient but works for now.
        // Or better, add countByStudentIdAndQuizId to repository.
        // Since I cannot edit repository easily without seeing it, I will use findByStudentId and filter.
        // Actually I can use findByStudentId from existing code.

        // Wait, findByStudentId returns all attempts for student.
        // Let's filter by quizId.
        long attemptCount = quizAttemptRepository.findByStudentId(student.getId()).stream()
                .filter(a -> a.getQuiz().getId().equals(quizId))
                .count();

        QuizAttempt attempt = QuizAttempt.builder()
                .quiz(quiz)
                .student(student)
                .startedAt(Instant.now())
                .attemptNumber((int) attemptCount + 1)
                .status(QuizAttemptStatus.IN_PROGRESS)
                .build();

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

        if (attempt.getFinishedAt() != null) {
            throw new InvalidRequestException("Quiz attempt is already finished");
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
                selectedOptionIdsJson = new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(request.getSelectedOptionIds());
            } catch (Exception e) {
                throw new InvalidRequestException("Invalid selectedOptionIds format");
            }
        }

        Optional<QuizAttemptAnswer> existingAnswer = quizAttemptAnswerRepository.findByQuizAttemptIdAndQuestionId(attemptId, request.getQuestionId());

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

        if (attempt.getFinishedAt() != null) {
            return QuizAttemptMapper.toResponse(attempt);
        }

        attempt.setFinishedAt(Instant.now());
        attempt.setStatus(QuizAttemptStatus.COMPLETED);

        // Calculate score
        double score = 0;
        List<QuizAttemptAnswer> answers = attempt.getAnswers();
        if (answers != null) {
            long correctCount = answers.stream()
                    .filter(a -> a.getSelectedOption() != null && a.getSelectedOption().isCorrect())
                    .count();

            // Assuming total questions is based on quiz questions.
            // If quiz has questions linked via QuizQuestion, we should count them.
            // For now, let's assume score is just number of correct answers, or percentage if we knew total.
            // Let's check Quiz entity. It has quizQuestions.
            // Ý nó nói là QuizQuestions là số câu hỏi trong quiz.
            int totalQuestions = attempt.getQuiz().getQuizQuestions().size();
            if (totalQuestions > 0) {
                score = ((double) correctCount / totalQuestions) * 10.0; // Scale to 10
            }
        }
        attempt.setTotalScore(score);
        attempt = quizAttemptRepository.save(attempt);

        return QuizAttemptMapper.toResponse(attempt);
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
}
