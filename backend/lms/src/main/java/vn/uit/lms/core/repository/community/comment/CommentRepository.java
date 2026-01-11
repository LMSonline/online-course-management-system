package vn.uit.lms.core.repository.community.comment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vn.uit.lms.core.domain.community.comment.Comment;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    // Existing methods
    List<Comment> findByCourseIdAndParentIsNullAndDeletedAtIsNull(Long courseId);
    List<Comment> findByLessonIdAndParentIsNullAndDeletedAtIsNull(Long lessonId);
    List<Comment> findByParentIdAndDeletedAtIsNull(Long parentId);

    // New Q&A methods
    List<Comment> findByCourseIdAndIsAnsweredFalseAndParentIsNullOrderByCreatedAtDesc(Long courseId);
    Page<Comment> findByCourseIdAndParentIsNull(Long courseId, Pageable pageable);
    List<Comment> findByUserIdAndDeletedAtIsNull(Long userId);

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.course.id = :courseId AND c.isAnswered = false AND c.parent IS NULL AND c.deletedAt IS NULL")
    long countUnansweredQuestions(@Param("courseId") Long courseId);

    @Query("SELECT c FROM Comment c WHERE c.course.id = :courseId AND c.isInstructorReply = true AND c.deletedAt IS NULL ORDER BY c.createdAt DESC")
    List<Comment> findInstructorRepliesByCourse(@Param("courseId") Long courseId);

    @Query("SELECT c FROM Comment c WHERE c.course.id = :courseId AND LOWER(c.content) LIKE LOWER(CONCAT('%', :keyword, '%')) AND c.deletedAt IS NULL ORDER BY c.upvotes DESC")
    List<Comment> searchCommentsByCourse(@Param("courseId") Long courseId, @Param("keyword") String keyword);
}