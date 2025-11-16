package vn.uit.lms.controller.course;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.uit.lms.service.course.CourseService;
import vn.uit.lms.shared.util.annotation.TeacherOnly;

@RestController
@RequestMapping("/api/v1/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

//    @PostMapping
//    @TeacherOnly
//    public ResponseEntity< >
}
