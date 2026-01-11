package vn.uit.lms.controller.learning;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.learning.ProgressService;
import vn.uit.lms.shared.dto.request.progress.UpdateWatchedDurationRequest;
import vn.uit.lms.shared.dto.response.progress.*;
import vn.uit.lms.shared.util.annotation.StudentOnly;
import vn.uit.lms.shared.util.annotation.TeacherOnly;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Progress Management", description = "APIs for tracking and managing student learning progress")
public class ProgressController {

    private final ProgressService progressService;

    /**
     * GET /students/{studentId}/progress - Tiến độ tổng quát
     */
    @Operation(
            summary = "Get student overall progress",
            description = "Get overall learning progress summary for a student across all enrolled courses"
    )
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/students/{studentId}/progress")
    @StudentOnly
    public ResponseEntity<StudentProgressOverviewResponse> getStudentProgress(
            @Parameter(description = "Student ID") @PathVariable Long studentId) {
        StudentProgressOverviewResponse response = progressService.getStudentProgress(studentId);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /students/{studentId}/courses/{courseId}/progress - Tiến độ khóa học
     */
    @Operation(
            summary = "Get student course progress",
            description = "Get detailed progress for a student in a specific course, including all chapters and lessons"
    )
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/students/{studentId}/courses/{courseId}/progress")
    @StudentOnly
    public ResponseEntity<CourseProgressResponse> getStudentCourseProgress(
            @Parameter(description = "Student ID") @PathVariable Long studentId,
            @Parameter(description = "Course ID") @PathVariable Long courseId) {
        CourseProgressResponse response = progressService.getStudentCourseProgress(studentId, courseId);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /students/{studentId}/lessons/{lessonId}/progress - Tiến độ bài học
     */
    @Operation(
            summary = "Get student lesson progress",
            description = "Get progress information for a student in a specific lesson"
    )
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/students/{studentId}/lessons/{lessonId}/progress")
    @StudentOnly
    public ResponseEntity<LessonProgressResponse> getStudentLessonProgress(
            @Parameter(description = "Student ID") @PathVariable Long studentId,
            @Parameter(description = "Lesson ID") @PathVariable Long lessonId) {
        LessonProgressResponse response = progressService.getStudentLessonProgress(studentId, lessonId);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /lessons/{lessonId}/mark-viewed - Đánh dấu đã xem
     */
    @Operation(
            summary = "Mark lesson as viewed",
            description = "Mark a lesson as viewed by the authenticated student. " +
                    "Creates or updates progress record with viewed status."
    )
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/lessons/{lessonId}/mark-viewed")
    @StudentOnly
    public ResponseEntity<LessonProgressResponse> markLessonAsViewed(
            @Parameter(description = "Lesson ID") @PathVariable Long lessonId) {
        LessonProgressResponse response = progressService.markLessonAsViewed(lessonId);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /lessons/{lessonId}/mark-completed - Đánh dấu đã hoàn thành
     */
    @Operation(
            summary = "Mark lesson as completed",
            description = "Mark a lesson as completed by the authenticated student. " +
                    "Updates enrollment completion percentage automatically."
    )
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/lessons/{lessonId}/mark-completed")
    @StudentOnly
    public ResponseEntity<LessonProgressResponse> markLessonAsCompleted(
            @Parameter(description = "Lesson ID") @PathVariable Long lessonId) {
        LessonProgressResponse response = progressService.markLessonAsCompleted(lessonId);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /lessons/{lessonId}/update-duration - Cập nhật thời gian xem video
     */
    @Operation(
            summary = "Update watched duration",
            description = "Update watched duration for video lessons. " +
                    "Automatically marks lesson as VIEWED or COMPLETED based on percentage watched. " +
                    "Lesson is auto-completed when watched >= 90% of video duration."
    )
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/lessons/{lessonId}/update-duration")
    @StudentOnly
    public ResponseEntity<LessonProgressResponse> updateWatchedDuration(
            @Parameter(description = "Lesson ID") @PathVariable Long lessonId,
            @Parameter(description = "Watched duration update request")
            @Valid @RequestBody UpdateWatchedDurationRequest request) {
        LessonProgressResponse response = progressService.updateWatchedDuration(
                lessonId, request.getDurationSeconds());
        return ResponseEntity.ok(response);
    }

    /**
     * GET /courses/{courseId}/progress-stats - Thống kê tiến độ (Teacher)
     */
    @Operation(
            summary = "Get course progress statistics",
            description = "Get progress statistics for a course (Teacher access). " +
                    "Includes enrollment stats, completion rates, and average scores."
    )
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/courses/{courseId}/progress-stats")
    @TeacherOnly
    public ResponseEntity<CourseProgressStatsResponse> getCourseProgressStats(
            @Parameter(description = "Course ID") @PathVariable Long courseId) {
        CourseProgressStatsResponse response = progressService.getCourseProgressStats(courseId);
        return ResponseEntity.ok(response);
    }
}
