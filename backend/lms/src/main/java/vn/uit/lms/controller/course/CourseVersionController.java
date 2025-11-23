package vn.uit.lms.controller.course;

import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.core.entity.course.CourseVersion;
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
public class CourseVersionController {

    private final CourseVersionService courseVersionService;

    public CourseVersionController(CourseVersionService courseVersionService) {
        this.courseVersionService = courseVersionService;
    }

    @PostMapping("/courses/{courseId}/versions")
    @TeacherOnly
    public ResponseEntity<CourseVersionResponse> createCourseVersion(
            @PathVariable("courseId") Long courseId,
            @Valid @RequestBody CourseVersionRequest courseVersionRequest
    ) {

        CourseVersionResponse courseVersionResponse = courseVersionService.createCourseVersion(courseId, courseVersionRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(courseVersionResponse);
    }

    @GetMapping("/courses/{courseId}/versions")
    @TeacherOnly
    public ResponseEntity<List<CourseVersionResponse>> getCourseVersions(
            @PathVariable("courseId") Long courseId
    ){
        List<CourseVersionResponse> listVersion = courseVersionService.getCourseVersions(courseId);
        return ResponseEntity.ok(listVersion);
    }

    @GetMapping("/courses/{courseId}/versions/deleted")
    @TeacherOnly
    public ResponseEntity<List<CourseVersionResponse>> getDeletedCourseVersion(
            @PathVariable("courseId") Long courseId
    ){
        List<CourseVersionResponse> listVersion = courseVersionService.getDeletedCourseVersions(courseId);
        return ResponseEntity.ok(listVersion);
    }

    @GetMapping("/courses/{courseId}/versions/{versionId}")
    @TeacherOnly
    public ResponseEntity<CourseVersionResponse> getCourseVersionById(
            @PathVariable("courseId") Long courseId,
            @PathVariable("versionId") Long versionId
    ){
        CourseVersionResponse response = courseVersionService.getCourseVersionById(courseId, versionId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/courses/{courseId}/versions/{versionId}/submit-approval")
    @TeacherOnly
    public ResponseEntity<CourseVersionResponse> submitApproval(
            @PathVariable("courseId") Long courseId,
            @PathVariable("versionId") Long versionId
    ){
        CourseVersionResponse response = courseVersionService.submitCourseVersionToApprove(courseId, versionId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/courses/{courseId}/versions/{versionId}/approve")
    @AdminOnly
    public ResponseEntity<CourseVersionResponse> approveCourseVersion(
            @PathVariable("courseId") Long courseId,
            @PathVariable("versionId") Long versionId
    ){
        CourseVersionResponse response = courseVersionService.approveCourseVersion(courseId, versionId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/courses/{courseId}/versions/{versionId}/reject")
    @AdminOnly
    public ResponseEntity<CourseVersionResponse> rejectCourseVersion(
            @PathVariable("courseId") Long courseId,
            @PathVariable("versionId") Long versionId,
            @Valid @RequestBody RejectRequest rejectRequest
    ){
        CourseVersionResponse response = courseVersionService.rejectCourseVersion(courseId, versionId, rejectRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/courses/{courseId}/versions/{versionId}/publish")
    @TeacherOnly
    public ResponseEntity<CourseVersionResponse> publishCourseVersion(
            @PathVariable("courseId") Long courseId,
            @PathVariable("versionId") Long versionId
    ){
        CourseVersionResponse response = courseVersionService.publishCourseVersion(courseId, versionId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/courses/admin/versions/pending")
    @AdminOnly
    public ResponseEntity<PageResponse<CourseVersionResponse>> getAllPendingCourseVersions(
            @Filter Specification<CourseVersion> spec,
            Pageable pageable
    ){
        return ResponseEntity.ok(courseVersionService.getAllPendingCourseVersion(spec, pageable));
    }
}
