package vn.uit.lms.service.recommendation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.uit.lms.core.entity.recommendation.RecommendationFeedback;
import vn.uit.lms.core.repository.recommendation.RecommendationFeedbackRepository;
import vn.uit.lms.core.repository.recommendation.RecommendationLogRepository;
import vn.uit.lms.shared.dto.request.recommendation.RecommendationFeedbackRequest;
import vn.uit.lms.shared.dto.response.recommendation.RecommendationLogDto;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final RecommendationLogRepository logRepo;
    private final RecommendationFeedbackRepository feedbackRepo;

    public List<RecommendationLogDto> getRecommendations(Long studentId) {
        return logRepo.findByStudentId(studentId)
                .stream().map(log -> new RecommendationLogDto(
                        log.getId(),
                        log.getStudentId(),
                        log.getRecommendedCourseId(),
                        log.getScore(),
                        log.getAlgorithmVersion()
                )).toList();
    }

    public void addFeedback(Long id, RecommendationFeedbackRequest req, Long studentId) {
        RecommendationFeedback fb = new RecommendationFeedback();
        fb.setRecommendationId(id);
        fb.setStudentId(studentId);
        fb.setFeedbackType(req.getFeedbackType());
        fb.setMetadata(req.getMetadata());
        fb.setCreatedAt(LocalDateTime.now());
        feedbackRepo.save(fb);
    }
}
