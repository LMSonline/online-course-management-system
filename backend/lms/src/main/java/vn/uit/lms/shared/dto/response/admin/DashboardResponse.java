package vn.uit.lms.shared.dto.response.admin;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter
public class DashboardResponse {

    private Long totalRevenue;
    private Long totalStudents;
    private Long totalCourses;
    private Double avgCompletionRate;
    private Double avgScore;

    private Long activeTeachers;
}

