package vn.uit.lms.core.repository.course.content;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.uit.lms.core.domain.course.CourseVersion;
import vn.uit.lms.core.domain.course.content.Chapter;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, Long> {

    boolean existsByTitleAndCourseVersion(String title, CourseVersion courseVersion);
    List<Chapter> findAllByCourseVersionOrderByOrderIndexAsc(CourseVersion courseVersion);
    Optional<Chapter> findByIdAndDeletedAtIsNull(Long id);

    @Query("SELECT c FROM Chapter c WHERE c.courseVersion = :version ORDER BY c.orderIndex ASC")
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    List<Chapter> findChaptersForReorder(@Param("version") CourseVersion version);

}
