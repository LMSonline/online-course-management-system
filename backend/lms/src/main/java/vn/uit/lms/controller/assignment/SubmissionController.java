package vn.uit.lms.controller.assignment;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.assignment.SubmissionService;
import vn.uit.lms.shared.dto.request.assignment.FeedbackSubmissionRequest;
import vn.uit.lms.shared.dto.request.assignment.GradeSubmissionRequest;
import vn.uit.lms.shared.util.annotation.StudentOnly;
import vn.uit.lms.shared.util.annotation.StudentOrTeacher;
import vn.uit.lms.shared.util.annotation.TeacherOnly;

@RestController
@RequiredArgsConstructor
public class SubmissionController {
    private final SubmissionService submissionService;

    @PostMapping("/assignments/{assignmentId}/submit")
    @StudentOnly
    public ResponseEntity<?> submitAssignment(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(submissionService.submitAssignment(assignmentId));
    }

    @GetMapping("/assignments/{assignmentId}/submissions")
    @TeacherOnly
    public ResponseEntity<?> getSubmissions(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(submissionService.getSubmissionsByAssignment(assignmentId));
    }

    @GetMapping("/submissions/{id}")
    @StudentOrTeacher
    public ResponseEntity<?> getSubmission(@PathVariable Long id) {
        return ResponseEntity.ok(submissionService.getSubmissionById(id));
    }

    @PostMapping("/submissions/{id}/grade")
    @TeacherOnly
    public ResponseEntity<?> gradeSubmission(@PathVariable Long id, @RequestBody @Valid GradeSubmissionRequest request) {
        return ResponseEntity.ok(submissionService.gradeSubmission(id, request));
    }

    @PostMapping("/submissions/{id}/feedback")
    @TeacherOnly
    public ResponseEntity<?> feedbackSubmission(@PathVariable Long id, @RequestBody @Valid FeedbackSubmissionRequest request) {
        return ResponseEntity.ok(submissionService.feedbackSubmission(id, request));
    }

    @GetMapping("/students/{studentId}/submissions")
    @StudentOrTeacher
    public ResponseEntity<?> getStudentSubmissions(@PathVariable Long studentId) {
        return ResponseEntity.ok(submissionService.getStudentSubmissions(studentId));
    }

    @DeleteMapping("/submissions/{id}")
    @StudentOnly
    public ResponseEntity<?> deleteSubmission(@PathVariable Long id) {
        submissionService.deleteSubmission(id);
        return ResponseEntity.ok().build();
    }
}
