package vn.uit.lms.controller.course;

import com.turkraft.springfilter.boot.Filter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.core.domain.course.CourseVersion;
import vn.uit.lms.service.course.CourseVersionService;
import vn.uit.lms.shared.dto.PageResponse;
import vn.uit.lms.shared.dto.request.account.RejectRequest;
import vn.uit.lms.shared.dto.request.course.CourseVersionRequest;
import vn.uit.lms.shared.dto.response.course.CourseVersionResponse;
import vn.uit.lms.shared.util.annotation.AdminOnly;
import vn.uit.lms.shared.util.annotation.TeacherOnly;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Course Version Management", description = "APIs for managing course versions and approval workflow")
public class CourseVersionController {

    private final CourseVersionService courseVersionService;

    public CourseVersionController(CourseVersionService courseVersionService) {
        this.courseVersionService = courseVersionService;
    }

    @Operation(summary = "Create a new course version")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/courses/{courseId}/versions")
    @TeacherOnly
    public ResponseEntity<CourseVersionResponse> createCourseVersion(
            @Parameter(description = "Course ID") @PathVariable("courseId") Long courseId,
            @Parameter(description = "Version details") @Valid @RequestBody CourseVersionRequest courseVersionRequest) {
        CourseVersionResponse courseVersionResponse = courseVersionService.createCourseVersion(courseId,
                courseVersionRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(courseVersionResponse);
    }

    @Operation(summary = "Get all course versions")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/courses/{courseId}/versions")
    @TeacherOnly
    public ResponseEntity<List<CourseVersionResponse>> getCourseVersions(
            @Parameter(description = "Course ID") @PathVariable("courseId") Long courseId) {
        List<CourseVersionResponse> listVersion = courseVersionService.getCourseVersions(courseId);
        return ResponseEntity.ok(listVersion);
    }

    @Operation(summary = "Get deleted course versions")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/courses/{courseId}/versions/deleted")
    @TeacherOnly
    public ResponseEntity<List<CourseVersionResponse>> getDeletedCourseVersion(
            @Parameter(description = "Course ID") @PathVariable("courseId") Long courseId) {
        List<CourseVersionResponse> listVersion = courseVersionService.getDeletedCourseVersions(courseId);
        return ResponseEntity.ok(listVersion);
    }

    @Operation(summary = "Get course version by ID")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/courses/{courseId}/versions/{versionId}")
    @TeacherOnly
    public ResponseEntity<CourseVersionResponse> getCourseVersionById(
            @Parameter(description = "Course ID") @PathVariable("courseId") Long courseId,
            @Parameter(description = "Version ID") @PathVariable("versionId") Long versionId) {
        CourseVersionResponse response = courseVersionService.getCourseVersionById(courseId, versionId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Update course version (only DRAFT or REJECTED)")
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/courses/{courseId}/versions/{versionId}")
    @TeacherOnly
    public ResponseEntity<CourseVersionResponse> updateCourseVersion(
            @Parameter(description = "Course ID") @PathVariable("courseId") Long courseId,
            @Parameter(description = "Version ID") @PathVariable("versionId") Long versionId,
            @Parameter(description = "Version update details") @Valid @RequestBody CourseVersionRequest request) {
        CourseVersionResponse response = courseVersionService.updateCourseVersion(courseId, versionId, request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Delete course version (only DRAFT, PENDING, REJECTED)")
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/courses/{courseId}/versions/{versionId}")
    @TeacherOnly
    public ResponseEntity<Void> deleteCourseVersion(
            @Parameter(description = "Course ID") @PathVariable("courseId") Long courseId,
            @Parameter(description = "Version ID") @PathVariable("versionId") Long versionId) {
        courseVersionService.deleteCourseVersion(courseId, versionId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get course versions by status")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/courses/{courseId}/versions/status/{status}")
    @TeacherOnly
    public ResponseEntity<List<CourseVersionResponse>> getCourseVersionsByStatus(
            @Parameter(description = "Course ID") @PathVariable("courseId") Long courseId,
            @Parameter(description = "Status") @PathVariable("status") String status) {
        List<CourseVersionResponse> listVersion = courseVersionService.getCourseVersionsByStatus(courseId, status);
        return ResponseEntity.ok(listVersion);
    }

    @Operation(summary = "Submit version for approval")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/courses/{courseId}/versions/{versionId}/submit-approval")
    @TeacherOnly
    public ResponseEntity<CourseVersionResponse> submitApproval(
            @Parameter(description = "Course ID") @PathVariable("courseId") Long courseId,
            @Parameter(description = "Version ID") @PathVariable("versionId") Long versionId) {
        CourseVersionResponse response = courseVersionService.submitCourseVersionToApprove(courseId, versionId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Approve course version (Admin)")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/courses/{courseId}/versions/{versionId}/approve")
    @AdminOnly
    public ResponseEntity<CourseVersionResponse> approveCourseVersion(
            @Parameter(description = "Course ID") @PathVariable("courseId") Long courseId,
            @Parameter(description = "Version ID") @PathVariable("versionId") Long versionId) {
        CourseVersionResponse response = courseVersionService.approveCourseVersion(courseId, versionId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Reject course version (Admin)")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/courses/{courseId}/versions/{versionId}/reject")
    @AdminOnly
    public ResponseEntity<CourseVersionResponse> rejectCourseVersion(
            @Parameter(description = "Course ID") @PathVariable("courseId") Long courseId,
            @Parameter(description = "Version ID") @PathVariable("versionId") Long versionId,
            @Parameter(description = "Rejection details") @Valid @RequestBody RejectRequest rejectRequest) {
        CourseVersionResponse response = courseVersionService.rejectCourseVersion(courseId, versionId, rejectRequest);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Publish course version")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/courses/{courseId}/versions/{versionId}/publish")
    @TeacherOnly
    public ResponseEntity<CourseVersionResponse> publishCourseVersion(
            @Parameter(description = "Course ID") @PathVariable("courseId") Long courseId,
            @Parameter(description = "Version ID") @PathVariable("versionId") Long versionId) {
        CourseVersionResponse response = courseVersionService.publishCourseVersion(courseId, versionId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get all pending course versions (Admin)")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/courses/admin/versions/pending")
    @AdminOnly
    public ResponseEntity<PageResponse<CourseVersionResponse>> getAllPendingCourseVersions(
            @Parameter(hidden = true) @Filter Specification<CourseVersion> spec,
            @Parameter(description = "Pagination parameters") Pageable pageable) {
        return ResponseEntity.ok(courseVersionService.getAllPendingCourseVersion(spec, pageable));
    }

    // ========== PUBLIC APIs - No Authentication Required ==========

    @Operation(
            summary = "Get published version of a course (Public)",
            description = "Get the currently published version of a course by course slug. No authentication required."
    )
    @GetMapping("/public/courses/{courseSlug}/version/published")
    public ResponseEntity<CourseVersionResponse> getPublishedVersionBySlug(
            @Parameter(description = "Course slug") @PathVariable("courseSlug") String courseSlug
    ) {
        CourseVersionResponse publishedVersion = courseVersionService.getPublishedVersionBySlug(courseSlug);
        return ResponseEntity.ok(publishedVersion);
    }

    @Operation(
            summary = "Get published version details (Public)",
            description = "Get detailed information about a published course version. No authentication required."
    )
    @GetMapping("/public/courses/{courseId}/versions/{versionId}")
    public ResponseEntity<CourseVersionResponse> getPublicCourseVersionById(
            @Parameter(description = "Course ID") @PathVariable("courseId") Long courseId,
            @Parameter(description = "Version ID") @PathVariable("versionId") Long versionId
    ) {
        CourseVersionResponse version = courseVersionService.getPublicCourseVersionById(courseId, versionId);
        return ResponseEntity.ok(version);
    }
}
