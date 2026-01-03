package vn.uit.lms.controller.assignment;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.assignment.AssignmentService;
import vn.uit.lms.shared.dto.request.assignment.AssignmentRequest;
import vn.uit.lms.shared.util.annotation.StudentOnly;
import vn.uit.lms.shared.util.annotation.StudentOrTeacher;
import vn.uit.lms.shared.util.annotation.TeacherOnly;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class AssignmentController {
    private final AssignmentService assignmentService;

    @PostMapping("/lessons/{lessonId}/assignments")
    @TeacherOnly
    public ResponseEntity<?> createAssignment(@PathVariable Long lessonId, @RequestBody @Valid AssignmentRequest request) {
        return ResponseEntity.ok(assignmentService.createAssignment(lessonId, request));
    }

    @GetMapping("/lessons/{lessonId}/assignments")
    @StudentOrTeacher
    public ResponseEntity<?> getAssignments(@PathVariable Long lessonId) {
        return ResponseEntity.ok(assignmentService.getAssignmentsByLesson(lessonId));
    }

    @GetMapping("/assignments/{id}")
    @StudentOrTeacher
    public ResponseEntity<?> getAssignment(@PathVariable Long id) {
        return ResponseEntity.ok(assignmentService.getAssignmentById(id));
    }

    @PutMapping("/assignments/{id}")
    @TeacherOnly
    public ResponseEntity<?> updateAssignment(@PathVariable Long id, @RequestBody @Valid AssignmentRequest request) {
        return ResponseEntity.ok(assignmentService.updateAssignment(id, request));
    }

    @DeleteMapping("/assignments/{id}")
    @TeacherOnly
    public ResponseEntity<?> deleteAssignment(@PathVariable Long id) {
        assignmentService.deleteAssignment(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/assignments/{id}/submissions")
    @TeacherOnly
    public ResponseEntity<?> getAssignmentSubmissions(@PathVariable Long id) {
        return ResponseEntity.ok(assignmentService.getAssignmentSubmissions(id));
    }

    @GetMapping("/assignments/{id}/eligibility")
    @StudentOnly
    public ResponseEntity<?> checkEligibility(@PathVariable Long id) {
        return ResponseEntity.ok(assignmentService.checkEligibility(id));
    }

    @GetMapping("/assignments/{id}/statistics")
    @TeacherOnly
    public ResponseEntity<?> getAssignmentStatistics(@PathVariable Long id) {
        return ResponseEntity.ok(assignmentService.getAssignmentStatistics(id));
    }

    @GetMapping("/assignments/{assignmentId}/students/{studentId}/progress")
    @StudentOrTeacher
    public ResponseEntity<?> getStudentProgress(@PathVariable Long assignmentId, @PathVariable Long studentId) {
        return ResponseEntity.ok(assignmentService.getStudentProgress(assignmentId, studentId));
    }

    @PostMapping("/assignments/{id}/clone")
    @TeacherOnly
    public ResponseEntity<?> cloneAssignment(@PathVariable Long id, @RequestParam Long targetLessonId) {
        return ResponseEntity.ok(assignmentService.cloneAssignment(id, targetLessonId));
    }

    @GetMapping("/assignments/{id}/late-submissions")
    @TeacherOnly
    public ResponseEntity<?> getLateSubmissions(@PathVariable Long id) {
        return ResponseEntity.ok(assignmentService.getLateSubmissions(id));
    }

    @GetMapping("/assignments/{id}/pending-submissions")
    @TeacherOnly
    public ResponseEntity<?> getPendingSubmissions(@PathVariable Long id) {
        return ResponseEntity.ok(assignmentService.getPendingSubmissions(id));
    }

    @GetMapping("/lessons/{lessonId}/assignments/by-type")
    @StudentOrTeacher
    public ResponseEntity<?> getAssignmentsByType(
            @PathVariable Long lessonId,
            @RequestParam vn.uit.lms.shared.constant.AssignmentType type) {
        return ResponseEntity.ok(assignmentService.getAssignmentsByType(lessonId, type));
    }

    @PutMapping("/assignments/{id}/extend-due-date")
    @TeacherOnly
    public ResponseEntity<?> extendDueDate(@PathVariable Long id, @RequestParam String newDueDate) {
        java.time.Instant dueDate = java.time.Instant.parse(newDueDate);
        return ResponseEntity.ok(assignmentService.extendDueDate(id, dueDate));
    }
}
