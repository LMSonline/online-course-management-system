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

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
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

    @PutMapping("/submissions/{id}/content")
    @StudentOnly
    public ResponseEntity<?> updateSubmissionContent(@PathVariable Long id, @RequestBody String content) {
        return ResponseEntity.ok(submissionService.updateSubmissionContent(id, content));
    }

    @GetMapping("/assignments/{assignmentId}/my-submissions")
    @StudentOnly
    public ResponseEntity<?> getMySubmissions(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(submissionService.getMySubmissions(assignmentId));
    }

    @PostMapping("/assignments/{assignmentId}/resubmit")
    @StudentOnly
    public ResponseEntity<?> resubmitAssignment(
            @PathVariable Long assignmentId,
            @RequestParam Long previousSubmissionId) {
        return ResponseEntity.ok(submissionService.resubmitAssignment(assignmentId, previousSubmissionId));
    }

    @PostMapping("/submissions/bulk-grade")
    @TeacherOnly
    public ResponseEntity<?> bulkGradeSubmissions(
            @RequestBody List<Long> submissionIds,
            @RequestParam Double score,
            @RequestParam(required = false) String feedback) {
        return ResponseEntity.ok(submissionService.bulkGradeSubmissions(submissionIds, score, feedback));
    }

    @PostMapping("/submissions/{id}/reject")
    @TeacherOnly
    public ResponseEntity<?> rejectSubmission(@PathVariable Long id, @RequestParam String feedback) {
        return ResponseEntity.ok(submissionService.rejectSubmission(id, feedback));
    }

    @GetMapping("/assignments/{assignmentId}/submissions/by-status")
    @TeacherOnly
    public ResponseEntity<?> getSubmissionsByStatus(
            @PathVariable Long assignmentId,
            @RequestParam vn.uit.lms.shared.constant.SubmissionStatus status) {
        return ResponseEntity.ok(submissionService.getSubmissionsByStatus(assignmentId, status));
    }

    @GetMapping("/students/{studentId}/late-submissions")
    @TeacherOnly
    public ResponseEntity<?> getLateSubmissionsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(submissionService.getLateSubmissionsByStudent(studentId));
    }

    @GetMapping("/assignments/{assignmentId}/students/{studentId}/best-submission")
    @StudentOrTeacher
    public ResponseEntity<?> getBestSubmission(
            @PathVariable Long assignmentId,
            @PathVariable Long studentId) {
        return ResponseEntity.ok(submissionService.getBestSubmission(assignmentId, studentId));
    }

    @GetMapping("/students/{studentId}/average-score")
    @StudentOrTeacher
    public ResponseEntity<?> getStudentAverageScore(@PathVariable Long studentId) {
        return ResponseEntity.ok(submissionService.getStudentAverageScore(studentId));
    }

    @PostMapping("/submissions/{id}/regrade")
    @TeacherOnly
    public ResponseEntity<?> regradeSubmission(
            @PathVariable Long id,
            @RequestParam Double score,
            @RequestParam(required = false) String feedback) {
        return ResponseEntity.ok(submissionService.regradeSubmission(id, score, feedback));
    }

    @GetMapping("/assignments/{assignmentId}/passing-rate")
    @TeacherOnly
    public ResponseEntity<?> getPassingRate(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(submissionService.getPassingRate(assignmentId));
    }

    @GetMapping("/assignments/{assignmentId}/my-latest")
    @StudentOnly
    public ResponseEntity<?> getMyLatestSubmission(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(submissionService.getMyLatestSubmission(assignmentId));
    }

    @GetMapping("/assignments/{assignmentId}/submissions/export")
    @TeacherOnly
    public ResponseEntity<?> exportSubmissions(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(submissionService.exportAssignmentSubmissions(assignmentId));
    }
}
