package vn.uit.lms.controller.assignment;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.assignment.SubmissionService;
import vn.uit.lms.shared.constant.SubmissionStatus;
import vn.uit.lms.shared.dto.request.assignment.FeedbackSubmissionRequest;
import vn.uit.lms.shared.dto.request.assignment.GradeSubmissionRequest;
import vn.uit.lms.shared.dto.response.assignment.SubmissionResponse;
import vn.uit.lms.shared.annotation.StudentOnly;
import vn.uit.lms.shared.annotation.StudentOrTeacher;
import vn.uit.lms.shared.annotation.TeacherOnly;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class SubmissionController {
    private final SubmissionService submissionService;

    @PostMapping("/assignments/{assignmentId}/submit")
    @StudentOnly
    public ResponseEntity<SubmissionResponse> submitAssignment(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(submissionService.submitAssignment(assignmentId));
    }

    @GetMapping("/assignments/{assignmentId}/submissions")
    @TeacherOnly
    public ResponseEntity<List<SubmissionResponse>> getSubmissions(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(submissionService.getSubmissionsByAssignment(assignmentId));
    }

    @GetMapping("/submissions/{id}")
    @StudentOrTeacher
    public ResponseEntity<SubmissionResponse> getSubmission(@PathVariable Long id) {
        return ResponseEntity.ok(submissionService.getSubmissionById(id));
    }

    @PostMapping("/submissions/{id}/grade")
    @TeacherOnly
    public ResponseEntity<SubmissionResponse> gradeSubmission(@PathVariable Long id, @RequestBody @Valid GradeSubmissionRequest request) {
        return ResponseEntity.ok(submissionService.gradeSubmission(id, request));
    }

    @PostMapping("/submissions/{id}/feedback")
    @TeacherOnly
    public ResponseEntity<SubmissionResponse> feedbackSubmission(@PathVariable Long id, @RequestBody @Valid FeedbackSubmissionRequest request) {
        return ResponseEntity.ok(submissionService.feedbackSubmission(id, request));
    }

    @GetMapping("/students/{studentId}/submissions")
    @StudentOrTeacher
    public ResponseEntity<List<SubmissionResponse>> getStudentSubmissions(@PathVariable Long studentId) {
        return ResponseEntity.ok(submissionService.getStudentSubmissions(studentId));
    }

    @DeleteMapping("/submissions/{id}")
    @StudentOnly
    public ResponseEntity<Void> deleteSubmission(@PathVariable Long id) {
        submissionService.deleteSubmission(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/submissions/{id}/content")
    @StudentOnly
    public ResponseEntity<SubmissionResponse> updateSubmissionContent(@PathVariable Long id, @RequestBody String content) {
        return ResponseEntity.ok(submissionService.updateSubmissionContent(id, content));
    }

    @GetMapping("/assignments/{assignmentId}/my-submissions")
    @StudentOnly
    public ResponseEntity<List<SubmissionResponse>> getMySubmissions(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(submissionService.getMySubmissions(assignmentId));
    }

    @PostMapping("/assignments/{assignmentId}/resubmit")
    @StudentOnly
    public ResponseEntity<SubmissionResponse> resubmitAssignment(
            @PathVariable Long assignmentId,
            @RequestParam Long previousSubmissionId) {
        return ResponseEntity.ok(submissionService.resubmitAssignment(assignmentId, previousSubmissionId));
    }

    @PostMapping("/submissions/bulk-grade")
    @TeacherOnly
    public ResponseEntity<List<SubmissionResponse>> bulkGradeSubmissions(
            @RequestBody List<Long> submissionIds,
            @RequestParam Double score,
            @RequestParam(required = false) String feedback) {
        return ResponseEntity.ok(submissionService.bulkGradeSubmissions(submissionIds, score, feedback));
    }

    @PostMapping("/submissions/{id}/reject")
    @TeacherOnly
    public ResponseEntity<SubmissionResponse> rejectSubmission(@PathVariable Long id, @RequestParam String feedback) {
        return ResponseEntity.ok(submissionService.rejectSubmission(id, feedback));
    }

    @GetMapping("/assignments/{assignmentId}/submissions/by-status")
    @TeacherOnly
    public ResponseEntity<List<SubmissionResponse>> getSubmissionsByStatus(
            @PathVariable Long assignmentId,
            @RequestParam SubmissionStatus status) {
        return ResponseEntity.ok(submissionService.getSubmissionsByStatus(assignmentId, status));
    }

    @GetMapping("/students/{studentId}/late-submissions")
    @TeacherOnly
    public ResponseEntity<List<SubmissionResponse>> getLateSubmissionsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(submissionService.getLateSubmissionsByStudent(studentId));
    }

    @GetMapping("/assignments/{assignmentId}/students/{studentId}/best-submission")
    @StudentOrTeacher
    public ResponseEntity<SubmissionResponse> getBestSubmission(
            @PathVariable Long assignmentId,
            @PathVariable Long studentId) {
        return ResponseEntity.ok(submissionService.getBestSubmission(assignmentId, studentId));
    }

    @GetMapping("/students/{studentId}/average-score")
    @StudentOrTeacher
    public ResponseEntity<Double> getStudentAverageScore(@PathVariable Long studentId) {
        return ResponseEntity.ok(submissionService.getStudentAverageScore(studentId));
    }

    @PostMapping("/submissions/{id}/regrade")
    @TeacherOnly
    public ResponseEntity<SubmissionResponse> regradeSubmission(
            @PathVariable Long id,
            @RequestParam Double score,
            @RequestParam(required = false) String feedback) {
        return ResponseEntity.ok(submissionService.regradeSubmission(id, score, feedback));
    }

    @GetMapping("/assignments/{assignmentId}/passing-rate")
    @TeacherOnly
    public ResponseEntity<Double> getPassingRate(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(submissionService.getPassingRate(assignmentId));
    }

    @GetMapping("/assignments/{assignmentId}/my-latest")
    @StudentOnly
    public ResponseEntity<SubmissionResponse> getMyLatestSubmission(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(submissionService.getMyLatestSubmission(assignmentId));
    }

    @GetMapping("/assignments/{assignmentId}/submissions/export")
    @TeacherOnly
    public ResponseEntity<List<SubmissionResponse>> exportSubmissions(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(submissionService.exportAssignmentSubmissions(assignmentId));
    }
}
