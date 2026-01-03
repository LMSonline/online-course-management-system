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
    private final vn.uit.lms.core.repository.course.CourseVersionRepository courseVersionRepository;
    private final EnrollmentMapper enrollmentMapper;
    private final AccountService accountService;

    /**
     * Student enrolls in a course
     */
    @Transactional
    public EnrollmentDetailResponse enrollCourse(Long courseId, EnrollCourseRequest request) {
        log.info("Processing enrollment for course: {}", courseId);

        Student student = getCurrentAuthenticatedStudent();
        Course course = validateCourseForEnrollment(courseId);
        CourseVersion publishedVersion = getPublishedVersion(course);

        checkNotAlreadyEnrolled(student.getId(), courseId);
        validatePaymentForPaidCourse(publishedVersion, request);

        Enrollment enrollment = createAndStartEnrollment(student, course, publishedVersion);
        log.info("Successfully enrolled student {} in course {}", student.getId(), courseId);

        return enrollmentMapper.toDetailResponse(enrollment);
    }

    /**
     * Enroll student by ID (used by payment system)
     */
    @Transactional
    public EnrollmentDetailResponse enrollStudent(Long studentId, Long courseVersionId) {
        log.info("Processing enrollment for student: {} in courseVersion: {}", studentId, courseVersionId);

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        CourseVersion courseVersion = courseVersionRepository.findById(courseVersionId)
                .orElseThrow(() -> new ResourceNotFoundException("Course version not found: " + courseVersionId));

        Course course = courseVersion.getCourse();

        checkNotAlreadyEnrolled(studentId, course.getId());

        Enrollment enrollment = createAndStartEnrollment(student, course, courseVersion);
        log.info("Successfully enrolled student {} in course {}", studentId, course.getId());

        return enrollmentMapper.toDetailResponse(enrollment);
    }

    /**
     * Get all enrollments for a student
     */
    public PageResponse<EnrollmentResponse> getStudentEnrollments(Long studentId, Pageable pageable) {
        log.info("Fetching enrollments for student: {}", studentId);

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

        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Course not found with id: " + courseId);
        }

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

        return enrollmentMapper.toDetailResponse(enrollment);
    }

    /**
     * Cancel enrollment
     */
    @Transactional
    public EnrollmentDetailResponse cancelEnrollment(Long enrollmentId, CancelEnrollmentRequest request) {
        log.info("Cancelling enrollment: {}", enrollmentId);

        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + enrollmentId));

        Student student = getCurrentAuthenticatedStudent();
        validateEnrollmentOwnership(enrollment, student);

        try {
            enrollment.cancel(request.getReason());
            enrollmentRepository.save(enrollment);
            log.info("Successfully cancelled enrollment: {}", enrollmentId);
        } catch (IllegalStateException e) {
            throw new InvalidRequestException(e.getMessage());
        }

        // TODO: Process refund if applicable
        return enrollmentMapper.toDetailResponse(enrollment);
    }

    /**
     * Complete enrollment
     */
    @Transactional
    public EnrollmentDetailResponse completeEnrollment(Long enrollmentId) {
        log.info("Completing enrollment: {}", enrollmentId);

        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + enrollmentId));

        try {
            enrollment.complete();
            enrollmentRepository.save(enrollment);
            log.info("Successfully completed enrollment: {}", enrollmentId);
        } catch (IllegalStateException e) {
            throw new InvalidRequestException(e.getMessage());
        }

        // TODO: Trigger certificate generation
        return enrollmentMapper.toDetailResponse(enrollment);
    }

    /**
     * Get enrollment statistics for a course
     */
    public EnrollmentStatsResponse getEnrollmentStats(Long courseId) {
        log.info("Fetching enrollment stats for course: {}", courseId);

        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Course not found with id: " + courseId);
        }

        return calculateEnrollmentStats(courseId);
    }

    /* ==================== HELPER METHODS ==================== */

    private Student getCurrentAuthenticatedStudent() {
        Account currentAccount = accountService.validateCurrentAccountByRole(Role.STUDENT);
        return studentRepository.findByAccount(currentAccount)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
    }

    private Course validateCourseForEnrollment(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        if (Boolean.TRUE.equals(course.getIsClosed())) {
            throw new InvalidRequestException("Course is closed and not accepting new enrollments");
        }

        return course;
    }

    private CourseVersion getPublishedVersion(Course course) {
        CourseVersion publishedVersion = course.getVersionPublish();
        if (publishedVersion == null || publishedVersion.getStatus() != CourseStatus.PUBLISHED) {
            throw new InvalidRequestException("No published version available for this course");
        }
        return publishedVersion;
    }

    private void checkNotAlreadyEnrolled(Long studentId, Long courseId) {
        boolean alreadyEnrolled = enrollmentRepository.existsByStudentIdAndCourseIdAndActiveStatus(studentId, courseId);
        if (alreadyEnrolled) {
            throw new InvalidRequestException("You are already enrolled in this course");
        }
    }

    private void validatePaymentForPaidCourse(CourseVersion courseVersion, EnrollCourseRequest request) {
        if (courseVersion.getPrice() != null && courseVersion.getPrice().compareTo(BigDecimal.ZERO) > 0) {
            if (request.getPaymentTransactionId() == null) {
                throw new InvalidRequestException("Payment is required for this course");
            }
            // TODO: Verify payment transaction with Payment module
        }
    }

    private Enrollment createAndStartEnrollment(Student student, Course course, CourseVersion courseVersion) {
        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .course(course)
                .courseVersion(courseVersion)
                .status(EnrollmentStatus.ENROLLED)
                .build();

        enrollment.start();
        return enrollmentRepository.save(enrollment);
    }

    private void validateEnrollmentOwnership(Enrollment enrollment, Student student) {
        if (!enrollment.getStudent().getId().equals(student.getId())) {
            throw new InvalidRequestException("You can only cancel your own enrollments");
        }
    }

    private EnrollmentStatsResponse calculateEnrollmentStats(Long courseId) {
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

