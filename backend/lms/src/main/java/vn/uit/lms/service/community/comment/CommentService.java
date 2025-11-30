package vn.uit.lms.service.community.comment;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.entity.Account;
import vn.uit.lms.core.entity.community.comment.Comment;
import vn.uit.lms.core.entity.course.Course;
import vn.uit.lms.core.entity.course.content.Lesson;
import vn.uit.lms.core.repository.AccountRepository;
import vn.uit.lms.core.repository.community.comment.CommentRepository;
import vn.uit.lms.core.repository.course.CourseRepository;
import vn.uit.lms.core.repository.course.content.LessonRepository;
import vn.uit.lms.service.AccountService;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.dto.request.community.comment.CommentCreateRequest;
import vn.uit.lms.shared.dto.response.community.comment.CommentResponse;
import vn.uit.lms.shared.mapper.community.CommentMapper;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final AccountRepository accountRepository;
    private final AccountService accountService;

    public CommentService(
            CommentRepository commentRepository,
            CourseRepository courseRepository,
            LessonRepository lessonRepository,
            AccountRepository accountRepository,
            AccountService accountService
    ) {
        this.commentRepository = commentRepository;
        this.courseRepository = courseRepository;
        this.lessonRepository = lessonRepository;
        this.accountRepository = accountRepository;
        this.accountService = accountService;
    }

    // ---------------------------------------------------------
    // CREATE COMMENT (COURSE)
    // ---------------------------------------------------------
    @Transactional
    public CommentResponse createCourseComment(Long courseId, CommentCreateRequest req) {

        Account user = accountService.verifyCurrentAccount();

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        Comment c = new Comment();
        c.setUser(user);
        c.setCourse(course);
        c.setContent(req.getContent());

        commentRepository.save(c);

        return CommentMapper.toResponse(c, List.of());
    }

    // ---------------------------------------------------------
    // CREATE COMMENT (LESSON)
    // ---------------------------------------------------------
    @Transactional
    public CommentResponse createLessonComment(Long lessonId, CommentCreateRequest req) {

        Account user = accountService.verifyCurrentAccount();

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));

        Comment c = new Comment();
        c.setUser(user);
        c.setLesson(lesson);
        c.setContent(req.getContent());

        commentRepository.save(c);

        return CommentMapper.toResponse(c, List.of());
    }

    // ---------------------------------------------------------
    // REPLY COMMENT
    // ---------------------------------------------------------
    @Transactional
    public CommentResponse replyToComment(Long parentId, CommentCreateRequest req) {

        Account user = accountService.verifyCurrentAccount();

        Comment parent = commentRepository.findById(parentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        Comment reply = new Comment();
        reply.setUser(user);
        reply.setParent(parent);
        reply.setContent(req.getContent());

        commentRepository.save(reply);

        return CommentMapper.toResponse(reply, List.of());
    }

    // ---------------------------------------------------------
    // GET COURSE COMMENTS
    // ---------------------------------------------------------
    public List<CommentResponse> getCourseComments(Long courseId) {

        List<Comment> comments =
                commentRepository.findByCourseIdAndParentIsNull(courseId);

        return comments.stream()
                .map(c -> CommentMapper.toResponse(c, getRepliesList(c.getId())))
                .toList();
    }

    // ---------------------------------------------------------
    // GET LESSON COMMENTS
    // ---------------------------------------------------------
    public List<CommentResponse> getLessonComments(Long lessonId) {

        List<Comment> comments =
                commentRepository.findByLessonIdAndParentIsNull(lessonId);

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

    private List<CommentResponse> getRepliesList(Long parentId) {
        return commentRepository.findByParentId(parentId)
                .stream()
                .map(r -> CommentMapper.toResponse(r, List.of()))
                .toList();
    }
}