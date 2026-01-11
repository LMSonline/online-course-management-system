package vn.uit.lms.service.community.comment;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.domain.Account;
import vn.uit.lms.core.domain.Teacher;
import vn.uit.lms.core.domain.community.comment.Comment;
import vn.uit.lms.core.domain.course.Course;
import vn.uit.lms.core.domain.course.content.Lesson;
import vn.uit.lms.core.repository.community.comment.CommentRepository;
import vn.uit.lms.core.repository.course.CourseRepository;
import vn.uit.lms.core.repository.course.content.LessonRepository;
import vn.uit.lms.service.AccountService;
import vn.uit.lms.shared.constant.Role;
import vn.uit.lms.shared.dto.request.community.comment.CommentCreateRequest;
import vn.uit.lms.shared.dto.response.community.comment.CommentResponse;
import vn.uit.lms.shared.dto.response.community.comment.CommentStatisticsResponse;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.community.CommentMapper;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final AccountService accountService;

    public CommentService(
            CommentRepository commentRepository,
            CourseRepository courseRepository,
            LessonRepository lessonRepository,
            AccountService accountService
    ) {
        this.commentRepository = commentRepository;
        this.courseRepository = courseRepository;
        this.lessonRepository = lessonRepository;
        this.accountService = accountService;
    }

    // ---------------------------------------------------------
    // CREATE COMMENT (COURSE)
    // ---------------------------------------------------------
    @Transactional
    public CommentResponse createCourseComment(Long courseId, CommentCreateRequest req) {
        // Precondition: Verify user is authenticated
        Account user = accountService.verifyCurrentAccount();

        // Precondition: Verify course exists
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        // Use Rich Domain factory method (includes validation)
        Comment comment = Comment.createCourseComment(user, course, req.getContent());

        // Postcondition: Save and return
        comment = commentRepository.save(comment);

        return CommentMapper.toResponse(comment, List.of());
    }

    // ---------------------------------------------------------
    // CREATE COMMENT (LESSON)
    // ---------------------------------------------------------
    @Transactional
    public CommentResponse createLessonComment(Long lessonId, CommentCreateRequest req) {
        // Precondition: Verify user is authenticated
        Account user = accountService.verifyCurrentAccount();

        // Precondition: Verify lesson exists
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));

        // Use Rich Domain factory method (includes validation)
        Comment comment = Comment.createLessonComment(user, lesson, req.getContent());

        // Postcondition: Save and return
        comment = commentRepository.save(comment);

        return CommentMapper.toResponse(comment, List.of());
    }

    // ---------------------------------------------------------
    // REPLY COMMENT
    // ---------------------------------------------------------
    @Transactional
    public CommentResponse replyToComment(Long parentId, CommentCreateRequest req) {
        // Precondition: Verify user is authenticated
        Account user = accountService.verifyCurrentAccount();

        // Precondition: Verify parent comment exists
        Comment parent = commentRepository.findById(parentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + parentId));

        // Check if current user is instructor of the course
        boolean isInstructor = isInstructorOfComment(user, parent);

        // Use Rich Domain factory method (handles nesting validation and auto-mark as answered)
        Comment reply = Comment.createReply(user, parent, req.getContent(), isInstructor);

        // Postcondition: Save reply and update parent
        reply = commentRepository.save(reply);
        commentRepository.save(parent); // Save parent to persist reply count and answered status

        return CommentMapper.toResponse(reply, List.of());
    }

    /**
     * Check if the current user is the instructor of the course where the comment was made
     */
    private boolean isInstructorOfComment(Account user, Comment comment) {
        if (user.getRole() != Role.TEACHER) {
            return false;
        }

        // Check if comment is on a course
        if (comment.getCourse() != null) {
            Teacher teacher = comment.getCourse().getTeacher();
            return teacher != null && teacher.getAccount().getId().equals(user.getId());
        }

        // Check if comment is on a lesson
        if (comment.getLesson() != null) {
            Course course = comment.getLesson().getChapter().getCourseVersion().getCourse();
            Teacher teacher = course.getTeacher();
            return teacher != null && teacher.getAccount().getId().equals(user.getId());
        }

        // Check parent comment if this is a reply
        if (comment.getParent() != null) {
            return isInstructorOfComment(user, comment.getParent());
        }

        return false;
    }

    // ---------------------------------------------------------
    // GET COURSE COMMENTS
    // ---------------------------------------------------------
    public List<CommentResponse> getCourseComments(Long courseId) {

        List<Comment> comments =
                commentRepository.findByCourseIdAndParentIsNullAndDeletedAtIsNull(courseId);

        return comments.stream()
                .map(c -> CommentMapper.toResponse(c, getRepliesList(c.getId())))
                .toList();
    }

    // ---------------------------------------------------------
    // GET LESSON COMMENTS
    // ---------------------------------------------------------
    public List<CommentResponse> getLessonComments(Long lessonId) {

        List<Comment> comments =
                commentRepository.findByLessonIdAndParentIsNullAndDeletedAtIsNull(lessonId);

        return comments.stream()
                .map(c -> CommentMapper.toResponse(c, getRepliesList(c.getId())))
                .toList();
    }

    // ---------------------------------------------------------
    // GET REPLIES
    // ---------------------------------------------------------
    public List<CommentResponse> getReplies(Long parentId) {
        return getRepliesList(parentId);
    }

    /**
     * Get unanswered questions for a course (for instructor Q&A dashboard)
     */
    @Transactional(readOnly = true)
    public List<CommentResponse> getUnansweredQuestions(Long courseId) {
        // Verify course exists
        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Course not found with id: " + courseId);
        }

        List<Comment> unanswered = commentRepository.findByCourseIdAndIsAnsweredFalseAndParentIsNullOrderByCreatedAtDesc(courseId);

        return unanswered.stream()
                .map(c -> CommentMapper.toResponse(c, getRepliesList(c.getId())))
                .toList();
    }

    /**
     * Get top comments by upvotes (popular questions)
     */
    @Transactional(readOnly = true)
    public List<CommentResponse> getPopularComments(Long courseId, int limit) {
        // Verify course exists
        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Course not found with id: " + courseId);
        }

        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "upvotes"));
        Page<Comment> popular = commentRepository.findByCourseIdAndParentIsNull(courseId, pageable);

        return popular.getContent().stream()
                .map(c -> CommentMapper.toResponse(c, getRepliesList(c.getId())))
                .toList();
    }

    // ---------------------------------------------------------
    // UPDATE COMMENT
    // ---------------------------------------------------------
    @Transactional
    public CommentResponse updateComment(Long id, CommentCreateRequest req) {
        // Precondition: Verify user is authenticated
        Account user = accountService.verifyCurrentAccount();

        // Precondition: Verify comment exists
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + id));

        // Use Rich Domain method (handles permission check and validation)
        comment.updateContent(req.getContent(), user);

        // Postcondition: Save and return
        comment = commentRepository.save(comment);

        if (comment.isQuestion()) {
            return CommentMapper.toResponse(comment, getRepliesList(id));
        }
        return CommentMapper.toResponse(comment, List.of());
    }

    // ---------------------------------------------------------
    // DELETE COMMENT (SOFT DELETE)
    // ---------------------------------------------------------
    @Transactional
    public void deleteComment(Long id) {
        // Precondition: Verify user is authenticated
        Account user = accountService.verifyCurrentAccount();

        // Precondition: Verify comment exists
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + id));

        // Check permission using Rich Domain method
        if (!comment.canDelete(user)) {
            throw new InvalidRequestException("You don't have permission to delete this comment");
        }

        // Postcondition: Soft delete
        commentRepository.delete(comment);

    }

    /**
     * Upvote a comment
     * Preconditions: User is authenticated, comment exists
     * Postconditions: Upvote count incremented
     */
    @Transactional
    public CommentResponse upvoteComment(Long id) {
        // Verify user is authenticated
        accountService.verifyCurrentAccount();

        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + id));

        // Use Rich Domain method
        comment.upvote();

        comment = commentRepository.save(comment);

        // Return with replies if it's a question
        if (comment.isQuestion()) {
            return CommentMapper.toResponse(comment, getRepliesList(id));
        }
        return CommentMapper.toResponse(comment, List.of());
    }

    /**
     * Toggle comment visibility (for moderators)
     * Preconditions: User is instructor or admin
     * Postconditions: Comment visibility toggled
     */
    @Transactional
    public CommentResponse toggleVisibility(Long id) {
        Account currentUser = accountService.verifyCurrentAccount();

        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + id));

        // Use Rich Domain method (handles permission check)
        comment.toggleVisibility(currentUser);

        comment = commentRepository.save(comment);

        if (comment.isQuestion()) {
            return CommentMapper.toResponse(comment, getRepliesList(id));
        }
        return CommentMapper.toResponse(comment, List.of());
    }

    /**
     * Search comments by keyword
     */
    @Transactional(readOnly = true)
    public List<CommentResponse> searchComments(Long courseId, String keyword) {
        // Verify course exists
        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Course not found with id: " + courseId);
        }

        if (keyword == null || keyword.trim().isEmpty()) {
            throw new InvalidRequestException("Search keyword cannot be empty");
        }

        List<Comment> results = commentRepository.searchCommentsByCourse(courseId, keyword.trim());

        return results.stream()
                .map(c -> {
                    if (c.isQuestion()) {
                        return CommentMapper.toResponse(c, getRepliesList(c.getId()));
                    }
                    return CommentMapper.toResponse(c, List.of());
                })
                .toList();
    }

    /**
     * Get Q&A statistics for instructor dashboard
     */
    @Transactional(readOnly = true)
    public CommentStatisticsResponse getCommentStatistics(Long courseId) {
        // Verify course exists
        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Course not found with id: " + courseId);
        }

        // Get all questions (top-level comments)
        List<Comment> allQuestions = commentRepository.findByCourseIdAndParentIsNullAndDeletedAtIsNull(courseId);
        long totalQuestions = allQuestions.size();

        // Count answered questions
        long answeredQuestions = allQuestions.stream()
                .filter(Comment::getIsAnswered)
                .count();

        long unansweredQuestions = totalQuestions - answeredQuestions;

        // Count total replies
        long totalReplies = allQuestions.stream()
                .mapToLong(q -> commentRepository.findByParentIdAndDeletedAtIsNull(q.getId()).size())
                .sum();

        // Count instructor replies
        List<Comment> instructorReplies = commentRepository.findInstructorRepliesByCourse(courseId);
        long instructorReplyCount = instructorReplies.size();

        // Calculate total upvotes
        long totalUpvotes = allQuestions.stream()
                .mapToLong(Comment::getUpvotes)
                .sum();

        // Calculate response rate
        BigDecimal responseRate = CommentStatisticsResponse.calculateResponseRate(answeredQuestions, totalQuestions);

        // Calculate average upvotes
        Double avgUpvotes = CommentStatisticsResponse.calculateAverageUpvotes(totalUpvotes, totalQuestions);

        // TODO: Calculate average response time (requires timestamp analysis)
        Double avgResponseTime = null;

        return CommentStatisticsResponse.builder()
                .totalQuestions(totalQuestions)
                .answeredQuestions(answeredQuestions)
                .unansweredQuestions(unansweredQuestions)
                .totalReplies(totalReplies)
                .instructorReplies(instructorReplyCount)
                .responseRate(responseRate)
                .averageResponseTimeHours(avgResponseTime)
                .totalUpvotes(totalUpvotes)
                .averageUpvotesPerQuestion(avgUpvotes)
                .build();
    }

    private List<CommentResponse> getRepliesList(Long parentId) {
        return commentRepository.findByParentIdAndDeletedAtIsNull(parentId)
                .stream()
                .map(r -> CommentMapper.toResponse(r, List.of()))
                .toList();
    }
}
