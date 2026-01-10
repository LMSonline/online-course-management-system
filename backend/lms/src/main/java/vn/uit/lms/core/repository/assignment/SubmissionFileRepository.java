package vn.uit.lms.core.repository.assignment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.uit.lms.core.domain.assignment.SubmissionFile;

import java.util.List;

@Repository
public interface SubmissionFileRepository extends JpaRepository<SubmissionFile, Long>, JpaSpecificationExecutor<SubmissionFile> {
    List<SubmissionFile> findBySubmissionId(Long submissionId);

    /**
     * Delete all submission files for a submission (for cascade delete)
     */
    @Modifying
    @Query("DELETE FROM SubmissionFile sf WHERE sf.submission.id = :submissionId")
    void deleteBySubmissionId(@Param("submissionId") Long submissionId);
}
