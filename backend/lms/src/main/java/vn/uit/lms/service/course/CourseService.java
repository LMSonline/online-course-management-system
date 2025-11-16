package vn.uit.lms.service.course;

import org.springframework.stereotype.Service;
import vn.uit.lms.core.repository.course.CourseRepository;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }


}
