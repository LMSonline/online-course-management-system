package vn.uit.lms.shared.dto.request.course;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseReviewRequest {

    @NotNull
    @Min(1)
    @Max(5)
    private Byte rating; // 1–5

    private String title;

    private String content;
}

