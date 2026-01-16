package vn.uit.lms.controller.recommendation;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.recommendation.RecommendationService;
import vn.uit.lms.shared.dto.ApiResponse;
import vn.uit.lms.shared.dto.request.recommendation.RecommendationFeedbackRequest;
import vn.uit.lms.shared.util.SecurityUtils;
import vn.uit.lms.shared.annotation.AdminOnly;
import vn.uit.lms.shared.annotation.StudentOnly;

import java.time.Instant;

@RestController
@RequiredArgsConstructor
@RequestMapping("/")
public class RecommendationController {

    private final RecommendationService service;

    @GetMapping("/students/{studentId}/recommendations")
    @StudentOnly
    public ApiResponse<?> getRecommendations(@PathVariable Long studentId) {

        return ApiResponse.builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Recommendations loaded successfully")
                .code("RECOMMENDATION_LIST")
                .data(service.getRecommendations(studentId))
                .timestamp(Instant.now())
                .meta(ApiResponse.Meta.builder()
                        .author("LMS Recommendation Engine")
                        .version("1.0.0")
                        .license("MIT")
                        .build())
                .build();
    }

    @PostMapping("/recommendations/{id}/feedback")
    @StudentOnly
    public ApiResponse<?> giveFeedback(
            @PathVariable Long id,
            @RequestBody RecommendationFeedbackRequest req
    ) {

        //  Dùng SecurityUtils để lấy userId từ JWT
        Long studentId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new RuntimeException("User ID not found in token"));

        service.addFeedback(id, req, studentId);

        return ApiResponse.builder()
                .success(true)
                .status(HttpStatus.CREATED.value())
                .message("Feedback submitted successfully")
                .code("RECOMMENDATION_FEEDBACK_SUBMITTED")
                .data(null)
                .timestamp(Instant.now())
                .meta(ApiResponse.Meta.builder()
                        .author("LMS Recommendation Engine")
                        .version("1.0.0")
                        .license("MIT")
                        .build())
                .build();
    }

    @GetMapping("/admin/recommendations/stats")
    @AdminOnly
    public ApiResponse<?> getStats() {

        return ApiResponse.builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Recommendation statistics loaded")
                .code("RECOMMENDATION_STATS")
                .data("Statistics placeholder") // TODO: implement real metrics
                .timestamp(Instant.now())
                .meta(ApiResponse.Meta.builder()
                        .author("LMS Recommendation Engine")
                        .version("1.0.0")
                        .license("MIT")
                        .build())
                .build();
    }
}
