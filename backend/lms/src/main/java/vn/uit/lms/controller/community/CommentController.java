package vn.uit.lms.controller.community;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.community.comment.CommentService;
import vn.uit.lms.shared.dto.request.community.comment.CommentCreateRequest;
import vn.uit.lms.shared.dto.response.community.comment.CommentResponse;
import vn.uit.lms.shared.dto.response.community.comment.CommentStatisticsResponse;
import vn.uit.lms.shared.annotation.Authenticated;
import vn.uit.lms.shared.annotation.StudentOrTeacher;
import vn.uit.lms.shared.annotation.TeacherOnly;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    // ========== CREATE OPERATIONS ==========

    /**
     * Create a comment on a course (Q&A question)
     */
    @PostMapping("/courses/{courseId}/comments")
    @StudentOrTeacher
    public ResponseEntity<CommentResponse> createCourseComment(
            @PathVariable Long courseId,
            @Valid @RequestBody CommentCreateRequest req
    ) {
        return ResponseEntity.ok(commentService.createCourseComment(courseId, req));
    }

    /**
     * Create a comment on a lesson
     */
    @PostMapping("/lessons/{lessonId}/comments")
    @StudentOrTeacher
    public ResponseEntity<CommentResponse> createLessonComment(
            @PathVariable Long lessonId,
            @Valid @RequestBody CommentCreateRequest req
    ) {
        return ResponseEntity.ok(commentService.createLessonComment(lessonId, req));
    }

    /**
     * Reply to a comment (answer a question)
     */
    @PostMapping("/comments/{id}/reply")
    @StudentOrTeacher
    public ResponseEntity<CommentResponse> replyToComment(
            @PathVariable Long id,
            @Valid @RequestBody CommentCreateRequest req
    ) {
        return ResponseEntity.ok(commentService.replyToComment(id, req));
    }

    // ========== READ OPERATIONS ==========

    /**
     * Get all comments for a course
     */
    @GetMapping("/courses/{courseId}/comments")
    public ResponseEntity<List<CommentResponse>> getCourseComments(
            @PathVariable Long courseId
    ) {
        return ResponseEntity.ok(commentService.getCourseComments(courseId));
    }

    /**
     * Get all comments for a lesson
     */
    @GetMapping("/lessons/{lessonId}/comments")
    public ResponseEntity<List<CommentResponse>> getLessonComments(
            @PathVariable Long lessonId
    ) {
        return ResponseEntity.ok(commentService.getLessonComments(lessonId));
    }

    /**
     * Get replies to a specific comment
     */
    @GetMapping("/comments/{id}/replies")
    public ResponseEntity<List<CommentResponse>> getReplies(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(commentService.getReplies(id));
    }

    /**
     * Get unanswered questions for a course (Instructor Q&A Dashboard)
     */
    @GetMapping("/courses/{courseId}/comments/unanswered")
    @TeacherOnly
    public ResponseEntity<List<CommentResponse>> getUnansweredQuestions(
            @PathVariable Long courseId
    ) {
        return ResponseEntity.ok(commentService.getUnansweredQuestions(courseId));
    }

    /**
     * Get popular/trending questions by upvotes
     */
    @GetMapping("/courses/{courseId}/comments/popular")
    public ResponseEntity<List<CommentResponse>> getPopularComments(
            @PathVariable Long courseId,
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ResponseEntity.ok(commentService.getPopularComments(courseId, limit));
    }

    /**
     * Search comments in a course by keyword
     */
    @GetMapping("/courses/{courseId}/comments/search")
    public ResponseEntity<List<CommentResponse>> searchComments(
            @PathVariable Long courseId,
            @RequestParam String keyword
    ) {
        return ResponseEntity.ok(commentService.searchComments(courseId, keyword));
    }

    /**
     * Get Q&A statistics for a course (for instructor dashboard)
     */
    @GetMapping("/courses/{courseId}/comments/statistics")
    @TeacherOnly
    public ResponseEntity<CommentStatisticsResponse> getCommentStatistics(
            @PathVariable Long courseId
    ) {
        return ResponseEntity.ok(commentService.getCommentStatistics(courseId));
    }

    // ========== UPDATE OPERATIONS ==========

    /**
     * Update comment content
     */
    @PutMapping("/comments/{id}")
    @StudentOrTeacher
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long id,
            @Valid @RequestBody CommentCreateRequest req
    ) {
        return ResponseEntity.ok(commentService.updateComment(id, req));
    }

    /**
     * Upvote a comment/question
     */
    @PostMapping("/comments/{id}/upvote")
    @Authenticated
    public ResponseEntity<CommentResponse> upvoteComment(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(commentService.upvoteComment(id));
    }

    /**
     * Toggle comment visibility (moderation)
     */
    @PostMapping("/comments/{id}/toggle-visibility")
    @TeacherOnly
    public ResponseEntity<CommentResponse> toggleVisibility(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(commentService.toggleVisibility(id));
    }

    // ========== DELETE OPERATIONS ==========

    /**
     * Delete a comment (soft delete)
     */
    @DeleteMapping("/comments/{id}")
    @StudentOrTeacher
    public ResponseEntity<Map<String, String>> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.ok(Map.of("message", "Comment deleted successfully"));
    }
}