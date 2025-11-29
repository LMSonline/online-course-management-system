package vn.uit.lms.service.assignment;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.repository.assignment.SubmissionFileRepository;
import vn.uit.lms.shared.dto.response.assignment.SubmissionFileResponse;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.AssignmentMapper;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubmissionFileService {
    private final SubmissionFileRepository submissionFileRepository;

    public List<SubmissionFileResponse> getSubmissionFiles(Long submissionId) {
        return submissionFileRepository.findBySubmissionId(submissionId).stream()
                .map(AssignmentMapper::toSubmissionFileResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteSubmissionFile(Long submissionId, Long fileId) {
        if (!submissionFileRepository.existsById(fileId)) {
            throw new ResourceNotFoundException("Submission file not found");
        }
        // Optionally verify file belongs to submission
        submissionFileRepository.deleteById(fileId);
    }
}
