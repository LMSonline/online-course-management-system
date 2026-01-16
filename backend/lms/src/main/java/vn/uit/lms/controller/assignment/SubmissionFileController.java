package vn.uit.lms.controller.assignment;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.uit.lms.service.assignment.SubmissionFileService;
import vn.uit.lms.shared.dto.response.storage.FileStorageResponse;
import vn.uit.lms.shared.annotation.StudentOnly;
import vn.uit.lms.shared.annotation.StudentOrTeacher;

import java.util.List;
import java.util.Map;

/**
 * Controller for managing submission file uploads and downloads
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/submissions")
public class SubmissionFileController {
    private final SubmissionFileService submissionFileService;

    /**
     * Upload single file to submission
     */
    @PostMapping("/{submissionId}/files")
    @StudentOnly
    public ResponseEntity<FileStorageResponse> uploadFile(
            @PathVariable Long submissionId,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(submissionFileService.uploadSubmissionFile(submissionId, file));
    }

    /**
     * Upload multiple files to submission
     */
    @PostMapping("/{submissionId}/files/batch")
    @StudentOnly
    public ResponseEntity<List<FileStorageResponse>> uploadMultipleFiles(
            @PathVariable Long submissionId,
            @RequestParam("files") List<MultipartFile> files) {
        return ResponseEntity.ok(submissionFileService.uploadMultipleFiles(submissionId, files));
    }

    /**
     * Get all files for a submission
     */
    @GetMapping("/{submissionId}/files")
    @StudentOrTeacher
    public ResponseEntity<List<FileStorageResponse>> getSubmissionFiles(@PathVariable Long submissionId) {
        return ResponseEntity.ok(submissionFileService.getSubmissionFiles(submissionId));
    }

    /**
     * Get download URL for a file from submission
     */
    @GetMapping("/{submissionId}/files/{fileId}/download")
    @StudentOrTeacher
    public ResponseEntity<Map<String, String>> getDownloadUrl(
            @PathVariable Long submissionId,
            @PathVariable Long fileId) {
        String downloadUrl = submissionFileService.getDownloadUrl(submissionId, fileId);

        return ResponseEntity.ok()
                .body(Map.of("downloadUrl", downloadUrl));
    }

    /**
     * Delete a file from submission
     */
    @DeleteMapping("/{submissionId}/files/{fileId}")
    @StudentOnly
    public ResponseEntity<Void> deleteFile(
            @PathVariable Long submissionId,
            @PathVariable Long fileId) {
        submissionFileService.deleteSubmissionFile(submissionId, fileId);
        return ResponseEntity.ok().build();
    }

    /**
     * Get file count for submission
     */
    @GetMapping("/{submissionId}/files/count")
    @StudentOrTeacher
    public ResponseEntity<Integer> getFileCount(@PathVariable Long submissionId) {
        return ResponseEntity.ok(submissionFileService.getFileCount(submissionId));
    }
}

