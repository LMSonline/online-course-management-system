package vn.uit.lms.core.repository.assignment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import vn.uit.lms.core.entity.assignment.SubmissionFile;

import java.util.List;

@Repository
public interface SubmissionFileRepository extends JpaRepository<SubmissionFile, Long>, JpaSpecificationExecutor<SubmissionFile> {
    List<SubmissionFile> findBySubmissionId(Long submissionId);
}
