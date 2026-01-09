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


@RestController
@RequestMapping("/api/v1")
@Tag(name = "Course Management", description = "APIs for managing courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @Operation(summary = "Create a new course")
    @PostMapping("/teacher/courses")
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
    @GetMapping("/admin/courses")
    public ResponseEntity<PageResponse<CourseResponse>> getAllCourses(
            @Parameter(hidden = true) @Filter Specification<Course> specification,
            @Parameter(description = "Pagination parameters") Pageable pageable
    ) {
        PageResponse<CourseResponse> courses = courseService.getAllCourses(specification, pageable);
        return ResponseEntity.ok(courses);
    }

    @Operation(summary = "Close a course")
    @PatchMapping("/teacher/courses/{id}/close")
    public ResponseEntity<CourseDetailResponse> closeCourse(
            @Parameter(description = "Course ID") @PathVariable Long id) {
        CourseDetailResponse closedCourse = courseService.closeCourse(id);
        return ResponseEntity.ok(closedCourse);
    }

    @Operation(summary = "Open a course")
    @PatchMapping("/teacher/courses/{id}/open")
    public ResponseEntity<CourseDetailResponse> openCourse(
            @Parameter(description = "Course ID") @PathVariable Long id) {
        CourseDetailResponse openedCourse = courseService.openCourse(id);
        return ResponseEntity.ok(openedCourse);
    }

    @Operation(summary = "Update a course")
    @PutMapping("/teacher/courses/{id}")
    public ResponseEntity<CourseDetailResponse> updateCourse(
            @Parameter(description = "Course ID") @PathVariable Long id,
            @Parameter(description = "Updated course details") @Valid @RequestBody CourseUpdateRequest courseUpdateRequest) {
        CourseDetailResponse updatedCourse = courseService.updateCourse(id, courseUpdateRequest);
        return ResponseEntity.ok(updatedCourse);
    }

    @Operation(summary = "Delete a course")
    @DeleteMapping("/teacher/courses/{id}")
    public ResponseEntity<Void> deleteCourse(
            @Parameter(description = "Course ID") @PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Restore a deleted course")
    @PatchMapping("/teacher/courses/{id}/restore")
    public ResponseEntity<CourseDetailResponse> restoreCourse(
            @Parameter(description = "Course ID") @PathVariable Long id) {
        CourseDetailResponse restoredCourse = courseService.restoreCourse(id);
        return ResponseEntity.ok(restoredCourse);
    }

    @Operation(summary = "Upload course thumbnail")
    @PostMapping(value = "/teacher/courses/{id}/thumbnail", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CourseDetailResponse> uploadCourseThumbnail(
            @Parameter(description = "Course ID") @PathVariable Long id,
            @Parameter(description = "Thumbnail image file", required = true) @RequestParam("file") MultipartFile file) {
        CourseDetailResponse updatedCourse = courseService.uploadCourseThumbnail(id, file);
        return ResponseEntity.ok(updatedCourse);
    }

    @Operation(summary = "Get my courses (Teacher)")
    @GetMapping("/teacher/courses")
    public ResponseEntity<PageResponse<CourseResponse>> getMyCourses(
            @Parameter(hidden = true) @Filter Specification<Course> specification,
            @Parameter(description = "Pagination parameters") Pageable pageable
    ) {
        PageResponse<CourseResponse> myCourses = courseService.getMyCourses(specification, pageable);
        return ResponseEntity.ok(myCourses);
    }
}
