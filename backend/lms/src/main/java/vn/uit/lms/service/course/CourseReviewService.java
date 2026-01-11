package vn.uit.lms.service.course;

import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.domain.Account;
import vn.uit.lms.core.domain.Student;
import vn.uit.lms.core.domain.course.Course;
import vn.uit.lms.core.domain.course.CourseReview;
import vn.uit.lms.core.domain.learning.Enrollment;
import vn.uit.lms.core.repository.StudentRepository;
import vn.uit.lms.core.repository.course.CourseRepository;
import vn.uit.lms.core.repository.course.CourseReviewRepository;
import vn.uit.lms.service.AccountService;
import vn.uit.lms.service.learning.EnrollmentAccessService;
import vn.uit.lms.shared.constant.Role;
import vn.uit.lms.shared.dto.PageResponse;
import vn.uit.lms.shared.dto.request.course.CourseReviewRequest;
import vn.uit.lms.shared.dto.response.course.RatingSummaryResponse;
import vn.uit.lms.shared.dto.response.course.CourseReviewResponse;
import vn.uit.lms.shared.exception.DuplicateResourceException;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.course.CourseReviewMapper;
import vn.uit.lms.shared.util.annotation.EnableSoftDeleteFilter;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Course Review Service - Manages course reviews with enrollment verification.
 *
 * Access Control: Students can only review courses they are enrolled in.
 */
@Service
@Slf4j
public class CourseReviewService {

    private final CourseReviewRepository courseReviewRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentAccessService enrollmentAccessService;
    private final AccountService accountService;
    private final StudentRepository studentRepository;

    public CourseReviewService(CourseReviewRepository courseReviewRepository,
                               CourseRepository courseRepository,
                               EnrollmentAccessService enrollmentAccessService,
                               AccountService accountService,
                               StudentRepository studentRepository) {
        this.courseReviewRepository = courseReviewRepository;
        this.courseRepository = courseRepository;
        this.enrollmentAccessService = enrollmentAccessService;
        this.accountService = accountService;
        this.studentRepository = studentRepository;
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
     * Access Control: Student must be enrolled in the course.
     * Business Rule: Student can only review once per course.
     *
     * TODO: Add minimum progress requirement (e.g., >50% completion)
     */
    @Transactional
    @EnableSoftDeleteFilter
    public CourseReviewResponse createNewReview(CourseReviewRequest courseReviewRequest, Long courseId) {
        log.info("Creating review for course: {}", courseId);

        // STEP 1: Verify student is enrolled in the course
        Enrollment enrollment = enrollmentAccessService.verifyCurrentStudentEnrollment(courseId);

        // STEP 2: Get student and course (already validated)
        Student student = enrollment.getStudent();
        Course course = enrollment.getCourse();

        // TODO: Check minimum progress requirement
        // if (enrollment.getCompletionPercentage() != null && enrollment.getCompletionPercentage() < 50.0f) {
        //     throw new InvalidRequestException("Must complete at least 50% of the course before reviewing");
        // }

        // STEP 3: Check if already reviewed
        if(hasReviewed(course, student)){
            throw new DuplicateResourceException("Student already has reviewed this course");
        }

        // STEP 4: Create review
        CourseReview courseReview = CourseReviewMapper.fromRequest(courseReviewRequest);
        courseReview.setStudent(student);
        courseReview.setCourse(course);

        try {
            CourseReview savedReview = courseReviewRepository.save(courseReview);
            log.info("Review created successfully for course {} by student {}", courseId, student.getId());

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
     * Access Control: Student must be enrolled and own the review.
     */
    @Transactional
    @EnableSoftDeleteFilter
    public CourseReviewResponse updateReview(Long courseId, Long reviewId, CourseReviewRequest request) {
        log.info("Updating review {} for course {}", reviewId, courseId);

        // STEP 1: Verify student is enrolled
        Enrollment enrollment = enrollmentAccessService.verifyCurrentStudentEnrollment(courseId);
        Student student = enrollment.getStudent();

        // STEP 2: Verify review exists and belongs to student
        CourseReview review = courseReviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getStudent().getId().equals(student.getId())) {
            throw new InvalidRequestException("Cannot update other student's review");
        }

        // STEP 3: Update review
        review.setRating(request.getRating());
        review.setTitle(request.getTitle());
        review.setContent(request.getContent());

        CourseReview saved = courseReviewRepository.save(review);
        log.info("Review {} updated successfully", reviewId);

        // TODO: Recalculate course average rating
        // courseService.updateAverageRating(course);

        return CourseReviewMapper.toResponse(saved);
    }

    /**
     * Delete a review
     *
     * Access Control: Student must be enrolled and own the review.
     */
    @Transactional
    @EnableSoftDeleteFilter
    public void deleteReview(Long courseId, Long reviewId) {
        log.info("Deleting review {} for course {}", reviewId, courseId);

        // STEP 1: Verify student is enrolled
        Enrollment enrollment = enrollmentAccessService.verifyCurrentStudentEnrollment(courseId);
        Student student = enrollment.getStudent();

        // STEP 2: Verify review exists and belongs to student
        CourseReview review = courseReviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getStudent().getId().equals(student.getId())) {
            throw new InvalidRequestException("Cannot delete other student's review");
        }

        // STEP 3: Delete review
        courseReviewRepository.delete(review);
        log.info("Review {} deleted successfully", reviewId);

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
