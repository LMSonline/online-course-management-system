package vn.uit.lms.core.repository.assessment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.uit.lms.core.domain.assessment.QuizAttemptAnswer;

import java.util.Optional;

@Repository
public interface QuizAttemptAnswerRepository extends JpaRepository<QuizAttemptAnswer, Long> {
    Optional<QuizAttemptAnswer> findByQuizAttemptIdAndQuestionId(Long quizAttemptId, Long questionId);
}
