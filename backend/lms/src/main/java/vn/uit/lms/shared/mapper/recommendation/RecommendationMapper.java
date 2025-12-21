package vn.uit.lms.shared.mapper.recommendation;

import org.mapstruct.Mapper;
import vn.uit.lms.core.domain.recommendation.RecommendationLog;
import vn.uit.lms.shared.dto.response.recommendation.RecommendationLogDto;

@Mapper(componentModel = "spring")
public interface RecommendationMapper {
    RecommendationLogDto toDto(RecommendationLog log);
}
