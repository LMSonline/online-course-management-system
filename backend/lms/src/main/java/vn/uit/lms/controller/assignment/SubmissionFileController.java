package vn.uit.lms.controller.assignment;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.assignment.SubmissionFileService;

@RestController
@RequiredArgsConstructor
public class SubmissionFileController {
    private final SubmissionFileService submissionFileService;

    @PostMapping("/submissions/{submissionId}/files/upload")
    public ResponseEntity<?> uploadSubmissionFile(@PathVariable Long submissionId) {
        // Upload feature not implemented yet as requested
        return ResponseEntity.ok().build();
    }

    @GetMapping("/submissions/{submissionId}/files")
    public ResponseEntity<?> getSubmissionFiles(@PathVariable Long submissionId) {
        return ResponseEntity.ok(submissionFileService.getSubmissionFiles(submissionId));
    }

    @DeleteMapping("/submissions/{submissionId}/files/{fileId}")
    public ResponseEntity<?> deleteSubmissionFile(@PathVariable Long submissionId, @PathVariable Long fileId) {
        submissionFileService.deleteSubmissionFile(submissionId, fileId);
        return ResponseEntity.ok().build();
    }
}
