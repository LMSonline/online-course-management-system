package vn.uit.lms.core.repository.recommendation;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.uit.lms.core.entity.recommendation.RecommendationFeedback;

public interface RecommendationFeedbackRepository extends JpaRepository<RecommendationFeedback, Long> {}
