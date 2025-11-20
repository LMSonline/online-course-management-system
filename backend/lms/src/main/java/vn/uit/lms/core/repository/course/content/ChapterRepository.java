package vn.uit.lms.core.repository.course.content;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.uit.lms.core.entity.course.content.Chapter;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, Long> {
}
