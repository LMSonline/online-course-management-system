package vn.uit.lms.shared.dto.response.course;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CourseVersionPublicResponse {

    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private int durationDays;

    private boolean published;

    private Long courseId;
}