package vn.uit.lms.shared.dto.response.course;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseReviewResponse {

    private Long id;

    private Long courseId;

    private Long studentId;

    private String username;

    private String avatarUrl;

    private Byte rating;

    private String title;

    private String content;

    private Instant createdAt;

    private Instant updatedAt;
}

