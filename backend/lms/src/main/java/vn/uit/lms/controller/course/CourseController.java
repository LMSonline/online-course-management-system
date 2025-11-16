package vn.uit.lms.controller.course;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.course.CourseService;
import vn.uit.lms.shared.dto.request.course.CourseRequest;
import vn.uit.lms.shared.dto.response.course.CourseDetailResponse;
import vn.uit.lms.shared.util.annotation.TeacherOnly;

@RestController
@RequestMapping("/api/v1/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }


    @PostMapping
    @TeacherOnly
    public ResponseEntity<CourseDetailResponse> createNewCourse(@Valid @RequestBody CourseRequest courseRequest) {
        CourseDetailResponse createdCourse = courseService.createCourse(courseRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCourse);
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<CourseDetailResponse> getCourseBySlug(@PathVariable String slug) {
        CourseDetailResponse course = courseService.getCourseBySlug(slug);
        return ResponseEntity.ok(course);
    }
}
