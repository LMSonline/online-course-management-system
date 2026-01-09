package vn.uit.lms.controller.learning;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.learning.EnrollmentService;
import vn.uit.lms.shared.dto.PageResponse;
import vn.uit.lms.shared.dto.request.enrollment.CancelEnrollmentRequest;
import vn.uit.lms.shared.dto.request.enrollment.EnrollCourseRequest;
import vn.uit.lms.shared.dto.response.enrollment.EnrollmentDetailResponse;
import vn.uit.lms.shared.dto.response.enrollment.EnrollmentResponse;
import vn.uit.lms.shared.dto.response.enrollment.EnrollmentStatsResponse;
import vn.uit.lms.shared.util.annotation.StudentOnly;
import vn.uit.lms.shared.util.annotation.StudentOrTeacher;
import vn.uit.lms.shared.util.annotation.TeacherOnly;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Enrollment Management", description = "APIs for managing course enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    /**
     * POST /courses/{courseId}/enroll - Đăng ký khóa học
     */
    @Operation(
            summary = "Enroll in a course",
            description = "Student enrolls in a course. For paid courses, payment must be completed first."
    )
    //@SecurityRequirement(name = "bearerAuth")
    @PostMapping("/courses/{courseId}/enroll")
    //@StudentOnly
    public ResponseEntity<EnrollmentDetailResponse> enrollCourse(
            @Parameter(description = "Course ID") @PathVariable Long courseId,
            @Parameter(description = "Enrollment request (payment info for paid courses)")
            @Valid @RequestBody EnrollCourseRequest request) {
        EnrollmentDetailResponse response = enrollmentService.enrollCourse(courseId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /students/{studentId}/enrollments - Danh sách khóa học đã đăng ký
     */
    @Operation(
            summary = "Get student enrollments",
            description = "Get list of all courses enrolled by a student"
    )
    //@SecurityRequirement(name = "bearerAuth")
    @GetMapping("/students/{studentId}/enrollments")
    //@StudentOnly
    public ResponseEntity<PageResponse<EnrollmentResponse>> getStudentEnrollments(
            @Parameter(description = "Student ID") @PathVariable Long studentId,
            @PageableDefault(size = 20, sort = "enrolledAt", direction = Sort.Direction.DESC)
            @Parameter(hidden = true) Pageable pageable) {
        PageResponse<EnrollmentResponse> response = enrollmentService.getStudentEnrollments(studentId, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /courses/{courseId}/enrollments - Danh sách học sinh (Teacher)
     */
    @Operation(
            summary = "Get course enrollments",
            description = "Get list of all students enrolled in a course (Teacher access)"
    )
    //@SecurityRequirement(name = "bearerAuth")
    @GetMapping("/courses/{courseId}/enrollments")
    //@TeacherOnly
    public ResponseEntity<PageResponse<EnrollmentResponse>> getCourseEnrollments(
            @Parameter(description = "Course ID") @PathVariable Long courseId,
            @PageableDefault(size = 20, sort = "enrolledAt", direction = Sort.Direction.DESC)
            @Parameter(hidden = true) Pageable pageable) {
        PageResponse<EnrollmentResponse> response = enrollmentService.getCourseEnrollments(courseId, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /enrollments/{id} - Chi tiết đăng ký
     */
    @Operation(
            summary = "Get enrollment details",
            description = "Get detailed information about a specific enrollment"
    )
    //@SecurityRequirement(name = "bearerAuth")
    @GetMapping("/enrollments/{id}")
    //@StudentOrTeacher
    public ResponseEntity<EnrollmentDetailResponse> getEnrollmentDetail(
            @Parameter(description = "Enrollment ID") @PathVariable Long id) {
        EnrollmentDetailResponse response = enrollmentService.getEnrollmentDetail(id);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /enrollments/{id}/cancel - Hủy đăng ký
     */
    @Operation(
            summary = "Cancel enrollment",
            description = "Student cancels their enrollment in a course"
    )
    //@SecurityRequirement(name = "bearerAuth")
    @PostMapping("/enrollments/{id}/cancel")
    //@StudentOnly
    public ResponseEntity<EnrollmentDetailResponse> cancelEnrollment(
            @Parameter(description = "Enrollment ID") @PathVariable Long id,
            @Parameter(description = "Cancellation request with reason")
            @Valid @RequestBody CancelEnrollmentRequest request) {
        EnrollmentDetailResponse response = enrollmentService.cancelEnrollment(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /enrollments/{id}/complete - Hoàn thành khóa học
     */
    @Operation(
            summary = "Complete enrollment",
            description = "Mark enrollment as completed (Teacher or System). " +
                    "Student must meet all requirements (progress % and pass score)."
    )
    //@SecurityRequirement(name = "bearerAuth")
    @PostMapping("/enrollments/{id}/complete")
    //@TeacherOnly
    public ResponseEntity<EnrollmentDetailResponse> completeEnrollment(
            @Parameter(description = "Enrollment ID") @PathVariable Long id) {
        EnrollmentDetailResponse response = enrollmentService.completeEnrollment(id);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /courses/{courseId}/enrollment-stats - Thống kê đăng ký
     */
    @Operation(
            summary = "Get enrollment statistics",
            description = "Get statistics about enrollments for a course (Teacher access)"
    )
    //@SecurityRequirement(name = "bearerAuth")
    @GetMapping("/courses/{courseId}/enrollment-stats")
    //@TeacherOnly
    public ResponseEntity<EnrollmentStatsResponse> getEnrollmentStats(
            @Parameter(description = "Course ID") @PathVariable Long courseId) {
        EnrollmentStatsResponse response = enrollmentService.getEnrollmentStats(courseId);
        return ResponseEntity.ok(response);
    }
}
