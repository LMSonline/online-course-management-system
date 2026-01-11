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
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.uit.lms.core.domain.course.Course;
import vn.uit.lms.service.course.CourseService;
import vn.uit.lms.shared.dto.PageResponse;
import vn.uit.lms.shared.dto.request.course.CourseRequest;
import vn.uit.lms.shared.dto.request.course.CourseUpdateRequest;
import vn.uit.lms.shared.dto.response.course.CourseDetailResponse;
import vn.uit.lms.shared.dto.response.course.CourseResponse;
import vn.uit.lms.shared.util.annotation.AdminOnly;
import vn.uit.lms.shared.util.annotation.TeacherOnly;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Course Management", description = "APIs for managing courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @Operation(summary = "Create a new course")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/teacher/courses")
    @TeacherOnly
    public ResponseEntity<CourseDetailResponse> createNewCourse(
            @Parameter(description = "Course details") @Valid @RequestBody CourseRequest courseRequest) {
        CourseDetailResponse createdCourse = courseService.createCourse(courseRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCourse);
    }

    @Operation(summary = "Get course by slug")
    @GetMapping("/courses/{slug}")
    public ResponseEntity<CourseDetailResponse> getCourseBySlug(
            @Parameter(description = "Course slug") @PathVariable String slug) {
        CourseDetailResponse course = courseService.getCourseBySlug(slug);
        return ResponseEntity.ok(course);
    }

    @Operation(summary = "Get all active courses")
    @GetMapping("/courses")
    public ResponseEntity<PageResponse<CourseResponse>> getCoursesActive(
            @Parameter(hidden = true) @Filter Specification<Course> specification,
            @Parameter(description = "Pagination parameters") Pageable pageable
    ) {
        PageResponse<CourseResponse> courses = courseService.getCoursesActive(specification, pageable);
        return ResponseEntity.ok(courses);
    }

    @Operation(summary = "Get all courses (Admin)")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/admin/courses")
    @AdminOnly
    public ResponseEntity<PageResponse<CourseResponse>> getAllCourses(
            @Parameter(hidden = true) @Filter Specification<Course> specification,
            @Parameter(description = "Pagination parameters") Pageable pageable
    ) {
        PageResponse<CourseResponse> courses = courseService.getAllCourses(specification, pageable);
        return ResponseEntity.ok(courses);
    }

    @Operation(summary = "Close a course")
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/teacher/courses/{id}/close")
    @TeacherOnly
    public ResponseEntity<CourseDetailResponse> closeCourse(
            @Parameter(description = "Course ID") @PathVariable Long id) {
        CourseDetailResponse closedCourse = courseService.closeCourse(id);
        return ResponseEntity.ok(closedCourse);
    }

    @Operation(summary = "Open a course")
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/teacher/courses/{id}/open")
    @TeacherOnly
    public ResponseEntity<CourseDetailResponse> openCourse(
            @Parameter(description = "Course ID") @PathVariable Long id) {
        CourseDetailResponse openedCourse = courseService.openCourse(id);
        return ResponseEntity.ok(openedCourse);
    }

    @Operation(summary = "Update a course")
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/teacher/courses/{id}")
    @TeacherOnly
    public ResponseEntity<CourseDetailResponse> updateCourse(
            @Parameter(description = "Course ID") @PathVariable Long id,
            @Parameter(description = "Updated course details") @Valid @RequestBody CourseUpdateRequest courseUpdateRequest) {
        CourseDetailResponse updatedCourse = courseService.updateCourse(id, courseUpdateRequest);
        return ResponseEntity.ok(updatedCourse);
    }

    @Operation(summary = "Delete a course")
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/teacher/courses/{id}")
    @TeacherOnly
    public ResponseEntity<Void> deleteCourse(
            @Parameter(description = "Course ID") @PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Restore a deleted course")
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/teacher/courses/{id}/restore")
    @TeacherOnly
    public ResponseEntity<CourseDetailResponse> restoreCourse(
            @Parameter(description = "Course ID") @PathVariable Long id) {
        CourseDetailResponse restoredCourse = courseService.restoreCourse(id);
        return ResponseEntity.ok(restoredCourse);
    }

    @Operation(summary = "Upload course thumbnail")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping(value = "/teacher/courses/{id}/thumbnail", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @TeacherOnly
    public ResponseEntity<CourseDetailResponse> uploadCourseThumbnail(
            @Parameter(description = "Course ID") @PathVariable Long id,
            @Parameter(description = "Thumbnail image file", required = true) @RequestParam("file") MultipartFile file) {
        CourseDetailResponse updatedCourse = courseService.uploadCourseThumbnail(id, file);
        return ResponseEntity.ok(updatedCourse);
    }

    @Operation(summary = "Get my courses (Teacher)")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/teacher/courses")
    @TeacherOnly
    public ResponseEntity<PageResponse<CourseResponse>> getMyCourses(
            @Parameter(hidden = true) @Filter Specification<Course> specification,
            @Parameter(description = "Pagination parameters") Pageable pageable
    ) {
        PageResponse<CourseResponse> myCourses = courseService.getMyCourses(specification, pageable);
        return ResponseEntity.ok(myCourses);
    }

    // ========== PUBLIC APIs - No Authentication Required ==========

    @Operation(
            summary = "Get all published courses (Public)",
            description = "Get all courses that have at least one published version. No authentication required. Supports filtering and search."
    )
    @GetMapping("/public/courses")
    public ResponseEntity<PageResponse<CourseResponse>> getPublishedCourses(
            @Parameter(hidden = true) @Filter Specification<Course> specification,
            @Parameter(description = "Pagination parameters") Pageable pageable
    ) {
        PageResponse<CourseResponse> publishedCourses = courseService.getPublishedCourses(specification, pageable);
        return ResponseEntity.ok(publishedCourses);
    }

    @Operation(
            summary = "Get published course by slug (Public)",
            description = "Get detailed information about a published course by its slug. Shows only published version info. No authentication required."
    )
    @GetMapping("/public/courses/{slug}")
    public ResponseEntity<CourseDetailResponse> getPublishedCourseBySlug(
            @Parameter(description = "Course slug") @PathVariable String slug
    ) {
        CourseDetailResponse course = courseService.getPublishedCourseBySlug(slug);
        return ResponseEntity.ok(course);
    }

    @Operation(
            summary = "Search published courses (Public)",
            description = "Search courses by title, description, or tags. Only returns courses with published versions. No authentication required."
    )
    @GetMapping("/public/courses/search")
    public ResponseEntity<PageResponse<CourseResponse>> searchPublishedCourses(
            @Parameter(description = "Search query") @RequestParam(required = false) String query,
            @Parameter(description = "Category ID filter") @RequestParam(required = false) Long categoryId,
            @Parameter(description = "Difficulty level filter") @RequestParam(required = false) String difficulty,
            @Parameter(description = "Tag names (comma-separated)") @RequestParam(required = false) String tags,
            @Parameter(description = "Pagination parameters") Pageable pageable
    ) {
        PageResponse<CourseResponse> searchResults = courseService.searchPublishedCourses(
                query, categoryId, difficulty, tags, pageable
        );
        return ResponseEntity.ok(searchResults);
    }
}
