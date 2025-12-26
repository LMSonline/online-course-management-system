package vn.uit.lms.service.assignment;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import vn.uit.lms.core.domain.assignment.Submission;
import vn.uit.lms.core.domain.assignment.SubmissionFile;
import vn.uit.lms.core.domain.course.content.FileStorage;
import vn.uit.lms.core.repository.assignment.SubmissionFileRepository;
import vn.uit.lms.core.repository.assignment.SubmissionRepository;
import vn.uit.lms.service.course.content.FileStorageService;
import vn.uit.lms.shared.dto.response.assignment.SubmissionFileResponse;
import vn.uit.lms.shared.dto.response.storage.FileStorageResponse;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.AssignmentMapper;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubmissionFileService {
    private static final int DOWNLOAD_URL_EXPIRY_SECONDS = 3600; // 1 hour
    
    private final SubmissionFileRepository submissionFileRepository;
    private final SubmissionRepository submissionRepository;
    private final FileStorageService fileStorageService;

    public List<SubmissionFileResponse> getSubmissionFiles(Long submissionId) {
        return submissionFileRepository.findBySubmissionId(submissionId).stream()
                .map(submissionFile -> {
                    SubmissionFileResponse response = AssignmentMapper.toSubmissionFileResponse(submissionFile);
                    // Add download URL if file exists
                    if (submissionFile.getFile() != null) {
                        String downloadUrl = fileStorageService.generateDownloadUrl(
                            submissionFile.getFile().getId(), 
                            DOWNLOAD_URL_EXPIRY_SECONDS
                        );
                        // Build new response with download URL
                        return SubmissionFileResponse.builder()
                                .id(response.getId())
                                .fileName(response.getFileName())
                                .fileUrl(downloadUrl)
                                .build();
                    }
                    return response;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public SubmissionFileResponse uploadSubmissionFile(Long submissionId, MultipartFile file) {
        // Verify submission exists
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found"));
        
        // Upload file to storage
        FileStorageResponse fileStorageResponse = fileStorageService.uploadFile(
            file, 
            "submissions/" + submissionId, 
            null // Auto-detect storage provider
        );
        
        // Get FileStorage entity
        FileStorage fileStorage = fileStorageService.getFileStorageEntity(fileStorageResponse.getId());
        
        // Create SubmissionFile link
        SubmissionFile submissionFile = SubmissionFile.builder()
                .submission(submission)
                .file(fileStorage)
                .build();
        
        submissionFile = submissionFileRepository.save(submissionFile);
        
        return SubmissionFileResponse.builder()
                .id(submissionFile.getId())
                .fileName(fileStorage.getOriginalName())
                .fileUrl(fileStorageService.generateDownloadUrl(fileStorage.getId(), DOWNLOAD_URL_EXPIRY_SECONDS))
                .build();
    }

    @Transactional
    public void deleteSubmissionFile(Long submissionId, Long fileId) {
        SubmissionFile submissionFile = submissionFileRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission file not found"));
        
        // Verify file belongs to submission
        if (!submissionFile.getSubmission().getId().equals(submissionId)) {
            throw new InvalidRequestException("File does not belong to this submission");
        }
        
        // Delete the FileStorage
        if (submissionFile.getFile() != null) {
            fileStorageService.deleteFile(submissionFile.getFile().getId());
        }
        
        // Delete the SubmissionFile record
        submissionFileRepository.deleteById(fileId);
    }
}
