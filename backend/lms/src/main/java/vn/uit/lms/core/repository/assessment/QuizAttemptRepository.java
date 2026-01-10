package vn.uit.lms.core.repository.assessment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.uit.lms.core.domain.assessment.QuizAttempt;

import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long>, JpaSpecificationExecutor<QuizAttempt> {
    List<QuizAttempt> findByStudentId(Long studentId);
    List<QuizAttempt> findByQuizId(Long quizId);

    /**
     * Delete all quiz attempts for a quiz (for cascade delete)
     */
    @Modifying
    @Query("DELETE FROM QuizAttempt qa WHERE qa.quiz.id = :quizId")
    void deleteByQuizId(@Param("quizId") Long quizId);
}
