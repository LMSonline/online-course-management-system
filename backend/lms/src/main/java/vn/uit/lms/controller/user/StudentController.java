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
import vn.uit.lms.service.StudentService;
import vn.uit.lms.shared.dto.PageResponse;
import vn.uit.lms.shared.dto.request.student.UpdateStudentRequest;
import vn.uit.lms.shared.dto.response.account.UploadAvatarResponse;
import vn.uit.lms.shared.dto.response.student.*;
import vn.uit.lms.shared.util.annotation.ApiMessage;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/students")
@Tag(name = "Student Management", description = "APIs for managing student information and activities")
@SecurityRequirement(name = "bearerAuth")
public class StudentController {

    private static final Logger log = LoggerFactory.getLogger(StudentController.class);
    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @Operation(
            summary = "Get student by ID",
            description = "Retrieve detailed information about a student by their ID. Students can only view their own profile, teachers can view students in their courses, and admins can view any student."
    )
    @GetMapping("/{id}")
    @ApiMessage("Get student by ID")
    public ResponseEntity<StudentDetailResponse> getStudentById(
            @Parameter(description = "Student ID", required = true, example = "1")
            @PathVariable Long id
    ) {
        log.info("GET /api/v1/students/{}", id);
        StudentDetailResponse response = studentService.getStudentById(id);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Get student by code",
            description = "Retrieve detailed information about a student by their student code. Students can only view their own profile, teachers can view students in their courses, and admins can view any student."
    )
    @GetMapping("/code/{code}")
    @ApiMessage("Get student by code")
    public ResponseEntity<StudentDetailResponse> getStudentByCode(
            @Parameter(description = "Student code", required = true, example = "SV2024001")
            @PathVariable String code
    ) {
        log.info("GET /api/v1/students/code/{}", code);
        StudentDetailResponse response = studentService.getStudentByCode(code);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Update student information",
            description = "Update student profile information. Students can only update their own profile, admins can update any student."
    )
    @PutMapping("/{id}")
    @ApiMessage("Update student information")
    public ResponseEntity<StudentDetailResponse> updateStudent(
            @Parameter(description = "Student ID", required = true, example = "1")
            @PathVariable Long id,
            @Parameter(description = "Updated student information", required = true)
            @Valid @RequestBody UpdateStudentRequest request
    ) {
        log.info("PUT /api/v1/students/{}", id);
        StudentDetailResponse response = studentService.updateStudent(id, request);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Upload student avatar",
            description = "Upload a new avatar image for a student. Students can only upload their own avatar. Accepts JPG, PNG, and WEBP formats."
    )
    @PutMapping(value = "/{id}/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ApiMessage("Upload student avatar")
    public ResponseEntity<UploadAvatarResponse> uploadAvatar(
            @Parameter(description = "Student ID", required = true, example = "1")
            @PathVariable Long id,
            @Parameter(description = "Avatar image file (JPG, PNG, WEBP)", required = true)
            @RequestParam("file") MultipartFile file
    ) {
        log.info("PUT /api/v1/students/{}/avatar", id);
        UploadAvatarResponse response = studentService.uploadStudentAvatar(id, file);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Get student's courses",
            description = "Retrieve a paginated list of courses that the student is enrolled in. Students can only view their own courses, teachers can view students in their courses, and admins can view any student's courses."
    )
    @GetMapping("/{id}/courses")
    @ApiMessage("Get student's enrolled courses")
    public ResponseEntity<PageResponse<StudentCourseResponse>> getStudentCourses(
            @Parameter(description = "Student ID", required = true, example = "1")
            @PathVariable Long id,
            @Parameter(description = "Pagination parameters")
            Pageable pageable
    ) {
        log.info("GET /api/v1/students/{}/courses", id);
        PageResponse<StudentCourseResponse> response = studentService.getStudentCourses(id, pageable);
        return ResponseEntity.ok(response);
    }


    @Operation(
            summary = "Get student's certificates",
            description = "Retrieve a paginated list of certificates earned by the student. Students can only view their own certificates, teachers can view certificates for their courses, and admins can view any student's certificates."
    )
    @GetMapping("/{id}/certificates")
    @ApiMessage("Get student's certificates")
    public ResponseEntity<PageResponse<StudentCertificateResponse>> getStudentCertificates(
            @Parameter(description = "Student ID", required = true, example = "1")
            @PathVariable Long id,
            @Parameter(description = "Pagination parameters")
            Pageable pageable
    ) {
        log.info("GET /api/v1/students/{}/certificates", id);
        PageResponse<StudentCertificateResponse> response = studentService.getStudentCertificates(id, pageable);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Delete student (Admin only)",
            description = "Soft delete a student account by setting its status to DEACTIVATED. This action is reversible. Only accessible by administrators."
    )
    @DeleteMapping("/{id}")
    @ApiMessage("Delete student (Admin only)")
    public ResponseEntity<Void> deleteStudent(
            @Parameter(description = "Student ID to delete", required = true, example = "1")
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        log.info("DELETE /api/v1/students/{}", id);
        String ip = Optional.ofNullable(request.getHeader("X-Forwarded-For"))
                .orElse(request.getRemoteAddr());
        studentService.deleteStudent(id, ip);
        return ResponseEntity.noContent().build();
    }
}
