package vn.uit.lms.core.repository.assessment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import vn.uit.lms.core.domain.assessment.Quiz;

import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long>, JpaSpecificationExecutor<Quiz> {
    List<Quiz> findByLessonId(Long lessonId);

    /**
     * Find independent quizzes (not linked to any lesson)
     * Useful for quiz library/pool management
     */
    List<Quiz> findByLessonIsNull();
}
