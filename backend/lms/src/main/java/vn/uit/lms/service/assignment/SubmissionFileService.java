package vn.uit.lms.service.assignment;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import vn.uit.lms.core.domain.Account;
import vn.uit.lms.core.domain.Student;
import vn.uit.lms.core.domain.assignment.Submission;
import vn.uit.lms.core.domain.assignment.SubmissionFile;
import vn.uit.lms.core.domain.course.content.FileStorage;
import vn.uit.lms.core.repository.StudentRepository;
import vn.uit.lms.core.repository.assignment.SubmissionFileRepository;
import vn.uit.lms.core.repository.assignment.SubmissionRepository;
import vn.uit.lms.service.AccountService;
import vn.uit.lms.service.course.content.FileStorageService;
import vn.uit.lms.shared.constant.StorageProvider;
import vn.uit.lms.shared.dto.response.storage.FileStorageResponse;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.exception.UnauthorizedException;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing submission file uploads and associations with FileStorage
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SubmissionFileService {
    private final SubmissionFileRepository submissionFileRepository;
    private final SubmissionRepository submissionRepository;
    private final FileStorageService fileStorageService;
    private final AccountService accountService;
    private final StudentRepository studentRepository;

    /**
     * Upload file and attach to submission
     */
    @Transactional
    public FileStorageResponse uploadSubmissionFile(Long submissionId, MultipartFile file) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found"));

        // Validate ownership - student can only upload files to their own submission
        validateStudentOwnership(submission);

        // Check if submission can be edited
        if (!submission.canBeEdited()) {
            throw new InvalidRequestException("Cannot upload files to a graded or rejected submission");
        }

        // Upload file to storage (use assignment folder structure)
        String folderPath = String.format("submissions/%d", submissionId);
        FileStorageResponse fileStorageResponse = fileStorageService.uploadFile(
                file,
                folderPath,
                StorageProvider.MINIO
        );

        // Get FileStorage entity
        FileStorage fileStorage = fileStorageService.getFileStorageEntity(fileStorageResponse.getId());

        // Create SubmissionFile association
        SubmissionFile submissionFile = SubmissionFile.builder()
                .submission(submission)
                .file(fileStorage)
                .build();

        submissionFileRepository.save(submissionFile);

        log.info("File uploaded to submission: submissionId={}, fileId={}, fileName={}",
                submissionId, fileStorage.getId(), file.getOriginalFilename());

        return fileStorageResponse;
    }

    /**
     * Upload multiple files to submission
     */
    @Transactional
    public List<FileStorageResponse> uploadMultipleFiles(Long submissionId, List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            throw new InvalidRequestException("No files provided");
        }

        return files.stream()
                .map(file -> uploadSubmissionFile(submissionId, file))
                .collect(Collectors.toList());
    }

    /**
     * Get all files for a submission
     */
    public List<FileStorageResponse> getSubmissionFiles(Long submissionId) {
        if (!submissionRepository.existsById(submissionId)) {
            throw new ResourceNotFoundException("Submission not found");
        }

        return submissionFileRepository.findBySubmissionId(submissionId).stream()
                .map(sf -> fileStorageService.getFileStorage(sf.getFile().getId()))
                .collect(Collectors.toList());
    }

    /**
     * Delete a file from submission
     */
    @Transactional
    public void deleteSubmissionFile(Long submissionId, Long fileId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found"));

        // Validate ownership - student can only delete files from their own submission
        validateStudentOwnership(submission);

        // Check if submission can be edited
        if (!submission.canBeEdited()) {
            throw new InvalidRequestException("Cannot delete files from a graded or rejected submission");
        }

        // Find the submission file association
        SubmissionFile submissionFile = submissionFileRepository.findBySubmissionId(submissionId).stream()
                .filter(sf -> sf.getFile().getId().equals(fileId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("File not found in this submission"));

        // Delete from storage
        try {
            fileStorageService.deleteFile(fileId);
        } catch (Exception e) {
            log.warn("Failed to delete file from storage: fileId={}", fileId, e);
        }

        // Delete association
        submissionFileRepository.delete(submissionFile);

        log.info("File deleted from submission: submissionId={}, fileId={}", submissionId, fileId);
    }

    /**
     * Delete all files from a submission (used when deleting submission)
     */
    @Transactional
    public void deleteAllSubmissionFiles(Long submissionId) {
        List<SubmissionFile> files = submissionFileRepository.findBySubmissionId(submissionId);

        for (SubmissionFile submissionFile : files) {
            try {
                fileStorageService.deleteFile(submissionFile.getFile().getId());
            } catch (Exception e) {
                log.warn("Failed to delete file from storage: fileId={}", submissionFile.getFile().getId(), e);
            }
        }

        submissionFileRepository.deleteAll(files);
        log.info("All files deleted from submission: submissionId={}, count={}", submissionId, files.size());
    }

    /**
     * Download file from submission - returns presigned URL
     */
    public String getDownloadUrl(Long submissionId, Long fileId) {
        // Verify file belongs to submission
        boolean fileExists = submissionFileRepository.findBySubmissionId(submissionId).stream()
                .anyMatch(sf -> sf.getFile().getId().equals(fileId));

        if (!fileExists) {
            throw new ResourceNotFoundException("File not found in this submission");
        }

        // Generate presigned URL valid for 1 hour (3600 seconds)
        return fileStorageService.generateDownloadUrl(fileId, 3600);
    }

    /**
     * Get file count for submission
     */
    public int getFileCount(Long submissionId) {
        return submissionFileRepository.findBySubmissionId(submissionId).size();
    }

    /**
     * Get specific submission file detail
     */
    public FileStorageResponse getSubmissionFile(Long submissionId, Long fileId) {
        // Verify file belongs to submission using rich domain logic
        SubmissionFile submissionFile = submissionFileRepository.findBySubmissionId(submissionId).stream()
                .filter(sf -> sf.getFile().getId().equals(fileId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("File not found in this submission"));

        // Use domain logic to get file information
        submissionFile.validate();

        return fileStorageService.getFileStorage(fileId);
    }

    /**
     * Get total file size for submission (uses rich domain logic)
     */
    public Long getTotalFileSize(Long submissionId) {
        List<SubmissionFile> files = submissionFileRepository.findBySubmissionId(submissionId);

        return files.stream()
                .map(SubmissionFile::getFileSizeBytes) // Use rich domain method
                .filter(java.util.Objects::nonNull)
                .reduce(0L, Long::sum);
    }


    /**
     * Validate that current user (student) owns the submission
     */
    private void validateStudentOwnership(Submission submission) {
        Account currentAccount = accountService.verifyCurrentAccount();
        Student currentStudent = studentRepository.findByAccount(currentAccount)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        if (!submission.getStudent().getId().equals(currentStudent.getId())) {
            throw new UnauthorizedException("You can only access your own submissions");
        }
    }
}

