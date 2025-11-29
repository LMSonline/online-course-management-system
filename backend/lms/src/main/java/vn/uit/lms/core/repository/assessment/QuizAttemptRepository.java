package vn.uit.lms.core.repository.assessment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import vn.uit.lms.core.entity.assessment.QuizAttempt;

import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long>, JpaSpecificationExecutor<QuizAttempt> {
    List<QuizAttempt> findByStudentId(Long studentId);
    List<QuizAttempt> findByQuizId(Long quizId);
}
