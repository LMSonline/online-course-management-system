package vn.uit.lms.controller.assignment;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.assignment.SubmissionService;
import vn.uit.lms.shared.dto.request.assignment.FeedbackSubmissionRequest;
import vn.uit.lms.shared.dto.request.assignment.GradeSubmissionRequest;

@RestController
@RequiredArgsConstructor
public class SubmissionController {
    private final SubmissionService submissionService;

    @PostMapping("/assignments/{assignmentId}/submit")
    public ResponseEntity<?> submitAssignment(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(submissionService.submitAssignment(assignmentId));
    }

    @GetMapping("/assignments/{assignmentId}/submissions")
    public ResponseEntity<?> getSubmissions(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(submissionService.getSubmissionsByAssignment(assignmentId));
    }

    @GetMapping("/submissions/{id}")
    public ResponseEntity<?> getSubmission(@PathVariable Long id) {
        return ResponseEntity.ok(submissionService.getSubmissionById(id));
    }

    @PostMapping("/submissions/{id}/grade")
    public ResponseEntity<?> gradeSubmission(@PathVariable Long id, @RequestBody @Valid GradeSubmissionRequest request) {
        return ResponseEntity.ok(submissionService.gradeSubmission(id, request));
    }

    @PostMapping("/submissions/{id}/feedback")
    public ResponseEntity<?> feedbackSubmission(@PathVariable Long id, @RequestBody @Valid FeedbackSubmissionRequest request) {
        return ResponseEntity.ok(submissionService.feedbackSubmission(id, request));
    }

    @GetMapping("/students/{studentId}/submissions")
    public ResponseEntity<?> getStudentSubmissions(@PathVariable Long studentId) {
        return ResponseEntity.ok(submissionService.getStudentSubmissions(studentId));
    }

    @DeleteMapping("/submissions/{id}")
    public ResponseEntity<?> deleteSubmission(@PathVariable Long id) {
        submissionService.deleteSubmission(id);
        return ResponseEntity.ok().build();
    }
}
