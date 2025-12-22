package vn.uit.lms.service.learning;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.domain.Account;
import vn.uit.lms.core.domain.Student;
import vn.uit.lms.core.domain.course.Course;
import vn.uit.lms.core.domain.course.CourseVersion;
import vn.uit.lms.core.domain.learning.Enrollment;
import vn.uit.lms.core.repository.StudentRepository;
import vn.uit.lms.core.repository.course.CourseRepository;
import vn.uit.lms.core.repository.learning.EnrollmentRepository;
import vn.uit.lms.service.AccountService;
import vn.uit.lms.shared.constant.CourseStatus;
import vn.uit.lms.shared.constant.EnrollmentStatus;
import vn.uit.lms.shared.constant.Role;
import vn.uit.lms.shared.dto.PageResponse;
import vn.uit.lms.shared.dto.request.enrollment.CancelEnrollmentRequest;
import vn.uit.lms.shared.dto.request.enrollment.EnrollCourseRequest;
import vn.uit.lms.shared.dto.response.enrollment.EnrollmentDetailResponse;
import vn.uit.lms.shared.dto.response.enrollment.EnrollmentResponse;
import vn.uit.lms.shared.dto.response.enrollment.EnrollmentStatsResponse;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.EnrollmentMapper;
import vn.uit.lms.shared.util.SecurityUtils;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentMapper enrollmentMapper;
    private final AccountService accountService;

    /**
     * Student enrolls in a course
     * Preconditions:
     * - Student must be authenticated
     * - Course must exist and be published
     * - Course must not be closed
     * - Student must not already be enrolled in this course (active enrollment)
     * - For paid courses: payment must be verified (TODO: integrate with Payment module)
     *
     * Postconditions:
     * - Enrollment record created with ENROLLED status
     * - Student can access course content
     * - Start date and end date calculated based on course duration
     */
    @Transactional
    public EnrollmentDetailResponse enrollCourse(Long courseId, EnrollCourseRequest request) {
        log.info("Processing enrollment for course: {}", courseId);

        // Get authenticated student
        Account currentAccount = accountService.validateCurrentAccountByRole(Role.STUDENT);
        Student student = studentRepository.findByAccount(currentAccount)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Long studentId = student.getId();

        // Get course and validate
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        if (Boolean.TRUE.equals(course.getIsClosed())) {
            throw new InvalidRequestException("Course is closed and not accepting new enrollments");
        }

        // Get published version
        CourseVersion publishedVersion = course.getVersionPublish();
        if (publishedVersion == null || publishedVersion.getStatus() != CourseStatus.PUBLISHED) {
            throw new InvalidRequestException("No published version available for this course");
        }

        // Check if already enrolled
        boolean alreadyEnrolled = enrollmentRepository.existsByStudentIdAndCourseIdAndActiveStatus(studentId, courseId);
        if (alreadyEnrolled) {
            throw new InvalidRequestException("You are already enrolled in this course");
        }

        // TODO: Validate payment for paid courses
        // If course price > 0, must have valid payment transaction
        if (publishedVersion.getPrice() != null && publishedVersion.getPrice().compareTo(BigDecimal.ZERO) > 0) {
            if (request.getPaymentTransactionId() == null) {
                throw new InvalidRequestException("Payment is required for this course");
            }
            // TODO: Verify payment transaction with Payment module
            // PaymentTransaction payment = paymentService.verifyPayment(request.getPaymentTransactionId());
            // if (!payment.isSuccessful()) throw new InvalidRequestException("Payment verification failed");
        }

        // Create enrollment
        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .course(course)
                .courseVersion(publishedVersion)
                .status(EnrollmentStatus.ENROLLED)
                .build();

        // Start enrollment (calculates end date)
        enrollment.start();

        enrollment = enrollmentRepository.save(enrollment);
        log.info("Successfully enrolled student {} in course {}", studentId, courseId);

        return enrollmentMapper.toDetailResponse(enrollment);
    }

    /**
     * Get all enrollments for a student
     */
    public PageResponse<EnrollmentResponse> getStudentEnrollments(Long studentId, Pageable pageable) {
        log.info("Fetching enrollments for student: {}", studentId);

        // Verify student exists
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student not found with id: " + studentId);
        }

        Page<Enrollment> enrollmentPage = enrollmentRepository.findByStudentId(studentId, pageable);
        List<EnrollmentResponse> responses = enrollmentPage.getContent().stream()
                .map(enrollmentMapper::toResponse)
                .toList();

        return new PageResponse<>(
                responses,
                enrollmentPage.getNumber(),
                enrollmentPage.getSize(),
                enrollmentPage.getTotalElements(),
                enrollmentPage.getTotalPages(),
                enrollmentPage.isFirst(),
                enrollmentPage.isLast()
        );
    }

    /**
     * Get all enrollments for a course (Teacher access)
     */
    public PageResponse<EnrollmentResponse> getCourseEnrollments(Long courseId, Pageable pageable) {
        log.info("Fetching enrollments for course: {}", courseId);

        // Verify course exists
        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Course not found with id: " + courseId);
        }

        // TODO: Verify that current user is the teacher of this course
        // Long currentUserId = SecurityUtils.getCurrentUserId().orElse(null);
        // Course course = courseRepository.findById(courseId).orElse(null);
        // if (course != null && !course.getTeacher().getAccount().getId().equals(currentUserId)) {
        //     throw new UnauthorizedException("You are not authorized to view enrollments for this course");
        // }

        Page<Enrollment> enrollmentPage = enrollmentRepository.findByCourseId(courseId, pageable);
        List<EnrollmentResponse> responses = enrollmentPage.getContent().stream()
                .map(enrollmentMapper::toResponse)
                .toList();

        return new PageResponse<>(
                responses,
                enrollmentPage.getNumber(),
                enrollmentPage.getSize(),
                enrollmentPage.getTotalElements(),
                enrollmentPage.getTotalPages(),
                enrollmentPage.isFirst(),
                enrollmentPage.isLast()
        );
    }

    /**
     * Get enrollment details
     */
    public EnrollmentDetailResponse getEnrollmentDetail(Long enrollmentId) {
        log.info("Fetching enrollment detail: {}", enrollmentId);

        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + enrollmentId));

        // TODO: Verify access (student owns enrollment OR teacher owns course)
        // Long currentUserId = SecurityUtils.getCurrentUserId().orElse(null);
        // boolean isStudent = enrollment.getStudent().getAccount().getId().equals(currentUserId);
        // boolean isTeacher = enrollment.getCourse().getTeacher().getAccount().getId().equals(currentUserId);
        // if (!isStudent && !isTeacher) {
        //     throw new UnauthorizedException("You are not authorized to view this enrollment");
        // }

        return enrollmentMapper.toDetailResponse(enrollment);
    }

    /**
     * Cancel enrollment
     * Preconditions:
     * - Enrollment must exist
     * - Student must own the enrollment
     * - Enrollment must not be already completed
     *
     * Postconditions:
     * - Enrollment status changed to CANCELLED
     * - Cancellation reason and timestamp recorded
     * - Student loses access to course content
     * - TODO: Refund processing if applicable
     */
    @Transactional
    public EnrollmentDetailResponse cancelEnrollment(Long enrollmentId, CancelEnrollmentRequest request) {
        log.info("Cancelling enrollment: {}", enrollmentId);

        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + enrollmentId));

        // Verify student owns this enrollment
        Account currentAccount = accountService.validateCurrentAccountByRole(Role.STUDENT);
        Student student = studentRepository.findByAccount(currentAccount)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        if (!enrollment.getStudent().getId().equals(student.getId())) {
            throw new InvalidRequestException("You can only cancel your own enrollments");
        }

        // Use domain method to cancel (includes validation)
        try {
            enrollment.cancel(request.getReason());
            enrollmentRepository.save(enrollment);
            log.info("Successfully cancelled enrollment: {}", enrollmentId);
        } catch (IllegalStateException e) {
            throw new InvalidRequestException(e.getMessage());
        }

        // TODO: Process refund if applicable
        // if (enrollment should be refunded) {
        //     paymentService.processRefund(enrollment);
        // }

        return enrollmentMapper.toDetailResponse(enrollment);
    }

    /**
     * Complete enrollment (Manual completion by teacher or auto by system)
     * Preconditions:
     * - Enrollment must exist
     * - Student must meet completion requirements (progress % and pass score)
     * - Enrollment must not be expired
     *
     * Postconditions:
     * - Enrollment status changed to COMPLETED
     * - Completion timestamp recorded
     * - TODO: Certificate generation triggered
     */
    @Transactional
    public EnrollmentDetailResponse completeEnrollment(Long enrollmentId) {
        log.info("Completing enrollment: {}", enrollmentId);

        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + enrollmentId));

        // TODO: Verify teacher owns the course OR system admin
        // Long currentUserId = SecurityUtils.getCurrentUserId().orElse(null);
        // boolean isTeacher = enrollment.getCourse().getTeacher().getAccount().getId().equals(currentUserId);
        // boolean isAdmin = SecurityUtils.hasRole("ADMIN");
        // if (!isTeacher && !isAdmin) {
        //     throw new UnauthorizedException("Only course teacher or admin can manually complete enrollment");
        // }

        // Use domain method to complete (includes validation)
        try {
            enrollment.complete();
            enrollmentRepository.save(enrollment);
            log.info("Successfully completed enrollment: {}", enrollmentId);
        } catch (IllegalStateException e) {
            throw new InvalidRequestException(e.getMessage());
        }

        // TODO: Trigger certificate generation
        // certificateService.generateCertificate(enrollment);

        return enrollmentMapper.toDetailResponse(enrollment);
    }

    /**
     * Get enrollment statistics for a course
     */
    public EnrollmentStatsResponse getEnrollmentStats(Long courseId) {
        log.info("Fetching enrollment stats for course: {}", courseId);

        // Verify course exists
        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Course not found with id: " + courseId);
        }

        // TODO: Verify teacher owns the course
        // Course course = courseRepository.findById(courseId).get();
        // Long currentUserId = SecurityUtils.getCurrentUserId().orElse(null);
        // if (!course.getTeacher().getAccount().getId().equals(currentUserId)) {
        //     throw new UnauthorizedException("You are not authorized to view stats for this course");
        // }

        Long totalEnrollments = enrollmentRepository.countByCourseId(courseId);
        Long activeEnrollments = enrollmentRepository.countByCourseIdAndStatus(courseId, EnrollmentStatus.ENROLLED);
        Long completedEnrollments = enrollmentRepository.countByCourseIdAndStatus(courseId, EnrollmentStatus.COMPLETED);
        Long cancelledEnrollments = enrollmentRepository.countByCourseIdAndStatus(courseId, EnrollmentStatus.CANCELLED);
        Long expiredEnrollments = enrollmentRepository.countByCourseIdAndStatus(courseId, EnrollmentStatus.EXPIRED);

        Double completionRate = totalEnrollments > 0
                ? (completedEnrollments.doubleValue() / totalEnrollments.doubleValue()) * 100
                : 0.0;

        Double averageCompletionPercentage = enrollmentRepository.getAverageCompletionPercentageByCourseId(courseId);
        Double averageScore = enrollmentRepository.getAverageScoreByCourseId(courseId);
        Long certificatesIssued = enrollmentRepository.countCertificatesIssuedByCourseId(courseId);

        return EnrollmentStatsResponse.builder()
                .totalEnrollments(totalEnrollments)
                .activeEnrollments(activeEnrollments)
                .completedEnrollments(completedEnrollments)
                .cancelledEnrollments(cancelledEnrollments)
                .expiredEnrollments(expiredEnrollments)
                .completionRate(completionRate)
                .averageCompletionPercentage(averageCompletionPercentage != null ? averageCompletionPercentage : 0.0)
                .averageScore(averageScore != null ? averageScore : 0.0)
                .certificatesIssued(certificatesIssued)
                .build();
    }
}



