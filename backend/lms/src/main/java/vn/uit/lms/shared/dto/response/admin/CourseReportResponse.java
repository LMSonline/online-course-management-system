package vn.uit.lms.shared.dto.response.admin;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CourseReportResponse {

    private Long totalCourses;
    private Double avgCompletionRate;
    private Double avgScore;
}
