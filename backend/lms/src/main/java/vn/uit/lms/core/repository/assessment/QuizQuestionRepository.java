package vn.uit.lms.core.repository.assessment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.uit.lms.core.domain.assessment.QuizQuestion;

import java.util.Optional;

@Repository
public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, Long> {
    Optional<QuizQuestion> findByQuizIdAndQuestionId(Long quizId, Long questionId);
    void deleteByQuizIdAndQuestionId(Long quizId, Long questionId);
}
