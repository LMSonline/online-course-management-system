package vn.uit.lms.service.course;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.repository.course.CourseReviewRepository;

@Service
public class CourseReviewService {

    private final CourseReviewRepository courseReviewRepository;

    public CourseReviewService(CourseReviewRepository courseReviewRepository) {
        this.courseReviewRepository = courseReviewRepository;
    }

//    @Transactional

}
