package vn.uit.lms.controller.course;

import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.course.CourseReviewService;
import vn.uit.lms.shared.dto.PageResponse;
import vn.uit.lms.shared.dto.request.course.CourseReviewRequest;
import vn.uit.lms.shared.dto.response.course.RatingSummaryResponse;
import vn.uit.lms.shared.dto.response.course.CourseReviewResponse;
import vn.uit.lms.shared.util.annotation.StudentOnly;

@RestController
@RequestMapping("/api/v1")
public class CourseReviewController {

    private CourseReviewService courseReviewService;

    public CourseReviewController(CourseReviewService courseReviewService) {
        this.courseReviewService = courseReviewService;
    }

    @PostMapping("/courses/{courseId}/reviews")
    @StudentOnly
    public ResponseEntity<CourseReviewResponse> createNewReview(
            @PathVariable("courseId") Long courseId,
            @Valid @RequestBody CourseReviewRequest courseReviewRequest
    ) {
        CourseReviewResponse courseReviewResponse = courseReviewService.createNewReview(courseReviewRequest, courseId);
        return ResponseEntity.status(HttpStatus.CREATED).body(courseReviewResponse);
    }

    @GetMapping("/courses/{courseId}/reviews")
    public ResponseEntity<PageResponse<CourseReviewResponse>> getCourseReviews(
            @PathVariable("courseId") Long courseId,
            Pageable pageable
    ){
        PageResponse<CourseReviewResponse> response = courseReviewService.getCourseReviews(courseId, pageable);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PutMapping("/courses/{courseId}/reviews/{reviewId}")
    @StudentOnly
    public ResponseEntity<CourseReviewResponse> updateReview(
            @PathVariable Long courseId,
            @PathVariable Long reviewId,
            @Valid @RequestBody CourseReviewRequest request
    ) {
        CourseReviewResponse updated = courseReviewService.updateReview(courseId, reviewId, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/courses/{courseId}/reviews/{reviewId}")
    @StudentOnly
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long courseId,
            @PathVariable Long reviewId
    ) {
        courseReviewService.deleteReview(courseId, reviewId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/courses/{courseId}/rating-summary")
    public ResponseEntity<RatingSummaryResponse> getRatingSummary(@PathVariable Long courseId) {
        RatingSummaryResponse summary = courseReviewService.getRatingSummary(courseId);
        return ResponseEntity.ok(summary);
    }
}
