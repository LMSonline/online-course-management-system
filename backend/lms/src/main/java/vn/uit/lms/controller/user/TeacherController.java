package vn.uit.lms.controller.user;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.uit.lms.service.TeacherService;
import vn.uit.lms.shared.dto.PageResponse;
import vn.uit.lms.shared.dto.request.teacher.ApproveTeacherRequest;
import vn.uit.lms.shared.dto.request.teacher.RejectTeacherRequest;
import vn.uit.lms.shared.dto.request.teacher.UpdateTeacherRequest;
import vn.uit.lms.shared.dto.response.account.UploadAvatarResponse;
import vn.uit.lms.shared.dto.response.course.CourseResponse;
import vn.uit.lms.shared.dto.response.student.StudentResponse;
import vn.uit.lms.shared.dto.response.teacher.TeacherDetailResponse;
import vn.uit.lms.shared.dto.response.teacher.TeacherRevenueResponse;
import vn.uit.lms.shared.dto.response.teacher.TeacherStatsResponse;
import vn.uit.lms.shared.util.annotation.AdminOnly;
import vn.uit.lms.shared.util.annotation.ApiMessage;
import vn.uit.lms.shared.util.annotation.Authenticated;
import vn.uit.lms.shared.util.annotation.TeacherOrAdmin;
import vn.uit.lms.shared.util.annotation.TeacherOnly;

@RestController
@RequestMapping("/api/v1/teachers")
@Tag(name = "Teacher Management", description = "APIs for managing teacher information, courses, and statistics")
@SecurityRequirement(name = "bearerAuth")
public class TeacherController {

    private static final Logger log = LoggerFactory.getLogger(TeacherController.class);
    private final TeacherService teacherService;

