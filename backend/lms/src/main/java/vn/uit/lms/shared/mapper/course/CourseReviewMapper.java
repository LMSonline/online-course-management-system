package vn.uit.lms.shared.mapper.course;

import vn.uit.lms.core.domain.course.CourseReview;
import vn.uit.lms.shared.dto.request.course.CourseReviewRequest;
import vn.uit.lms.shared.dto.response.course.CourseReviewResponse;

public class CourseReviewMapper {

    public static CourseReviewResponse toResponse(CourseReview review) {
        if (review == null) return null;

        return CourseReviewResponse.builder()
                .id(review.getId())
                .courseId(review.getCourse() != null ? review.getCourse().getId() : null)
                .studentId(review.getStudent() != null ? review.getStudent().getId() : null)
                .username(review.getStudent() != null ? review.getStudent().getAccount().getUsername() : null)
                .avatarUrl(review.getStudent() != null ? review.getStudent().getAccount().getAvatarUrl() : null)
                .rating(review.getRating())
                .title(review.getTitle())
                .content(review.getContent())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }

    public static CourseReview fromRequest(CourseReviewRequest request) {
        if (request == null) return null;

        return CourseReview.builder()
                .rating(request.getRating())
                .title(request.getTitle())
                .content(request.getContent())
                .build();
    }
}
