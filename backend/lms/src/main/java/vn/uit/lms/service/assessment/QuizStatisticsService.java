package vn.uit.lms.service.assessment;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.uit.lms.core.domain.Account;
import vn.uit.lms.core.domain.Student;
import vn.uit.lms.core.domain.assessment.Quiz;
import vn.uit.lms.core.domain.assessment.QuizAttempt;
import vn.uit.lms.core.repository.StudentRepository;
import vn.uit.lms.core.repository.assessment.QuizAttemptRepository;
import vn.uit.lms.core.repository.assessment.QuizRepository;
import vn.uit.lms.service.AccountService;
import vn.uit.lms.shared.dto.response.assessment.QuizEligibilityResponse;
import vn.uit.lms.shared.dto.response.assessment.QuizStatisticsResponse;
import vn.uit.lms.shared.exception.ResourceNotFoundException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizStatisticsService {
    private final QuizRepository quizRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final StudentRepository studentRepository;
    private final AccountService accountService;

    /**
     * Check if a student can attempt a quiz
     */
    public QuizEligibilityResponse checkEligibility(Long quizId) {
        Account account = accountService.verifyCurrentAccount();
        Student student = studentRepository.findByAccount(account)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));

        List<QuizAttempt> attempts = quizAttemptRepository.findByStudentId(student.getId()).stream()
                .filter(a -> a.getQuiz().getId().equals(quizId))
                .collect(Collectors.toList());
        
        int attemptCount = attempts.size();
        boolean canAttemptCount = quiz.canAttempt(attemptCount);
        boolean isAvailable = quiz.isAvailable();
        boolean canAttempt = canAttemptCount && isAvailable;
        String reason = null;
        
        if (!isAvailable) {
            reason = quiz.getAvailabilityMessage();
        } else if (!canAttemptCount) {
            reason = "Maximum attempts reached for this quiz";
        }

        return QuizEligibilityResponse.builder()
                .quizId(quiz.getId())
                .quizTitle(quiz.getTitle())
                .canAttempt(canAttempt)
                .currentAttempts(attemptCount)
                .maxAttempts(quiz.getMaxAttempts())
                .remainingAttempts(quiz.getRemainingAttempts(attemptCount))
                .reason(reason)
                .isAvailable(isAvailable)
                .startDate(quiz.getStartDate())
                .endDate(quiz.getEndDate())
                .availabilityMessage(quiz.getAvailabilityMessage())
                .build();
    }

    /**
     * Get statistics for a quiz (for teachers)
     */
    public QuizStatisticsResponse getQuizStatistics(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));

        List<QuizAttempt> allAttempts = quizAttemptRepository.findByQuizId(quizId);
        
        int totalAttempts = allAttempts.size();
        
        long completedCount = allAttempts.stream()
                .filter(QuizAttempt::isCompleted)
                .count();
        
        long inProgressCount = allAttempts.stream()
                .filter(QuizAttempt::isInProgress)
                .count();
        
        long cancelledCount = allAttempts.stream()
                .filter(QuizAttempt::isAbandoned)
                .count();

        List<QuizAttempt> completedAttempts = allAttempts.stream()
                .filter(QuizAttempt::isCompleted)
                .collect(Collectors.toList());

        // Calculate score statistics
        List<Double> scores = completedAttempts.stream()
                .map(QuizAttempt::getTotalScore)
                .filter(score -> score != null)
                .collect(Collectors.toList());

        Double averageScore = scores.isEmpty() ? null :
                scores.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
        Double highestScore = scores.isEmpty() ? null :
                scores.stream().max(Double::compare).orElse(null);
        Double lowestScore = scores.isEmpty() ? null :
                scores.stream().min(Double::compare).orElse(null);

        // Calculate pass rate
        long passedCount = completedAttempts.stream()
                .filter(QuizAttempt::isPassing)
                .count();
        Double passRate = completedCount > 0 ? (passedCount * 100.0 / completedCount) : 0.0;

        // Calculate average time spent
        Double averageTimeSpent = completedAttempts.stream()
                .mapToLong(QuizAttempt::getTimeSpentMinutes)
                .average()
                .orElse(0.0);

        return QuizStatisticsResponse.builder()
                .quizId(quiz.getId())
                .quizTitle(quiz.getTitle())
                .totalAttempts(totalAttempts)
                .completedAttempts((int) completedCount)
                .inProgressAttempts((int) inProgressCount)
                .cancelledAttempts((int) cancelledCount)
                .averageScore(averageScore)
                .highestScore(highestScore)
                .lowestScore(lowestScore)
                .passRate(passRate)
                .averageTimeSpentMinutes(averageTimeSpent)
                .build();
    }
}
