package vn.uit.lms.shared.dto.response.admin;

public record CourseStudentStatisticResponse(
    Long courseId,
    String courseTitle,
    long studentCount,
    double completionRate,
    double averageScore
) {}