package vn.uit.lms.core.domain.community.comment;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;
import vn.uit.lms.core.domain.Account;
import vn.uit.lms.core.domain.course.Course;
import vn.uit.lms.core.domain.course.content.Lesson;
import vn.uit.lms.shared.constant.Role;
import vn.uit.lms.shared.entity.BaseEntity;
import vn.uit.lms.shared.exception.InvalidRequestException;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "comments")
@SQLDelete(sql = "UPDATE comments SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
@Where(clause = "deleted_at IS NULL")
public class Comment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "account_id")
    private Account user;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    @ManyToOne
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Comment parent;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "is_public", nullable = false)
    private Boolean isPublic = true;

    @Column(name = "is_answered")
    private Boolean isAnswered = false;

    @Column(name = "is_instructor_reply")
    private Boolean isInstructorReply = false;

    @Column(name = "upvotes", nullable = false)
    private Integer upvotes = 0;

    @Column(name = "reply_count", nullable = false)
    private Integer replyCount = 0;

    @Column(name = "edited_at")
    private Instant editedAt;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> replies = new ArrayList<>();


    /**
     * Factory method: Create a course comment
     */
    public static Comment createCourseComment(Account author, Course course, String content) {
        validateContent(content);
        validateAuthor(author);
        if (course == null) {
            throw new InvalidRequestException("Course cannot be null");
        }

        Comment comment = new Comment();
        comment.user = author;
        comment.course = course;
        comment.content = content.trim();
        comment.isPublic = true;
        comment.isAnswered = false;
        comment.isInstructorReply = false;
        comment.upvotes = 0;
        comment.replyCount = 0;
        return comment;
    }

    /**
     * Factory method: Create a lesson comment
     */
    public static Comment createLessonComment(Account author, Lesson lesson, String content) {
        validateContent(content);
        validateAuthor(author);
        if (lesson == null) {
            throw new InvalidRequestException("Lesson cannot be null");
        }

        Comment comment = new Comment();
        comment.user = author;
        comment.lesson = lesson;
        comment.content = content.trim();
        comment.isPublic = true;
        comment.isAnswered = false;
        comment.isInstructorReply = false;
        comment.upvotes = 0;
        comment.replyCount = 0;
        return comment;
    }

    /**
     * Factory method: Create a reply to another comment
     */
    public static Comment createReply(Account author, Comment parent, String content, boolean isInstructor) {
        validateContent(content);
        validateAuthor(author);
        if (parent == null) {
            throw new InvalidRequestException("Parent comment cannot be null");
        }
        if (parent.getParent() != null) {
            throw new InvalidRequestException("Cannot reply to a reply. Only one level of nesting allowed.");
        }

        Comment reply = new Comment();
        reply.user = author;
        reply.parent = parent;
        reply.content = content.trim();
        reply.isPublic = true;
        reply.isInstructorReply = isInstructor;
        reply.upvotes = 0;
        reply.replyCount = 0;

        // Increment parent's reply count
        parent.incrementReplyCount();

        // Mark parent as answered if instructor replies
        if (isInstructor) {
            parent.markAsAnswered();
        }

        return reply;
    }

    /**
     * Update comment content
     */
    public void updateContent(String newContent, Account editor) {
        validateContent(newContent);

        // Check permission
        if (!canEdit(editor)) {
            throw new InvalidRequestException("You don't have permission to edit this comment");
        }

        this.content = newContent.trim();
        this.editedAt = Instant.now();
    }

    /**
     * Check if account can edit this comment
     */
    public boolean canEdit(Account account) {
        if (account == null) return false;
        return this.user.getId().equals(account.getId()) || account.getRole() == Role.ADMIN;
    }

    /**
     * Check if account can delete this comment
     */
    public boolean canDelete(Account account) {
        if (account == null) return false;
        // Owner, instructor of the course, or admin can delete
        return this.user.getId().equals(account.getId())
            || account.getRole() == Role.ADMIN
            || (this.course != null && account.getRole() == Role.TEACHER);
    }

    /**
     * Mark comment as answered (when instructor replies)
     */
    public void markAsAnswered() {
        this.isAnswered = true;
    }

    /**
     * Increment upvote count
     */
    public void upvote() {
        this.upvotes++;
    }

    /**
     * Decrement upvote count
     */
    public void downvote() {
        if (this.upvotes > 0) {
            this.upvotes--;
        }
    }

    /**
     * Increment reply count
     */
    private void incrementReplyCount() {
        this.replyCount++;
    }

    /**
     * Toggle visibility
     */
    public void toggleVisibility(Account moderator) {
        if (moderator.getRole() != Role.ADMIN && moderator.getRole() != Role.TEACHER) {
            throw new InvalidRequestException("Only instructors and admins can toggle comment visibility");
        }
        this.isPublic = !this.isPublic;
    }

    /**
     * Check if this is a question (top-level comment)
     */
    public boolean isQuestion() {
        return this.parent == null;
    }

    /**
     * Check if this is a reply
     */
    public boolean isReply() {
        return this.parent != null;
    }

    /**
     * Get the context (course or lesson) where this comment belongs
     */
    public String getContext() {
        if (this.lesson != null) {
            return "lesson:" + this.lesson.getId();
        } else if (this.course != null) {
            return "course:" + this.course.getId();
        }
        return "unknown";
    }

    // ========== VALIDATIONS ==========

    private static void validateContent(String content) {
        if (content == null || content.trim().isEmpty()) {
            throw new InvalidRequestException("Comment content cannot be empty");
        }
        if (content.trim().length() < 3) {
            throw new InvalidRequestException("Comment must be at least 3 characters long");
        }
        if (content.length() > 5000) {
            throw new InvalidRequestException("Comment cannot exceed 5000 characters");
        }
    }

    private static void validateAuthor(Account author) {
        if (author == null) {
            throw new InvalidRequestException("Comment author cannot be null");
        }
    }

    // ========== BUSINESS INVARIANTS ==========

    /**
     * Ensure business rules are maintained
     */
    @PrePersist
    @PreUpdate
    private void validateInvariants() {
        // A comment must belong to either a course or a lesson (via parent)
        if (this.course == null && this.lesson == null && this.parent == null) {
            throw new InvalidRequestException("Comment must be associated with a course, lesson, or parent comment");
        }

        // A reply cannot have both course and lesson
        if (this.parent != null && (this.course != null || this.lesson != null)) {
            throw new InvalidRequestException("A reply should not have direct course/lesson association");
        }

        // Ensure counts are non-negative
        if (this.upvotes < 0) this.upvotes = 0;
        if (this.replyCount < 0) this.replyCount = 0;
    }
}
