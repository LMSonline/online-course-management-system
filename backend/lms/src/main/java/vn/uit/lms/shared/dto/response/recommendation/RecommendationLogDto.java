package vn.uit.lms.shared.dto.response.recommendation;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecommendationLogDto {
    private Long id;
    private Long studentId;
    private Long recommendedCourseId;
    private Float score;
    private String algorithmVersion;

    public RecommendationLogDto(Long id, Long studentId, Long recommendedCourseId, Float score, String algorithmVersion) {
    }
}
