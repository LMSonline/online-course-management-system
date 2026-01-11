package vn.uit.lms.core.repository.assessment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.uit.lms.core.domain.assessment.QuizQuestion;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, Long> {
    Optional<QuizQuestion> findByQuizIdAndQuestionId(Long quizId, Long questionId);
    void deleteByQuizIdAndQuestionId(Long quizId, Long questionId);
    List<QuizQuestion> findByQuizId(Long quizId);

    /**
     * Delete all quiz questions for a quiz (for cascade delete)
     */
    @Modifying
    @Query("DELETE FROM QuizQuestion qq WHERE qq.quiz.id = :quizId")
    void deleteByQuizId(@Param("quizId") Long quizId);
}
