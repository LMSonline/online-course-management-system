package vn.uit.lms.controller.assignment;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.assignment.AssignmentService;
import vn.uit.lms.shared.constant.AssignmentType;
import vn.uit.lms.shared.dto.request.assignment.AssignmentRequest;
import vn.uit.lms.shared.dto.response.assignment.AssignmentEligibilityResponse;
import vn.uit.lms.shared.dto.response.assignment.AssignmentResponse;
import vn.uit.lms.shared.dto.response.assignment.StudentAssignmentProgressResponse;
import vn.uit.lms.shared.dto.response.assignment.SubmissionResponse;
import vn.uit.lms.shared.util.annotation.StudentOnly;
import vn.uit.lms.shared.util.annotation.StudentOrTeacher;
import vn.uit.lms.shared.util.annotation.TeacherOnly;

import java.time.Instant;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class AssignmentController {
    private final AssignmentService assignmentService;


    /**
     * Create independent assignment (not linked to any lesson yet)
     * Follows Association pattern: Assignment exists independently
     */
    @PostMapping("/assignments")
    @TeacherOnly
    public ResponseEntity<AssignmentResponse> createIndependentAssignment(@RequestBody @Valid AssignmentRequest request) {
        return ResponseEntity.ok(assignmentService.createIndependentAssignment(request));
    }

    /**
     * Get all independent assignments (assignment library/pool)
     */
    @GetMapping("/assignments")
    @TeacherOnly
    public ResponseEntity<List<AssignmentResponse>> getAllIndependentAssignments() {
        return ResponseEntity.ok(assignmentService.getAllIndependentAssignments());
    }

    /**
     * Link existing assignment to a lesson
     * Allows assignment reusability across lessons
     */
    @PostMapping("/lessons/{lessonId}/assignments/{assignmentId}")
    @TeacherOnly
    public ResponseEntity<AssignmentResponse> linkAssignmentToLesson(
            @PathVariable Long lessonId,
            @PathVariable Long assignmentId) {
        return ResponseEntity.ok(assignmentService.linkAssignmentToLesson(assignmentId, lessonId));
    }

    /**
     * Unlink assignment from lesson
     * Assignment becomes independent again
     */
    @DeleteMapping("/lessons/{lessonId}/assignments/{assignmentId}")
    @TeacherOnly
    public ResponseEntity<Void> unlinkAssignmentFromLesson(
            @PathVariable Long lessonId,
            @PathVariable Long assignmentId) {
        assignmentService.unlinkAssignmentFromLesson(lessonId, assignmentId);
        return ResponseEntity.noContent().build();
    }


    /**
     * Create assignment and immediately link to lesson (convenience method)
     * LEGACY: For UX convenience (quick creation during lesson editing)
     * Internally calls: createIndependentAssignment() + linkAssignmentToLesson()
     */
    @PostMapping("/lessons/{lessonId}/assignments")
    @TeacherOnly
    public ResponseEntity<AssignmentResponse> createAssignment(@PathVariable Long lessonId, @RequestBody @Valid AssignmentRequest request) {
        return ResponseEntity.ok(assignmentService.createAssignment(lessonId, request));
    }


    @GetMapping("/lessons/{lessonId}/assignments")
    @StudentOrTeacher
    public ResponseEntity<List<AssignmentResponse>> getAssignments(@PathVariable Long lessonId) {
        return ResponseEntity.ok(assignmentService.getAssignmentsByLesson(lessonId));
    }

    @GetMapping("/assignments/{id}")
    @StudentOrTeacher
    public ResponseEntity<AssignmentResponse> getAssignment(@PathVariable Long id) {
        return ResponseEntity.ok(assignmentService.getAssignmentById(id));
    }

    @PutMapping("/assignments/{id}")
    @TeacherOnly
    public ResponseEntity<AssignmentResponse> updateAssignment(@PathVariable Long id, @RequestBody @Valid AssignmentRequest request) {
        return ResponseEntity.ok(assignmentService.updateAssignment(id, request));
    }

    @DeleteMapping("/assignments/{id}")
    @TeacherOnly
    public ResponseEntity<Void> deleteAssignment(@PathVariable Long id) {
        assignmentService.deleteAssignment(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/assignments/{id}/submissions")
    @TeacherOnly
    public ResponseEntity<List<SubmissionResponse>> getAssignmentSubmissions(@PathVariable Long id) {
        return ResponseEntity.ok(assignmentService.getAssignmentSubmissions(id));
    }

    @GetMapping("/assignments/{id}/eligibility")
    @StudentOnly
    public ResponseEntity<AssignmentEligibilityResponse> checkEligibility(@PathVariable Long id) {
        return ResponseEntity.ok(assignmentService.checkEligibility(id));
    }

    @GetMapping("/assignments/{id}/statistics")
    @TeacherOnly
    public ResponseEntity<?> getAssignmentStatistics(@PathVariable Long id) {
        return ResponseEntity.ok(assignmentService.getAssignmentStatistics(id));
    }

    @GetMapping("/assignments/{assignmentId}/students/{studentId}/progress")
    @StudentOrTeacher
    public ResponseEntity<StudentAssignmentProgressResponse> getStudentProgress(@PathVariable Long assignmentId, @PathVariable Long studentId) {
        return ResponseEntity.ok(assignmentService.getStudentProgress(assignmentId, studentId));
    }

    @PostMapping("/assignments/{id}/clone")
    @TeacherOnly
    public ResponseEntity<AssignmentResponse> cloneAssignment(@PathVariable Long id, @RequestParam Long targetLessonId) {
        return ResponseEntity.ok(assignmentService.cloneAssignment(id, targetLessonId));
    }

    @GetMapping("/assignments/{id}/late-submissions")
    @TeacherOnly
    public ResponseEntity<List<SubmissionResponse>> getLateSubmissions(@PathVariable Long id) {
        return ResponseEntity.ok(assignmentService.getLateSubmissions(id));
    }

    @GetMapping("/assignments/{id}/pending-submissions")
    @TeacherOnly
    public ResponseEntity<List<SubmissionResponse>> getPendingSubmissions(@PathVariable Long id) {
        return ResponseEntity.ok(assignmentService.getPendingSubmissions(id));
    }

    @GetMapping("/lessons/{lessonId}/assignments/by-type")
    @StudentOrTeacher
    public ResponseEntity<List<AssignmentResponse>> getAssignmentsByType(
            @PathVariable Long lessonId,
            @RequestParam AssignmentType type) {
        return ResponseEntity.ok(assignmentService.getAssignmentsByType(lessonId, type));
    }

    @PutMapping("/assignments/{id}/extend-due-date")
    @TeacherOnly
    public ResponseEntity<AssignmentResponse> extendDueDate(@PathVariable Long id, @RequestParam String newDueDate) {
        Instant dueDate = Instant.parse(newDueDate);
        return ResponseEntity.ok(assignmentService.extendDueDate(id, dueDate));
    }
}
