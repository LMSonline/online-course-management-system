package vn.uit.lms.controller.course;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Course Review Management", description = "APIs for managing course reviews and ratings")
public class CourseReviewController {

    private CourseReviewService courseReviewService;

    public CourseReviewController(CourseReviewService courseReviewService) {
        this.courseReviewService = courseReviewService;
    }

    @Operation(summary = "Create a new review")
    @PostMapping("/courses/{courseId}/reviews")
    public ResponseEntity<CourseReviewResponse> createNewReview(
            @Parameter(description = "Course ID") @PathVariable("courseId") Long courseId,
            @Parameter(description = "Review details") @Valid @RequestBody CourseReviewRequest courseReviewRequest
    ) {
        CourseReviewResponse courseReviewResponse = courseReviewService.createNewReview(courseReviewRequest, courseId);
        return ResponseEntity.status(HttpStatus.CREATED).body(courseReviewResponse);
    }

    @Operation(summary = "Get course reviews")
    @GetMapping("/courses/{courseId}/reviews")
    public ResponseEntity<PageResponse<CourseReviewResponse>> getCourseReviews(
            @Parameter(description = "Course ID") @PathVariable("courseId") Long courseId,
            @Parameter(description = "Pagination parameters") Pageable pageable
    ){
        PageResponse<CourseReviewResponse> response = courseReviewService.getCourseReviews(courseId, pageable);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @Operation(summary = "Update a review")
    @PutMapping("/courses/{courseId}/reviews/{reviewId}")
    public ResponseEntity<CourseReviewResponse> updateReview(
            @Parameter(description = "Course ID") @PathVariable Long courseId,
            @Parameter(description = "Review ID") @PathVariable Long reviewId,
            @Parameter(description = "Updated review details") @Valid @RequestBody CourseReviewRequest request
    ) {
        CourseReviewResponse updated = courseReviewService.updateReview(courseId, reviewId, request);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Delete a review")
    @DeleteMapping("/courses/{courseId}/reviews/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @Parameter(description = "Course ID") @PathVariable Long courseId,
            @Parameter(description = "Review ID") @PathVariable Long reviewId
    ) {
        courseReviewService.deleteReview(courseId, reviewId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get course rating summary")
    @GetMapping("/courses/{courseId}/rating-summary")
    public ResponseEntity<RatingSummaryResponse> getRatingSummary(
            @Parameter(description = "Course ID") @PathVariable Long courseId) {
        RatingSummaryResponse summary = courseReviewService.getRatingSummary(courseId);
        return ResponseEntity.ok(summary);
    }
}
