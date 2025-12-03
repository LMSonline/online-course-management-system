package vn.uit.lms.controller.course.content;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Lesson Resource", description = "APIs for managing lesson resources")
public class LessonResourceController {
}
