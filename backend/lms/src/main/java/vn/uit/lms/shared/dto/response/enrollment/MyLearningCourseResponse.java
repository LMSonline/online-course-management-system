package vn.uit.lms.shared.dto.response.enrollment;

import java.time.OffsetDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MyLearningCourseResponse {

    private Long enrollmentId;

    private Long courseId;
    private String title;
    private String slug;
    private String thumbnailUrl;
    private String difficulty;

    private String teacherName;
    private String categoryName;

    private Float completionPercentage;

    private Double averageRating;
    private Long totalReviews;

    private OffsetDateTime lastViewedAt;
}
