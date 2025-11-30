package vn.uit.lms.shared.dto.response.course;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Response DTO for course rating summary statistics")
public class RatingSummaryResponse {
    @Schema(description = "Average rating score", example = "4.5")
    private double averageRating;

    @Schema(description = "Total number of reviews", example = "150")
    private long totalReviews;

    @Schema(description = "Distribution of ratings (rating -> count)", example = "{\"5\": 100, \"4\": 30, \"3\": 15, \"2\": 3, \"1\": 2}")
    private Map<Byte, Long> ratingDistribution;
}

