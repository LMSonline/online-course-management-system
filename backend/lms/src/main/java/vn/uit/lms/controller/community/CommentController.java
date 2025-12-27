package vn.uit.lms.controller.community;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.community.comment.CommentService;
import vn.uit.lms.shared.dto.request.community.comment.CommentCreateRequest;
import vn.uit.lms.shared.dto.response.community.comment.CommentResponse;
import vn.uit.lms.shared.util.annotation.StudentOrTeacher;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/courses/{courseId}/comments")
    @StudentOrTeacher
    public ResponseEntity<CommentResponse> createCourseComment(
            @PathVariable Long courseId,
            @Valid @RequestBody CommentCreateRequest req
    ) {
        return ResponseEntity.ok(commentService.createCourseComment(courseId, req));
    }

    @PostMapping("/lessons/{lessonId}/comments")
    @StudentOrTeacher
    public ResponseEntity<CommentResponse> createLessonComment(
            @PathVariable Long lessonId,
            @Valid @RequestBody CommentCreateRequest req
    ) {
        return ResponseEntity.ok(commentService.createLessonComment(lessonId, req));
    }

    @PostMapping("/comments/{id}/reply")
    @StudentOrTeacher
    public ResponseEntity<CommentResponse> replyToComment(
            @PathVariable Long id,
            @Valid @RequestBody CommentCreateRequest req
    ) {
        return ResponseEntity.ok(commentService.replyToComment(id, req));
    }

    @GetMapping("/courses/{courseId}/comments")
    public ResponseEntity<List<CommentResponse>> getCourseComments(
            @PathVariable Long courseId
    ) {
        return ResponseEntity.ok(commentService.getCourseComments(courseId));
    }

    @GetMapping("/lessons/{lessonId}/comments")
    public ResponseEntity<List<CommentResponse>> getLessonComments(
            @PathVariable Long lessonId
    ) {
        return ResponseEntity.ok(commentService.getLessonComments(lessonId));
    }

    @GetMapping("/comments/{id}/replies")
    public ResponseEntity<List<CommentResponse>> getReplies(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(commentService.getReplies(id));
    }

    @PutMapping("/{id}")
    @StudentOrTeacher
    public CommentResponse update(
            @PathVariable Long id,
            @RequestBody CommentCreateRequest req
    ) {
        return commentService.updateComment(id, req);
    }

    @DeleteMapping("/{id}")
    @StudentOrTeacher
    public ResponseEntity<String> delete(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.ok().body("Comment deleted");
    }
}