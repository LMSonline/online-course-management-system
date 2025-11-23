package vn.uit.lms.shared.dto.response.course;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.uit.lms.shared.constant.CourseStatus;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CourseVersionResponse {

    private Long id;

    private Long courseId;
    private Integer versionNumber;

    private String title;
    private String description;

    private BigDecimal price;
    private Integer durationDays;

    private Float passScore;
    private Float finalWeight;
    private Integer minProgressPct;

    private CourseStatus status;

    private String notes;

    private String approvedBy;
    private Instant approvedAt;

    private Instant publishedAt;

    private int chapterCount;
}

