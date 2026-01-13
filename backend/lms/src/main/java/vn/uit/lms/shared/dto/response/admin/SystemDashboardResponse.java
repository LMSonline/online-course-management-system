package vn.uit.lms.shared.dto.response.admin;

import java.math.BigDecimal;

public record SystemDashboardResponse(
    BigDecimal totalRevenue,
    long totalUsers,
    long totalCourses,

    double avgStudentsPerCourse,
    double avgCompletionRate,
    double avgScore,

    TeacherActivitySummary teacherActivity
) {}