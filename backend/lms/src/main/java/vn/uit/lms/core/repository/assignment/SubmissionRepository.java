package vn.uit.lms.core.repository.assignment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import vn.uit.lms.core.domain.assignment.Submission;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long>, JpaSpecificationExecutor<Submission> {
    List<Submission> findByAssignmentId(Long assignmentId);
    List<Submission> findByStudentId(Long studentId);
    List<Submission> findByAssignmentIdAndStudentId(Long assignmentId, Long studentId);
    Optional<Submission> findFirstByAssignmentIdAndStudentIdOrderByAttemptNumberDesc(Long assignmentId, Long studentId);

    /**
     * Count submissions for an assignment (used for business rule validation)
     */
    long countByAssignmentId(Long assignmentId);
}