    public TeacherController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @Operation(
            summary = "Get teacher by ID",
            description = "Retrieve detailed information about a teacher by their ID. Teachers can only view their own profile, students can view approved teachers, and admins can view any teacher."
    )
    @GetMapping("/{id}")
    @ApiMessage("Get teacher by ID")
    @Authenticated
    public ResponseEntity<TeacherDetailResponse> getTeacherById(
            @Parameter(description = "Teacher ID", required = true, example = "1")
            @PathVariable Long id
    ) {
        log.info("GET /api/v1/teachers/{}", id);
        TeacherDetailResponse response = teacherService.getTeacherById(id);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Get teacher by code",
            description = "Retrieve detailed information about a teacher by their teacher code. Teachers can only view their own profile, students can view approved teachers, and admins can view any teacher."
    )
    @GetMapping("/code/{code}")
    @ApiMessage("Get teacher by code")
    @Authenticated
    public ResponseEntity<TeacherDetailResponse> getTeacherByCode(
            @Parameter(description = "Teacher code", required = true, example = "GV2024001")
            @PathVariable String code
    ) {
        log.info("GET /api/v1/teachers/code/{}", code);
        TeacherDetailResponse response = teacherService.getTeacherByCode(code);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Update teacher information",
            description = "Update teacher profile information including specialty, degree, and personal details. Teachers can only update their own profile, admins can update any teacher."
    )
    @PutMapping("/{id}")
    @ApiMessage("Update teacher information")
    @TeacherOrAdmin
    public ResponseEntity<TeacherDetailResponse> updateTeacher(
            @Parameter(description = "Teacher ID", required = true, example = "1")
            @PathVariable Long id,
            @Parameter(description = "Updated teacher information", required = true)
            @Valid @RequestBody UpdateTeacherRequest request
    ) {
        log.info("PUT /api/v1/teachers/{}", id);
        TeacherDetailResponse response = teacherService.updateTeacher(id, request);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Upload teacher avatar",
            description = "Upload a new avatar image for a teacher. Teachers can only upload their own avatar. Accepts JPG, PNG, and WEBP formats."
    )
    @PutMapping(value = "/{id}/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ApiMessage("Upload teacher avatar")
    @TeacherOrAdmin
    public ResponseEntity<UploadAvatarResponse> uploadAvatar(
            @Parameter(description = "Teacher ID", required = true, example = "1")
            @PathVariable Long id,
            @Parameter(description = "Avatar image file (JPG, PNG, WEBP)", required = true)
            @RequestParam("file") MultipartFile file
    ) {
        log.info("PUT /api/v1/teachers/{}/avatar", id);
        UploadAvatarResponse response = teacherService.uploadTeacherAvatar(id, file);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Request teacher approval",
            description = "Teacher requests approval from admin to start teaching. Can only be called by the teacher themselves."
    )
    @PostMapping("/{id}/request-approval")
    @ApiMessage("Request teacher approval")
    @TeacherOnly
    public ResponseEntity<TeacherDetailResponse> requestApproval(
            @Parameter(description = "Teacher ID", required = true, example = "1")
            @PathVariable Long id
    ) {
        log.info("POST /api/v1/teachers/{}/request-approval", id);
        TeacherDetailResponse response = teacherService.requestApproval(id);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Approve teacher",
            description = "Admin approves a teacher to allow them to create and publish courses. Only accessible by admins."
    )
    @PostMapping("/{id}/approve")
    @ApiMessage("Approve teacher")
    @AdminOnly
    public ResponseEntity<TeacherDetailResponse> approveTeacher(
            @Parameter(description = "Teacher ID", required = true, example = "1")
            @PathVariable Long id,
            @Parameter(description = "Optional approval note")
            @RequestBody(required = false) ApproveTeacherRequest request
    ) {
        log.info("POST /api/v1/teachers/{}/approve", id);
        String note = request != null ? request.getNote() : null;
        TeacherDetailResponse response = teacherService.approveTeacher(id, note);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Reject teacher",
            description = "Admin rejects a teacher application with a reason. Only accessible by admins."
    )
    @PostMapping("/{id}/reject")
    @ApiMessage("Reject teacher")
    @AdminOnly
    public ResponseEntity<TeacherDetailResponse> rejectTeacher(
            @Parameter(description = "Teacher ID", required = true, example = "1")
            @PathVariable Long id,
            @Parameter(description = "Rejection reason", required = true)
            @Valid @RequestBody RejectTeacherRequest request
    ) {
        log.info("POST /api/v1/teachers/{}/reject", id);
        TeacherDetailResponse response = teacherService.rejectTeacher(id, request.getReason());
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Get teacher's courses",
            description = "Retrieve a paginated list of courses created by the teacher. Teachers can view their own courses, students can view published courses by approved teachers, and admins can view all."
    )
    @GetMapping("/{id}/courses")
    @ApiMessage("Get teacher's courses")
    @Authenticated
    public ResponseEntity<PageResponse<CourseResponse>> getTeacherCourses(
            @Parameter(description = "Teacher ID", required = true, example = "1")
            @PathVariable Long id,
            @Parameter(description = "Pagination parameters")
            Pageable pageable
    ) {
        log.info("GET /api/v1/teachers/{}/courses", id);
        PageResponse<CourseResponse> response = teacherService.getTeacherCourses(id, pageable);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Get teacher's students",
            description = "Retrieve a paginated list of students enrolled in the teacher's courses. Teachers can only view their own students, admins can view any teacher's students."
    )
    @GetMapping("/{id}/students")
    @ApiMessage("Get teacher's students")
    @TeacherOrAdmin
    public ResponseEntity<PageResponse<StudentResponse>> getTeacherStudents(
            @Parameter(description = "Teacher ID", required = true, example = "1")
            @PathVariable Long id,
            @Parameter(description = "Pagination parameters")
            Pageable pageable
    ) {
        log.info("GET /api/v1/teachers/{}/students", id);
        PageResponse<StudentResponse> response = teacherService.getTeacherStudents(id, pageable);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Get teacher's revenue statistics",
            description = "Retrieve revenue statistics including total revenue, monthly revenue, and breakdown by course. Teachers can only view their own revenue, admins can view any teacher's revenue."
    )
    @GetMapping("/{id}/revenue")
    @ApiMessage("Get teacher's revenue")
    @TeacherOrAdmin
    public ResponseEntity<TeacherRevenueResponse> getTeacherRevenue(
            @Parameter(description = "Teacher ID", required = true, example = "1")
            @PathVariable Long id
    ) {
        log.info("GET /api/v1/teachers/{}/revenue", id);
        TeacherRevenueResponse response = teacherService.getTeacherRevenue(id);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Get teacher's statistics",
            description = "Retrieve overall statistics including course count, student count, average rating, and total reviews. Teachers can view their own stats, admins can view any teacher's stats."
    )
    @GetMapping("/{id}/stats")
    @ApiMessage("Get teacher's statistics")
    public ResponseEntity<TeacherStatsResponse> getTeacherStats(
            @Parameter(description = "Teacher ID", required = true, example = "1")
            @PathVariable Long id
    ) {
        log.info("GET /api/v1/teachers/{}/stats", id);
        TeacherStatsResponse response = teacherService.getTeacherStats(id);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Delete teacher",
            description = "Soft delete a teacher account by setting it to DEACTIVATED status. Only accessible by admins."
    )
    @DeleteMapping("/{id}")
    @ApiMessage("Delete teacher")
    public ResponseEntity<Void> deleteTeacher(
            @Parameter(description = "Teacher ID", required = true, example = "1")
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        log.info("DELETE /api/v1/teachers/{}", id);
        String ipAddress = request.getRemoteAddr();
        teacherService.deleteTeacher(id, ipAddress);
        return ResponseEntity.noContent().build();
    }
}
