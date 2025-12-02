package vn.uit.lms.shared.dto.request.recommendation;

import lombok.Getter;
import lombok.Setter;
import vn.uit.lms.shared.constant.FeedbackType;

@Getter
@Setter
public class RecommendationFeedbackRequest {
    private FeedbackType feedbackType;
    private String metadata;
}
