package vn.uit.lms.shared.dto.response.course;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Response DTO for course review")
public class CourseReviewResponse {

    @Schema(description = "Review ID", example = "1")
    private Long id;

    @Schema(description = "Course ID", example = "5")
    private Long courseId;

    @Schema(description = "Student ID who wrote the review", example = "10")
    private Long studentId;

    @Schema(description = "Username of the reviewer", example = "john_doe")
    private String username;

    @Schema(description = "Avatar URL of the reviewer", example = "https://example.com/avatars/john.jpg")
    private String avatarUrl;

    @Schema(description = "Rating score (1-5 stars)", example = "5")
    private Byte rating;

    @Schema(description = "Review title", example = "Excellent course!")
    private String title;

    @Schema(description = "Review content", example = "This course helped me learn Java quickly")
    private String content;

    @Schema(description = "Creation timestamp", example = "2025-11-30T10:15:30Z")
    private Instant createdAt;

    @Schema(description = "Last update timestamp", example = "2025-11-30T14:20:00Z")
    private Instant updatedAt;
}

