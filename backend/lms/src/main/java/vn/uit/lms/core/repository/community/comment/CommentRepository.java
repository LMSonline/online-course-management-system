package vn.uit.lms.core.repository.community.comment;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.uit.lms.core.entity.community.comment.Comment;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {



    List<Comment> findByCourseIdAndParentIsNullAndDeletedAtIsNull(Long courseId);

    List<Comment> findByLessonIdAndParentIsNullAndDeletedAtIsNull(Long lessonId);

    List<Comment> findByParentIdAndDeletedAtIsNull(Long parentId);


}