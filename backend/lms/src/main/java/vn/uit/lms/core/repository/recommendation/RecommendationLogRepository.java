package vn.uit.lms.core.repository.recommendation;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.uit.lms.core.entity.recommendation.RecommendationLog;

import java.util.List;

public interface RecommendationLogRepository extends JpaRepository<RecommendationLog, Long> {
    List<RecommendationLog> findByStudentId(Long studentId);
}
