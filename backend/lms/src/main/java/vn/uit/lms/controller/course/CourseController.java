package vn.uit.lms.controller.course;

import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.core.entity.course.Course;
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
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }


    @PostMapping("/teacher/courses")
    @TeacherOnly
    public ResponseEntity<CourseDetailResponse> createNewCourse(@Valid @RequestBody CourseRequest courseRequest) {
        CourseDetailResponse createdCourse = courseService.createCourse(courseRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCourse);
    }

    @GetMapping("/courses/{slug}")
    public ResponseEntity<CourseDetailResponse> getCourseBySlug(@PathVariable String slug) {
        CourseDetailResponse course = courseService.getCourseBySlug(slug);
        return ResponseEntity.ok(course);
    }

    @GetMapping("/courses")
    public ResponseEntity<PageResponse<CourseResponse>> getCoursesActive(
            @Filter Specification<Course> specification,
            Pageable pageable
    ) {
        PageResponse<CourseResponse> courses = courseService.getCoursesActive(specification, pageable);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/admin/courses")
    @AdminOnly
    public ResponseEntity<PageResponse<CourseResponse>> getAllCourses(
            @Filter Specification<Course> specification,
            Pageable pageable
    ) {
        PageResponse<CourseResponse> courses = courseService.getAllCourses(specification, pageable);
        return ResponseEntity.ok(courses);
    }

    @PatchMapping("/teacher/courses/{id}/close")
    @TeacherOnly
    public ResponseEntity<CourseDetailResponse> closeCourse(@PathVariable Long id) {
        CourseDetailResponse closedCourse = courseService.closeCourse(id);
        return ResponseEntity.ok(closedCourse);
    }

    @PatchMapping("/teacher/courses/{id}/open")
    @TeacherOnly
    public ResponseEntity<CourseDetailResponse> openCourse(@PathVariable Long id) {
        CourseDetailResponse openedCourse = courseService.openCourse(id);
        return ResponseEntity.ok(openedCourse);
    }

    @PutMapping("/teacher/courses/{id}")
    @TeacherOnly
    public ResponseEntity<CourseDetailResponse> updateCourse(@PathVariable Long id,
                                                             @Valid @RequestBody CourseUpdateRequest courseUpdateRequest) {
        CourseDetailResponse updatedCourse = courseService.updateCourse(id, courseUpdateRequest);
        return ResponseEntity.ok(updatedCourse);
    }

    @DeleteMapping("/teacher/courses/{id}")
    @TeacherOnly
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok(null);
    }

    @PatchMapping("/teacher/courses/{id}/restore")
    @TeacherOnly
    public ResponseEntity<CourseDetailResponse> restoreCourse(@PathVariable Long id) {
        CourseDetailResponse restoredCourse = courseService.restoreCourse(id);
        return ResponseEntity.ok(restoredCourse);
    }

    @GetMapping("/teacher/courses")
    @TeacherOnly
    public ResponseEntity<PageResponse<CourseResponse>> getMyCourses(
            @Filter Specification<Course> specification,
            Pageable pageable
    ) {
        PageResponse<CourseResponse> myCourses = courseService.getMyCourses(specification, pageable);

        return ResponseEntity.ok(myCourses);
    }
}
