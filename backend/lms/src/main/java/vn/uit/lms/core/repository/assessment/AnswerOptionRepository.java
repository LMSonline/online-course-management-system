package vn.uit.lms.core.repository.assessment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import vn.uit.lms.core.entity.assessment.AnswerOption;

import java.util.List;

@Repository
public interface AnswerOptionRepository extends JpaRepository<AnswerOption, Long>, JpaSpecificationExecutor<AnswerOption> {
    List<AnswerOption> findByQuestionId(Long questionId);
    void deleteByQuestionId(Long questionId);
}
