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
import vn.uit.lms.core.repository.course.CourseVersionRepository;
import vn.uit.lms.core.repository.learning.EnrollmentRepository;
import vn.uit.lms.service.AccountService;
import vn.uit.lms.shared.constant.CourseStatus;
import vn.uit.lms.shared.constant.EnrollmentStatus;
import vn.uit.lms.shared.constant.Role;
import vn.uit.lms.shared.dto.PageResponse;
import vn.uit.lms.shared.dto.request.enrollment.CancelEnrollmentRequest;
import vn.uit.lms.shared.dto.request.enrollment.EnrollCourseRequest;
import vn.uit.lms.shared.dto.request.enrollment.UpdateScoreRequest;
import vn.uit.lms.shared.dto.response.enrollment.EnrollmentDetailResponse;
import vn.uit.lms.shared.dto.response.enrollment.EnrollmentResponse;
import vn.uit.lms.shared.dto.response.enrollment.EnrollmentStatsResponse;
import vn.uit.lms.shared.dto.response.enrollment.FinalExamEligibilityResponse;
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
    private final CourseVersionRepository courseVersionRepository;
    private final EnrollmentMapper enrollmentMapper;
    private final AccountService accountService;

    /**
     * Student enrolls in a FREE course
     *
     * Preconditions:
     * - Student must be authenticated
     * - Course must exist and be open for enrollment
     * - Course must have published version
     * - Course must be FREE (price = 0)
     * - Student must NOT be already enrolled in this course
     *
     * Postconditions:
     * - Enrollment created with ENROLLED status
     * - Enrollment start date set to current time
     * - Enrollment expiry date calculated based on course duration
     * - Student can access course content
     */
    @Transactional
    public EnrollmentDetailResponse enrollCourse(Long courseId, EnrollCourseRequest request) {
        log.info("Processing FREE course enrollment for course: {}", courseId);

        // Precondition: Validate authenticated student
        Student student = getCurrentAuthenticatedStudent();

        // Precondition: Validate course for enrollment
        Course course = validateCourseForEnrollment(courseId);
        CourseVersion publishedVersion = getPublishedVersion(course);

        // Precondition: Check course is FREE
        if (publishedVersion.getPrice() != null && publishedVersion.getPrice().compareTo(BigDecimal.ZERO) > 0) {
            throw new InvalidRequestException("This is a PAID course. Please use payment flow to enroll.");
        }

        // Precondition: Check not already enrolled
        checkNotAlreadyEnrolled(student.getId(), courseId);

        // Create and start enrollment
        Enrollment enrollment = createAndStartEnrollment(student, course, publishedVersion);

        // Postcondition: Verify enrollment created successfully
        assert enrollment.getId() != null : "Enrollment must have ID after saving";
        assert enrollment.getStatus() == EnrollmentStatus.ENROLLED : "Enrollment must be in ENROLLED status";
        assert enrollment.getStartAt() != null : "Enrollment must have start date";

        log.info("Successfully enrolled student {} in FREE course {}", student.getId(), courseId);

        return enrollmentMapper.toDetailResponse(enrollment);
    }

    /**
     * Enroll student by ID (CALLED BY PAYMENT SYSTEM AFTER SUCCESSFUL PAYMENT)
     * This method is invoked automatically when a payment transaction is completed successfully.
     *
     * Preconditions:
     * - Student must exist in system
     * - CourseVersion must exist and be the published version
     * - Student must NOT be already enrolled in this course
     * - Payment must have been verified successfully (caller's responsibility)
     *
     * Postconditions:
     * - Enrollment created with ENROLLED status
     * - Enrollment start date set to current time
     * - Enrollment expiry date calculated based on course duration
     * - Student can access course content immediately
     * - Enrollment is persisted to database
     *
     * @param studentId The ID of the student to enroll
     * @param courseVersionId The ID of the course version to enroll in
     * @return EnrollmentDetailResponse with enrollment details
     * @throws ResourceNotFoundException if student or course version not found
     * @throws InvalidRequestException if student already enrolled
     */
    @Transactional
    public EnrollmentDetailResponse enrollStudent(Long studentId, Long courseVersionId) {
        log.info("Processing PAID enrollment for student: {} in courseVersion: {}", studentId, courseVersionId);

        // Precondition: Validate student exists
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        // Precondition: Validate course version exists
        CourseVersion courseVersion = courseVersionRepository.findById(courseVersionId)
                .orElseThrow(() -> new ResourceNotFoundException("Course version not found: " + courseVersionId));

        Course course = courseVersion.getCourse();

        // Precondition: Validate course version is published
        if (courseVersion.getStatus() != CourseStatus.PUBLISHED) {
            throw new InvalidRequestException("Cannot enroll in non-published course version");
        }

        // Precondition: Check not already enrolled (prevent duplicate enrollments)
        checkNotAlreadyEnrolled(studentId, course.getId());

        // Create and start enrollment
        Enrollment enrollment = createAndStartEnrollment(student, course, courseVersion);

        // Postcondition: Verify enrollment created successfully
        assert enrollment.getId() != null : "Enrollment must have ID after saving";
        assert enrollment.getStatus() == EnrollmentStatus.ENROLLED : "Enrollment must be in ENROLLED status";
        assert enrollment.getStartAt() != null : "Enrollment must have start date";
        assert enrollment.getEndAt() != null : "Enrollment must have expiry date";

        log.info("Successfully enrolled student {} in PAID course {} (version {})",
                studentId, course.getId(), courseVersionId);

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
     * Kick student from course (Ban)
     *
     * Preconditions:
     * - Enrollment must exist
     * - User must be teacher/admin
     * - Cannot kick completed enrollments
     * - Reason must be provided
     *
     * Postconditions:
     * - Enrollment status changed to CANCELLED
     * - Ban reason and timestamp recorded
     */
    @Transactional
    public EnrollmentDetailResponse kickStudent(Long enrollmentId, CancelEnrollmentRequest request) {
        log.info("Kicking student from enrollment: {}", enrollmentId);

        // Precondition: Verify enrollment exists
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + enrollmentId));

        // TODO: Verify teacher owns the course
        // Account currentUser = accountService.verifyCurrentAccount();
        // validateTeacherOwnership(enrollment.getCourse(), currentUser);

        // Kick student using domain logic
        try {
            enrollment.kick(request.getReason());
            enrollmentRepository.save(enrollment);
            log.info("Successfully kicked student from enrollment: {}", enrollmentId);
        } catch (IllegalStateException e) {
            throw new InvalidRequestException(e.getMessage());
        }

        // Postcondition: Verify enrollment is cancelled
        assert enrollment.getStatus() == EnrollmentStatus.CANCELLED;
        assert enrollment.getBanReason() != null;

        // TODO: Send notification to student
        return enrollmentMapper.toDetailResponse(enrollment);
    }



    /**
     * Update score after quiz/exam completion
     *
     * Preconditions:
     * - Enrollment must exist and be active
     * - Score must be 0-10
     * - Quiz ID must be provided
     *
     * Postconditions:
     * - Quiz score added to enrollment
     * - Average score recalculated using formula
     * - May trigger enrollment completion if requirements met
     */
    @Transactional
    public EnrollmentDetailResponse updateScore(Long enrollmentId, UpdateScoreRequest request) {
        log.info("Updating score for enrollment {}: quiz={}, score={}, isFinal={}",
                enrollmentId, request.getQuizId(), request.getScore(), request.getIsFinalExam());

        // Precondition: Verify enrollment exists and is active
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + enrollmentId));

        if (!enrollment.isActive()) {
            throw new InvalidRequestException("Cannot update score for inactive enrollment");
        }

        // Add quiz score using domain logic
        boolean isFinalExam = Boolean.TRUE.equals(request.getIsFinalExam());

        try {
            enrollment.addQuizScore(request.getQuizId(), request.getScore(), isFinalExam);
            enrollment = enrollmentRepository.save(enrollment);

            log.info("Updated enrollment {} with new score. Average: {}",
                    enrollmentId, enrollment.getAverageScore());
        } catch (IllegalArgumentException e) {
            throw new InvalidRequestException(e.getMessage());
        }

        // Postcondition: Verify score was added
        assert enrollment.getQuizScores() != null && !enrollment.getQuizScores().isEmpty();

        // Check if eligible for certificate after score update
        if (enrollment.getStatus() == EnrollmentStatus.COMPLETED &&
            enrollment.isEligibleForCertificate() &&
            !enrollment.getCertificateIssued()) {
            log.info("Enrollment {} is eligible for certificate after score update", enrollmentId);
            // TODO: Trigger certificate issuance
        }

        return enrollmentMapper.toDetailResponse(enrollment);
    }

    /**
     * Check if student is eligible to take final exam
     *
     * Preconditions:
     * - Enrollment must exist
     *
     * Returns:
     * - Eligibility status with reason
     * - Current progress percentage
     * - Required progress percentage
     */
    public FinalExamEligibilityResponse checkFinalExamEligibility(Long enrollmentId) {
        log.info("Checking final exam eligibility for enrollment: {}", enrollmentId);

        // Precondition: Verify enrollment exists
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + enrollmentId));

        boolean isEligible = enrollment.canTakeFinalExam();
        Float currentProgress = enrollment.getCompletionPercentage();

        CourseVersion courseVersion = enrollment.getCourseVersion();
        Float requiredProgress = courseVersion != null && courseVersion.getMinProgressPct() != null
                ? courseVersion.getMinProgressPct().floatValue()
                : null;

        // Calculate lesson counts
        int totalLessons = 0;
        int completedLessons = 0;

        if (courseVersion != null && courseVersion.getChapters() != null) {
            totalLessons = courseVersion.getChapters().stream()
                    .mapToInt(chapter -> chapter.getLessons() != null ? chapter.getLessons().size() : 0)
                    .sum();

            if (currentProgress != null && totalLessons > 0) {
                completedLessons = Math.round((currentProgress / 100f) * totalLessons);
            }
        }

        String reason;
        if (isEligible) {
            reason = "Student has completed required progress and is eligible for final exam";
        } else if (requiredProgress != null && currentProgress != null) {
            reason = String.format("Student needs to complete %.0f%% of course content. Current: %.1f%%",
                    requiredProgress, currentProgress);
        } else {
            reason = "Progress information not available";
        }

        return FinalExamEligibilityResponse.builder()
                .enrollmentId(enrollmentId)
                .isEligible(isEligible)
                .reason(reason)
                .currentProgress(currentProgress)
                .requiredProgress(requiredProgress)
                .completedLessons(completedLessons)
                .totalLessons(totalLessons)
                .build();




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

    /**
     * Get currently authenticated student
     * @throws ResourceNotFoundException if student not found
     */
    private Student getCurrentAuthenticatedStudent() {
        Account currentAccount = accountService.validateCurrentAccountByRole(Role.STUDENT);
        return studentRepository.findByAccount(currentAccount)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
    }

    /**
     * Validate course is available for enrollment
     * @throws ResourceNotFoundException if course not found
     * @throws InvalidRequestException if course is closed
     */
    private Course validateCourseForEnrollment(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        if (Boolean.TRUE.equals(course.getIsClosed())) {
            throw new InvalidRequestException("Course is closed and not accepting new enrollments");
        }

        return course;
    }

    /**
     * Get published version of course
     * @throws InvalidRequestException if no published version exists
     */
    private CourseVersion getPublishedVersion(Course course) {
        CourseVersion publishedVersion = course.getVersionPublish();
        if (publishedVersion == null || publishedVersion.getStatus() != CourseStatus.PUBLISHED) {
            throw new InvalidRequestException("No published version available for this course");
        }
        return publishedVersion;
    }

    /**
     * Check if student is already enrolled in course
     * Checks for active enrollments (ENROLLED status)
     * @throws InvalidRequestException if already enrolled
     */
    private void checkNotAlreadyEnrolled(Long studentId, Long courseId) {
        boolean alreadyEnrolled = enrollmentRepository.existsByStudentIdAndCourseIdAndActiveStatus(studentId, courseId);
        if (alreadyEnrolled) {
            throw new InvalidRequestException("You are already enrolled in this course");
        }
    }

    /**
     * Create and start enrollment
     * Sets status to ENROLLED and calculates expiry date
     * @return Saved enrollment entity
     */
    private Enrollment createAndStartEnrollment(Student student, Course course, CourseVersion courseVersion) {
        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .course(course)
                .courseVersion(courseVersion)
                .status(EnrollmentStatus.ENROLLED)
                .build();

        // Start enrollment - sets start date and calculates expiry date
        enrollment.start();

        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);
        log.debug("Created enrollment {} for student {} in course {}",
                 savedEnrollment.getId(), student.getId(), course.getId());

        return savedEnrollment;
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

