package vn.uit.lms.shared.dto.response.course;

import lombok.*;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingSummaryResponse {
    private double averageRating;
    private long totalReviews;
    private Map<Byte, Long> ratingDistribution;
}

