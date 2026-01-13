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
import vn.uit.lms.shared.dto.response.certificate.CertificateDetailResponse;
import vn.uit.lms.shared.dto.response.enrollment.EnrollmentDetailResponse;
import vn.uit.lms.shared.dto.response.enrollment.EnrollmentResponse;
import vn.uit.lms.shared.dto.response.enrollment.EnrollmentStatsResponse;
import vn.uit.lms.shared.dto.response.enrollment.FinalExamEligibilityResponse;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.exception.UnauthorizedException;
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
    private final CertificateService certificateService;

    /**
     * Student enrolls in a FREE course
     *
     * Business Logic:
     * - Validates student authentication and course availability
     * - Checks course is FREE (price = 0)
     * - Prevents duplicate enrollments
     * - Creates enrollment with ENROLLED status
     * - Calculates expiry date based on course duration
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
     * - Student can access course content immediately
     *
     * Flow:
     * 1. Authenticate student
     * 2. Validate course and get published version
     * 3. Check course is FREE
     * 4. Check not already enrolled
     * 5. Create enrollment record
     * 6. Start enrollment (set dates)
     * 7. Save to database
     *
     * @param courseId The ID of the course to enroll in
     * @param request  Enrollment request (reserved for future use - e.g., referral
     *                 codes, notes)
     * @return EnrollmentDetailResponse with enrollment details
     * @throws ResourceNotFoundException if student or course not found
     * @throws InvalidRequestException   if course is paid or student already
     *                                   enrolled
     */
    @Transactional
    public EnrollmentDetailResponse enrollCourse(Long courseId, EnrollCourseRequest request) {
        log.info("Processing FREE course enrollment for course: {}", courseId);

        // STEP 1: Validate authenticated student
        Student student = getCurrentAuthenticatedStudent();
        log.debug("Student {} requesting enrollment in course {}", student.getId(), courseId);

        // STEP 2: Validate course for enrollment
        Course course = validateCourseForEnrollment(courseId);
        CourseVersion publishedVersion = getPublishedVersion(course);

        // STEP 3: Check course is FREE
        if (publishedVersion.getPrice() != null && publishedVersion.getPrice().compareTo(BigDecimal.ZERO) > 0) {
            log.warn("Student {} attempted to enroll in PAID course {} without payment",
                    student.getId(), courseId);
            throw new InvalidRequestException(
                    String.format("This is a PAID course (Price: %s). Please use payment flow to enroll.",
                            publishedVersion.getPrice()));
        }

        // STEP 4: Check not already enrolled (prevent duplicate enrollments)
        checkNotAlreadyEnrolled(student.getId(), courseId);

        // STEP 5: Create and start enrollment
        Enrollment enrollment = createAndStartEnrollment(student, course, publishedVersion);

        // Postcondition: Verify enrollment created successfully
        assert enrollment.getId() != null : "Enrollment must have ID after saving";
        assert enrollment.getStatus() == EnrollmentStatus.ENROLLED : "Enrollment must be in ENROLLED status";
        assert enrollment.getStartAt() != null : "Enrollment must have start date";

        log.info("Successfully enrolled student {} in FREE course {}. Enrollment ID: {}, Expires: {}",
                student.getId(), courseId, enrollment.getId(), enrollment.getEndAt());

        // Note: request parameter reserved for future features:
        // - Referral/promo codes
        // - Enrollment notes
        // - Custom settings
        if (request != null) {
            log.debug("Enrollment request received for future feature support");
        }

        return enrollmentMapper.toDetailResponse(enrollment);
    }

    /**
     * Enroll student by ID (CALLED BY PAYMENT SYSTEM AFTER SUCCESSFUL PAYMENT)
     * This method is invoked automatically when a payment transaction is completed
     * successfully.
     *
     * Business Logic:
     * - Creates enrollment for PAID courses after payment verification
     * - Validates student and course version existence
     * - Ensures course version is published
     * - Prevents duplicate enrollments
     * - Sets enrollment start and expiry dates
     *
     * Important: This method assumes payment has been verified by the caller
     * (PaymentService).
     * It should NOT be called directly from controllers without payment
     * verification.
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
     * Flow:
     * 1. Validate student exists
     * 2. Validate course version exists and is published
     * 3. Check not already enrolled
     * 4. Create enrollment with course version
     * 5. Start enrollment (calculate dates)
     * 6. Save to database
     * 7. Return enrollment details
     *
     * Called by:
     * - PaymentService.processPayment() after successful payment
     * - Admin enrollment creation (manual enrollment)
     *
     * @param studentId       The ID of the student to enroll
     * @param courseVersionId The ID of the course version to enroll in
     * @return EnrollmentDetailResponse with enrollment details
     * @throws ResourceNotFoundException if student or course version not found
     * @throws InvalidRequestException   if course version not published or student
     *                                   already enrolled
     */
    @Transactional
    public EnrollmentDetailResponse enrollStudent(Long studentId, Long courseVersionId) {
        log.info("Processing PAID enrollment for student: {} in courseVersion: {}", studentId, courseVersionId);

        // STEP 1: Validate student exists
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        log.debug("Found student: {} - {}", student.getId(), student.getFullName());

        // STEP 2: Validate course version exists and get course
        CourseVersion courseVersion = courseVersionRepository.findById(courseVersionId)
                .orElseThrow(() -> new ResourceNotFoundException("Course version not found: " + courseVersionId));

        Course course = courseVersion.getCourse();
        log.debug("Found course version: {} for course: {} - {}",
                courseVersionId, course.getId(), course.getTitle());

        // STEP 3: Validate course version is published
        if (courseVersion.getStatus() != CourseStatus.PUBLISHED) {
            log.warn("Attempted enrollment in non-published course version: {} (status: {})",
                    courseVersionId, courseVersion.getStatus());
            throw new InvalidRequestException(
                    String.format("Cannot enroll in non-published course version. Current status: %s",
                            courseVersion.getStatus()));
        }

        // STEP 4: Check not already enrolled (prevent duplicate enrollments)
        // This is critical for paid courses to prevent double-charging
        checkNotAlreadyEnrolled(studentId, course.getId());

        // STEP 5: Create and start enrollment
        // This will:
        // - Create enrollment record
        // - Set status to ENROLLED
        // - Calculate start date (now)
        // - Calculate expiry date (start + duration)
        Enrollment enrollment = createAndStartEnrollment(student, course, courseVersion);

        // Postconditions: Verify enrollment created successfully
        assert enrollment.getId() != null : "Enrollment must have ID after saving";
        assert enrollment.getStatus() == EnrollmentStatus.ENROLLED : "Enrollment must be in ENROLLED status";
        assert enrollment.getStartAt() != null : "Enrollment must have start date";
        assert enrollment.getEndAt() != null : "Enrollment must have expiry date";

        log.info("Successfully enrolled student {} in PAID course {} (version {}). " +
                "Enrollment ID: {}, Expires: {}",
                studentId, course.getId(), courseVersionId, enrollment.getId(), enrollment.getEndAt());

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
                enrollmentPage.isLast());
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
                enrollmentPage.isLast());
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

        // Process refund if applicable - implementation pending
        // Refund logic depends on:
        // 1. Course refund policy (e.g., full refund within 7 days)
        // 2. Payment status (must be COMPLETED)
        // 3. Time since enrollment (check against refund window)
        // When Payment and Refund services are available:
        // if (enrollment.isEligibleForRefund()) {
        // Payment payment =
        // paymentRepository.findByEnrollmentId(enrollmentId).orElse(null);
        // if (payment != null && payment.getStatus() == PaymentStatus.COMPLETED) {
        // RefundRequest refundRequest = RefundRequest.builder()
        // .payment(payment)
        // .enrollment(enrollment)
        // .reason(request.getReason())
        // .amount(payment.getAmount())
        // .build();
        // refundService.processRefund(refundRequest);
        // log.info("Initiated refund for enrollment {}", enrollmentId);
        // }
        // }
        log.warn("Refund processing pending - requires Payment and Refund services");

        return enrollmentMapper.toDetailResponse(enrollment);
    }

    /**
     * Kick student from course (Ban)
     *
     * Preconditions:
     * - Enrollment must exist
     * - User must be teacher who owns the course or admin
     * - Cannot kick completed enrollments
     * - Reason must be provided
     *
     * Postconditions:
     * - Enrollment status changed to CANCELLED
     * - Ban reason and timestamp recorded
     * - Student notified of removal
     */
    @Transactional
    public EnrollmentDetailResponse kickStudent(Long enrollmentId, CancelEnrollmentRequest request) {
        log.info("Kicking student from enrollment: {}", enrollmentId);

        // Precondition: Verify enrollment exists
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + enrollmentId));

        // Access Control: Verify teacher owns the course or is admin
        Account currentUser = accountService.verifyCurrentAccount();
        validateTeacherOwnershipForKick(currentUser, enrollment.getCourse());

        // Kick student using domain logic
        try {
            enrollment.kick(request.getReason());
            enrollmentRepository.save(enrollment);
            log.info("Successfully kicked student {} from enrollment {} by user {}",
                    enrollment.getStudent().getId(), enrollmentId, currentUser.getId());
        } catch (IllegalStateException e) {
            throw new InvalidRequestException(e.getMessage());
        }

        // Postcondition: Verify enrollment is cancelled
        assert enrollment.getStatus() == EnrollmentStatus.CANCELLED;
        assert enrollment.getBanReason() != null;

        // Send notification to student - implementation pending
        // When NotificationService is available:
        // notificationService.sendStudentKickedNotification(
        // enrollment.getStudent().getAccount().getId(),
        // enrollment.getCourse().getTitle(),
        // request.getReason()
        // );
        // emailService.sendKickedFromCourseEmail(
        // enrollment.getStudent().getAccount().getEmail(),
        // enrollment.getStudent().getFullName(),
        // enrollment.getCourse().getTitle(),
        // request.getReason()
        // );
        log.warn("Student notification pending - requires NotificationService");

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

            // Trigger automatic certificate issuance - implementation pending
            // When CertificateService integration is available:
            try {
            CertificateDetailResponse certificate =
            certificateService.issueCertificate(enrollmentId);
            log.info("Auto-issued certificate {} for enrollment {}",
            certificate.getId(), enrollmentId);
            } catch (Exception e) {
            log.error("Failed to auto-issue certificate for enrollment {}: {}",
            enrollmentId, e.getMessage());
            // Don't fail the score update if certificate issuance fails
            }
            log.warn("Automatic certificate issuance pending - requires CertificateService integration");
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
     *
     * Triggers certificate generation if student meets requirements
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

        // Trigger certificate generation if eligible - implementation pending
        // When CertificateService integration is available:
        if (enrollment.isEligibleForCertificate() && !enrollment.getCertificateIssued()) {
            try {
                CertificateDetailResponse certificate = certificateService.issueCertificate(enrollmentId);
                log.info("Auto-issued certificate {} for completed enrollment {}",
                        certificate.getId(), enrollmentId);
            } catch (Exception e) {
                log.error("Failed to auto-issue certificate for enrollment {}: {}",
                        enrollmentId, e.getMessage());
                // Certificate can be issued manually later
            }
        } else if (!enrollment.isEligibleForCertificate()) {
            log.info("Enrollment {} completed but not eligible for certificate yet. " +
                    "Progress: {}%, Score: {}",
                    enrollmentId,
                    enrollment.getCompletionPercentage(),
                    enrollment.getAverageScore());
        }
        log.warn("Automatic certificate generation pending - requires CertificateService integration");

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
     * 
     * @throws ResourceNotFoundException if student not found
     */
    private Student getCurrentAuthenticatedStudent() {
        Account currentAccount = accountService.validateCurrentAccountByRole(Role.STUDENT);
        return studentRepository.findByAccount(currentAccount)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
    }

    /**
     * Validate course is available for enrollment
     * 
     * @throws ResourceNotFoundException if course not found
     * @throws InvalidRequestException   if course is closed
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
     * 
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
     * 
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
     * 
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

    /**
     * Validate teacher ownership for kick operation
     *
     * Access Rules:
     * - TEACHER: Can only kick students from their own courses
     * - ADMIN: Can kick students from any course
     *
     * @param currentUser Currently authenticated user
     * @param course      Course to validate ownership for
     * @throws UnauthorizedException if user doesn't have permission
     */
    private void validateTeacherOwnershipForKick(Account currentUser, Course course) {
        Role currentRole = currentUser.getRole();

        // ADMIN can kick from any course
        if (currentRole == Role.ADMIN) {
            return;
        }

        // TEACHER can only kick from their own courses
        if (currentRole == Role.TEACHER) {
            if (course.getTeacher() == null ||
                    !course.getTeacher().getAccount().getId().equals(currentUser.getId())) {
                throw new UnauthorizedException("You can only kick students from your own courses");
            }
            return;
        }

        throw new UnauthorizedException("Only teachers and admins can kick students from courses");
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
