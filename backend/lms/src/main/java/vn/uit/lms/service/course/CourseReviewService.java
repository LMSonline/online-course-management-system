package vn.uit.lms.service.course;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.entity.Student;
import vn.uit.lms.core.entity.course.Course;
import vn.uit.lms.core.entity.course.CourseReview;
import vn.uit.lms.core.repository.course.CourseRepository;
import vn.uit.lms.core.repository.course.CourseReviewRepository;
import vn.uit.lms.shared.dto.PageResponse;
import vn.uit.lms.shared.dto.request.course.CourseReviewRequest;
import vn.uit.lms.shared.dto.response.course.RatingSummaryResponse;
import vn.uit.lms.shared.dto.response.course.CourseReviewResponse;
import vn.uit.lms.shared.exception.DuplicateResourceException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.course.CourseReviewMapper;
import vn.uit.lms.shared.util.annotation.EnableSoftDeleteFilter;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CourseReviewService {

    private final CourseReviewRepository courseReviewRepository;
    private final CourseRepository courseRepository;
    private final CourseService courseService;

    public CourseReviewService(CourseReviewRepository courseReviewRepository,
                               CourseRepository courseRepository,
                               CourseService courseService) {
        this.courseReviewRepository = courseReviewRepository;
        this.courseRepository = courseRepository;
        this.courseService = courseService;
    }

    /**
     * Check if student has already reviewed this course
     *
     * TODO: Add enrollment and completion verification
     * - Verify student is enrolled in the course before allowing review
     * - Query: enrollmentRepository.findByCourseAndStudent(course, student)
     * - Check if student has completed the course or met minimum progress
     * - Only allow reviews from students who have made significant progress (e.g., >50%)
     * - Consider adding cooldown period after enrollment before allowing review
     */
    public boolean hasReviewed(Course course, Student student) {
        return courseReviewRepository.existsByCourseAndStudent(course, student);
    }

    /**
     * Create a new course review
     *
     * TODO: Implement enrollment and eligibility validation
     * - Verify student is enrolled in the course
     * - Check enrollment status (must be ACTIVE or COMPLETED)
     * - Validate minimum course progress before allowing review (e.g., >50%)
     * - Check if student has completed at least X lessons or chapters
     * - Consider adding time-based restrictions (enrolled for at least X days)
     * - Update course average rating after review submission
     * - Send notification to instructor about new review
     */
    @Transactional
    @EnableSoftDeleteFilter
    public CourseReviewResponse createNewReview(CourseReviewRequest courseReviewRequest, Long courseId) {

        Course course = courseRepository.findByIdAndDeletedAtIsNull(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        Student student = courseService.verifyStudent(course);

        // TODO: Verify enrollment and eligibility
        // Enrollment enrollment = enrollmentRepository.findByCourseAndStudent(course, student)
        //     .orElseThrow(() -> new UnauthorizedException("Must enroll in course before reviewing"));
        // if (enrollment.getProgressPercentage() < 50.0) {
        //     throw new InvalidRequestException("Must complete at least 50% of the course before reviewing");
        // }

        if(hasReviewed(course, student)){
            throw new DuplicateResourceException("Student already has reviewed this course");
        }

        CourseReview courseReview = CourseReviewMapper.fromRequest(courseReviewRequest);

        courseReview.setStudent(student);
        courseReview.setCourse(course);

        try {
            CourseReview savedReview = courseReviewRepository.save(courseReview);
            // TODO: Update course average rating
            // courseService.updateAverageRating(course);
            return CourseReviewMapper.toResponse(savedReview);
        } catch (DataIntegrityViolationException e) {
            throw new DuplicateResourceException("Student already has reviewed this course");
        }

    }

    @EnableSoftDeleteFilter
    public PageResponse<CourseReviewResponse> getCourseReviews(Long courseId, Pageable pageable) {

        Course course = courseRepository.findByIdAndDeletedAtIsNull(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        Page<CourseReview> page = courseReviewRepository.findAllByCourse(course, pageable);
        List<CourseReviewResponse> items = page.getContent().stream().map(CourseReviewMapper::toResponse).toList();

        return new PageResponse<>(
                items,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.hasNext(),
                page.hasPrevious()
        );
    }

    /**
     * Update an existing review
     *
     * TODO: Implement rating recalculation
     * - Recalculate course average rating after update
     * - Update course rating statistics
     * - Send notification to instructor if rating changed significantly
     * - Consider adding edit history/audit trail for reviews
     */
    @Transactional
    @EnableSoftDeleteFilter
    public CourseReviewResponse updateReview(Long courseId, Long reviewId, CourseReviewRequest request) {
        Course course = courseRepository.findByIdAndDeletedAtIsNull(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        Student student = courseService.verifyStudent(course);

        CourseReview review = courseReviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getStudent().getId().equals(student.getId()))
            throw new SecurityException("Cannot update other student's review");

        review.setRating(request.getRating());
        review.setTitle(request.getTitle());
        review.setContent(request.getContent());

        CourseReview saved = courseReviewRepository.save(review);

        // TODO: Recalculate course average rating
        // courseService.updateAverageRating(course);

        return CourseReviewMapper.toResponse(saved);
    }

    /**
     * Delete a review
     *
     * TODO: Implement rating recalculation after deletion
     * - Recalculate course average rating after deletion
     * - Update course rating statistics and distribution
     * - Consider soft delete instead of hard delete for audit purposes
     * - Add admin override capability to delete inappropriate reviews
     */
    @Transactional
    @EnableSoftDeleteFilter
    public void deleteReview(Long courseId, Long reviewId) {

        Course course = courseRepository.findByIdAndDeletedAtIsNull(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        CourseReview review = courseReviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        Student student = courseService.verifyStudent(course);

        if (!review.getStudent().getId().equals(student.getId()))
            throw new SecurityException("Cannot delete other student's review");

        courseReviewRepository.delete(review);

        // TODO: Recalculate course average rating
        // courseService.updateAverageRating(course);
    }

    @EnableSoftDeleteFilter
    public RatingSummaryResponse getRatingSummary(Long courseId) {
        Course course = courseRepository.findByIdAndDeletedAtIsNull(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        List<CourseReview> reviews = courseReviewRepository.findAllByCourse(course);

        double average = reviews.stream()
                .mapToInt(CourseReview::getRating)
                .average()
                .orElse(0.0);

        long count = reviews.size();

        Map<Byte, Long> ratingCount = reviews.stream()
                .collect(Collectors.groupingBy(CourseReview::getRating, Collectors.counting()));

        return RatingSummaryResponse.builder()
                .averageRating(average)
                .totalReviews(count)
                .ratingDistribution(ratingCount)
                .build();
    }




}
