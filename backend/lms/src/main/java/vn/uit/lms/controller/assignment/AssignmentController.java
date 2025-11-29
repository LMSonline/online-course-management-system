package vn.uit.lms.controller.assignment;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.assignment.AssignmentService;
import vn.uit.lms.shared.dto.request.assignment.AssignmentRequest;

@RestController
@RequiredArgsConstructor
public class AssignmentController {
    private final AssignmentService assignmentService;

    @PostMapping("/lessons/{lessonId}/assignments")
    public ResponseEntity<?> createAssignment(@PathVariable Long lessonId, @RequestBody @Valid AssignmentRequest request) {
        return ResponseEntity.ok(assignmentService.createAssignment(lessonId, request));
    }

    @GetMapping("/lessons/{lessonId}/assignments")
    public ResponseEntity<?> getAssignments(@PathVariable Long lessonId) {
        return ResponseEntity.ok(assignmentService.getAssignmentsByLesson(lessonId));
    }

    @GetMapping("/assignments/{id}")
    public ResponseEntity<?> getAssignment(@PathVariable Long id) {
        return ResponseEntity.ok(assignmentService.getAssignmentById(id));
    }

    @PutMapping("/assignments/{id}")
    public ResponseEntity<?> updateAssignment(@PathVariable Long id, @RequestBody @Valid AssignmentRequest request) {
        return ResponseEntity.ok(assignmentService.updateAssignment(id, request));
    }

    @DeleteMapping("/assignments/{id}")
    public ResponseEntity<?> deleteAssignment(@PathVariable Long id) {
        assignmentService.deleteAssignment(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/assignments/{id}/submissions")
    public ResponseEntity<?> getAssignmentSubmissions(@PathVariable Long id) {
        return ResponseEntity.ok(assignmentService.getAssignmentSubmissions(id));
    }
}
