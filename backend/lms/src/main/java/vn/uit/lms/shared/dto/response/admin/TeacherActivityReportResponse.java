package vn.uit.lms.shared.dto.response.admin;

public record TeacherActivityReportResponse(
    Long teacherId,
    String teacherName,
    long coursesCreated,
    long lessonsCreated,
    long enrolledStudents,
    double completionRate
) {}