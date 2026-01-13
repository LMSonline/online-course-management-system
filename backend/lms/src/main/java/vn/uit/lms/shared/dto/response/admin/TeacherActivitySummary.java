package vn.uit.lms.shared.dto.response.admin;

public record TeacherActivitySummary(
    long totalTeachers,
    long activeTeachers,
    long totalCoursesCreated,
    long totalLessonsCreated
) {}