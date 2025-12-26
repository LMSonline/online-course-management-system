package vn.uit.lms.controller.assignment;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.uit.lms.service.assignment.SubmissionFileService;
import vn.uit.lms.shared.util.annotation.StudentOnly;
import vn.uit.lms.shared.util.annotation.StudentOrTeacher;

@RestController
@RequiredArgsConstructor
public class SubmissionFileController {
    private final SubmissionFileService submissionFileService;

    @PostMapping(value = "/submissions/{submissionId}/files/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @StudentOnly
    public ResponseEntity<?> uploadSubmissionFile(
            @PathVariable Long submissionId,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(submissionFileService.uploadSubmissionFile(submissionId, file));
    }

    @GetMapping("/submissions/{submissionId}/files")
    @StudentOrTeacher
    public ResponseEntity<?> getSubmissionFiles(@PathVariable Long submissionId) {
        return ResponseEntity.ok(submissionFileService.getSubmissionFiles(submissionId));
    }

    @DeleteMapping("/submissions/{submissionId}/files/{fileId}")
    @StudentOnly
    public ResponseEntity<?> deleteSubmissionFile(@PathVariable Long submissionId, @PathVariable Long fileId) {
        submissionFileService.deleteSubmissionFile(submissionId, fileId);
        return ResponseEntity.ok().build();
    }
}
