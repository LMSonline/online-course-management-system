package vn.uit.lms.service.learning;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.domain.Account;
import vn.uit.lms.core.domain.Student;
import vn.uit.lms.core.domain.course.Course;
import vn.uit.lms.core.domain.course.CourseVersion;
import vn.uit.lms.core.domain.learning.Certificate;
import vn.uit.lms.core.domain.learning.Enrollment;
import vn.uit.lms.core.repository.StudentRepository;
import vn.uit.lms.core.repository.course.CourseRepository;
import vn.uit.lms.core.repository.learning.CertificateRepository;
import vn.uit.lms.core.repository.learning.EnrollmentRepository;
import vn.uit.lms.service.AccountService;
import vn.uit.lms.shared.constant.EnrollmentStatus;
import vn.uit.lms.shared.constant.Role;
import vn.uit.lms.shared.dto.response.certificate.CertificateDetailResponse;
import vn.uit.lms.shared.dto.response.certificate.CertificateResponse;
import vn.uit.lms.shared.dto.response.certificate.CertificateVerificationResponse;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.exception.UnauthorizedException;
import vn.uit.lms.shared.mapper.CertificateMapper;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Certificate Service
 * Handles certificate issuance, verification, and management
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final CertificateMapper certificateMapper;
    private final AccountService accountService;

    private static final String CERTIFICATE_BASE_URL = "https://lms.example.com/certificates/";

    /**
     * Get all certificates for a student
     *
     * Access Control:
     * - STUDENT: Can only view their own certificates
     * - TEACHER: Can view certificates for students in their courses
     * - ADMIN: Can view any student's certificates
     *
     * Preconditions:
     * - Student must exist
     * - Current user must have permission to view student's certificates
     */
    public List<CertificateResponse> getStudentCertificates(Long studentId) {
        log.info("Fetching certificates for student: {}", studentId);

        // Precondition: Verify student exists
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        // Access Control: Verify permission to view certificates
        Account currentUser = accountService.verifyCurrentAccount();
        validateCertificateAccessForStudent(currentUser, student);

        List<Certificate> certificates = certificateRepository.findByStudentIdOrderByIssuedAtDesc(studentId);

        log.info("Found {} certificates for student {}", certificates.size(), studentId);
        return certificates.stream()
                .map(certificateMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get certificate by ID
     */
    public CertificateDetailResponse getCertificateById(Long certificateId) {
        log.info("Fetching certificate: {}", certificateId);

        Certificate certificate = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found with id: " + certificateId));

        return certificateMapper.toDetailResponse(certificate);
    }

    /**
     * Verify certificate by code (Public endpoint)
     *
     * Preconditions:
     * - Certificate code must exist
     *
     * Returns:
     * - Certificate verification details
     * - Includes revocation status and expiry
     */
    public CertificateVerificationResponse verifyCertificate(String code) {
        log.info("Verifying certificate with code: {}", code);

        Certificate certificate = certificateRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found with code: " + code));

        boolean isValid = certificate.isValid();
        String status = determineVerificationStatus(certificate);

        return CertificateVerificationResponse.builder()
                .code(certificate.getCode())
                .studentName(certificate.getStudent().getFullName())
                .courseName(certificate.getCourse().getTitle())
                .issuedAt(certificate.getIssuedAt())
                .expiresAt(certificate.getExpiresAt())
                .isValid(isValid)
                .status(status)
                .finalScore(certificate.getFinalScore())
                .grade(certificate.getGrade())
                .isRevoked(certificate.getIsRevoked())
                .revokeReason(certificate.getRevokeReason())
                .build();
    }

    /**
     * Download certificate as PDF
     *
     * Preconditions:
     * - Certificate must exist
     * - Certificate must not be revoked
     * - User must have permission to download:
     *   * Student: Only their own certificates
     *   * Teacher: Certificates from their courses
     *   * Admin: Any certificate
     *
     * Returns:
     * - PDF file as byte array
     *
     * Implementation Plan for PDF Generation:
     * 1. Use iText 7 or Apache PDFBox library
     * 2. Load certificate template from resources
     * 3. Fill in dynamic fields:
     *    - Student name
     *    - Course title
     *    - Certificate code (with QR code)
     *    - Issue date
     *    - Grade and score
     *    - Teacher signature (digital)
     * 4. Add QR code for verification
     * 5. Add watermark/security features
     * 6. Cache generated PDFs in cloud storage
     */
    public byte[] downloadCertificate(Long certificateId) {
        log.info("Downloading certificate: {}", certificateId);

        Certificate certificate = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found with id: " + certificateId));

        // Precondition: Certificate must not be revoked
        if (certificate.getIsRevoked()) {
            throw new InvalidRequestException("Cannot download revoked certificate");
        }

        // Access Control: Verify ownership or authorization
        Account currentUser = accountService.verifyCurrentAccount();
        validateCertificateDownloadAccess(currentUser, certificate);

        // Generate PDF certificate
        // Implementation pending - requires PDF generation library
        // When PDF library is available:
        // byte[] pdfBytes = generateCertificatePdf(certificate);
        // Store PDF in cloud storage for caching
        // certificateFileService.storePdf(certificateId, pdfBytes);
        // return pdfBytes;

        log.warn("Certificate PDF generation not implemented yet - returning mock data");
        return generateMockCertificatePdf(certificate);
    }

    /**
     * Get all certificates for a course (Teacher/Admin access)
     *
     * Access Control:
     * - TEACHER: Can only view certificates for their own courses
     * - ADMIN: Can view certificates for any course
     *
     * Preconditions:
     * - Course must exist
     * - User must have permission to view course certificates
     */
    public List<CertificateResponse> getCourseCertificates(Long courseId) {
        log.info("Fetching certificates for course: {}", courseId);

        // Precondition: Verify course exists
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        // Access Control: Verify teacher owns the course or is admin
        Account currentUser = accountService.verifyCurrentAccount();
        validateCourseAccessForTeacher(currentUser, course);

        List<Certificate> certificates = certificateRepository.findByCourseIdOrderByIssuedAtDesc(courseId);

        log.info("Found {} certificates for course {}", certificates.size(), courseId);
        return certificates.stream()
                .map(certificateMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Issue certificate for a completed enrollment
     *
     * Business Logic:
     * - Validates enrollment completion and eligibility
     * - Calculates final grade based on score
     * - Generates unique certificate code
     * - Creates certificate record with metadata
     * - Marks enrollment as certificate issued
     * - Triggers notification to student (pending implementation)
     * - Generates PDF certificate file (pending implementation)
     *
     * Eligibility Formula:
     * DTB = (Σ DKTBT_i + DKTCK × k) / (n + k)
     * Where:
     * - DKTBT_i: Score of regular quiz i (0-10)
     * - DKTCK: Final exam score (0-10)
     * - k: Final exam weight (0.5 ≤ k ≤ 1, default 0.6)
     * - n: Number of regular quizzes
     *
     * Eligibility Requirements:
     * 1. Completion: completionPercentage >= minProgressPct (typically 80%)
     * 2. Score: averageScore >= passScore (typically 8.0)
     * 3. Time: Not expired (within course duration)
     * 4. Status: Enrollment status = COMPLETED
     *
     * Preconditions:
     * - Enrollment must exist and be COMPLETED
     * - Enrollment must not have expired
     * - Certificate must not have been issued already
     * - Student must meet ALL eligibility requirements
     *
     * Postconditions:
     * - Certificate created with unique code (UUID-based)
     * - Certificate file URL generated
     * - Grade calculated based on final score
     * - Enrollment marked with certificate issued flag
     * - Certificate metadata includes all score details
     *
     * Example Scenario:
     * Course: "Lập trình C# cơ bản"
     * - Total lessons: 26 (Chapter 1: 10, Chapter 2: 8, Chapter 3: 8)
     * - Duration: 60 days
     * - Regular quizzes: 7 (scores: 8, 9, 8.5, 9, 8, 8.5, 9)
     * - Final exam: 1 (score: 9.5, weight k = 0.6)
     * - Calculation: DTB = (8+9+8.5+9+8+8.5+9 + 9.5×0.6) / (7 + 0.6) = 8.65
     * - Result: PASS (>= 8.0) → Certificate issued with grade GOOD
     *
     * Grade Mapping:
     * - EXCELLENT: score >= 9.0
     * - GOOD: 8.0 <= score < 9.0
     * - AVERAGE: 7.0 <= score < 8.0
     * - PASS: passScore <= score < 7.0
     *
     * Flow:
     * 1. Validate enrollment exists
     * 2. Check enrollment status = COMPLETED
     * 3. Check not expired
     * 4. Check certificate not already issued
     * 5. Validate eligibility (progress + score)
     * 6. Create certificate with metadata
     * 7. Calculate grade
     * 8. Save certificate
     * 9. Mark enrollment as certificate issued
     * 10. Send notification (pending)
     * 11. Generate PDF (pending)
     *
     * @param enrollmentId The ID of the enrollment to issue certificate for
     * @return CertificateDetailResponse with certificate details
     * @throws ResourceNotFoundException if enrollment not found
     * @throws InvalidRequestException if enrollment not eligible for certificate
     */
    @Transactional
    public CertificateDetailResponse issueCertificate(Long enrollmentId) {
        log.info("Issuing certificate for enrollment: {}", enrollmentId);

        // STEP 1: Validate enrollment exists
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + enrollmentId));

        log.debug("Processing certificate for enrollment {}: student={}, course={}, status={}",
                enrollmentId, enrollment.getStudent().getId(),
                enrollment.getCourse().getTitle(), enrollment.getStatus());

        // STEP 2: Validate enrollment status = COMPLETED
        if (enrollment.getStatus() != EnrollmentStatus.COMPLETED) {
            log.warn("Cannot issue certificate for enrollment {} - status is {} (must be COMPLETED)",
                    enrollmentId, enrollment.getStatus());
            throw new InvalidRequestException(
                    String.format("Certificate can only be issued for completed enrollments. " +
                            "Current status: %s. Please complete the course first.",
                            enrollment.getStatus()));
        }

        // STEP 3: Check enrollment not expired
        if (enrollment.isExpired()) {
            log.warn("Cannot issue certificate for expired enrollment {}. Expiry: {}",
                    enrollmentId, enrollment.getEndAt());
            throw new InvalidRequestException(
                    "Cannot issue certificate for expired enrollment. " +
                    "Course duration exceeded. Please contact support for assistance.");
        }

        // STEP 4: Check certificate not already issued (prevent duplicates)
        if (enrollment.getCertificateIssued()) {
            log.warn("Certificate already issued for enrollment {}", enrollmentId);
            throw new InvalidRequestException(
                    "Certificate has already been issued for this enrollment. " +
                    "Check your certificates list.");
        }

        // STEP 5: Validate eligibility using domain logic
        // This checks:
        // - Progress >= minProgressPct (e.g., 80%)
        // - Average score >= passScore (e.g., 8.0)
        // - All required quizzes completed
        if (!enrollment.isEligibleForCertificate()) {
            CourseVersion courseVersion = enrollment.getCourseVersion();
            Float passScore = courseVersion != null ? courseVersion.getPassScore() : null;
            Float currentScore = enrollment.getAverageScore();
            Float completionPct = enrollment.getCompletionPercentage();
            Integer minProgressPct = courseVersion != null ? courseVersion.getMinProgressPct() : null;

            log.warn("Student not eligible for certificate. " +
                    "Completion: {}% (required: {}%), Score: {} (required: {})",
                    completionPct, minProgressPct, currentScore, passScore);

            throw new InvalidRequestException(
                    String.format("Student does not meet certificate requirements. " +
                            "Required - Progress: %d%%, Score: %.1f | " +
                            "Current - Progress: %.1f%%, Score: %.1f",
                            minProgressPct != null ? minProgressPct : 0,
                            passScore != null ? passScore : 0f,
                            completionPct != null ? completionPct : 0f,
                            currentScore != null ? currentScore : 0f)
            );
        }

        // STEP 6: Extract enrollment details
        Student student = enrollment.getStudent();
        Course course = enrollment.getCourse();
        CourseVersion courseVersion = enrollment.getCourseVersion();

        log.debug("Creating certificate for student {} in course {}",
                student.getFullName(), course.getTitle());

        // STEP 7: Create certificate entity
        // Certificate code will be auto-generated by domain entity (UUID-based)
        // Format: CERT-{UUID} e.g., CERT-a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6
        Certificate certificate = Certificate.builder()
                .student(student)
                .course(course)
                .courseVersion(courseVersion)
                .issuedAt(Instant.now())
                .finalScore(enrollment.getAverageScore())
                .fileUrl(generateCertificateUrl(student.getId(), course.getId()))
                .build();

        // STEP 8: Calculate grade based on final score
        // Grade mapping (configurable per course):
        // - EXCELLENT: score >= 9.0
        // - GOOD: 8.0 <= score < 9.0
        // - AVERAGE: 7.0 <= score < 8.0
        // - PASS: passScore <= score < 7.0
        Float passScore = courseVersion.getPassScore();
        if (passScore != null) {
            certificate.calculateGrade(passScore);
            log.debug("Calculated grade for certificate: {} (score: {})",
                    certificate.getGrade(), certificate.getFinalScore());
        } else {
            log.warn("No pass score configured for course version {}, grade will be null",
                    courseVersion.getId());
        }

        // STEP 9: Add comprehensive metadata for audit trail and verification
        // This metadata is used for:
        // - Audit trail (who, when, how)
        // - Certificate verification
        // - Score calculation transparency
        // - Historical record
        certificate.addMetadata("enrollmentId", enrollmentId);
        certificate.addMetadata("completedAt", enrollment.getCompletedAt().toString());
        certificate.addMetadata("completionPercentage", enrollment.getCompletionPercentage());
        certificate.addMetadata("quizScores", enrollment.getQuizScores());
        certificate.addMetadata("finalExamScore", enrollment.getFinalExamScore());
        certificate.addMetadata("finalExamWeight", enrollment.getFinalExamWeight());
        certificate.addMetadata("formulaUsed", "DTB = (Σ DKTBT_i + DKTCK × k) / (n + k)");
        certificate.addMetadata("courseTitle", course.getTitle());
        certificate.addMetadata("courseVersionNumber", courseVersion.getVersionNumber());
        certificate.addMetadata("studentCode", student.getStudentCode());
        certificate.addMetadata("issuedBy", "SYSTEM"); // or admin username if manually issued

        log.debug("Added certificate metadata: quizzes={}, finalExam={}, weight={}",
                enrollment.getQuizScores() != null ? enrollment.getQuizScores().size() : 0,
                enrollment.getFinalExamScore(), enrollment.getFinalExamWeight());

        // STEP 10: Save certificate to database
        certificate = certificateRepository.save(certificate);

        // STEP 11: Update enrollment with certificate issued flag
        // This prevents duplicate certificate issuance
        try {
            enrollment.issueCertificate(certificate);
            enrollmentRepository.save(enrollment);
            log.debug("Marked enrollment {} as certificate issued", enrollmentId);
        } catch (IllegalStateException e) {
            // Domain logic validation failed
            log.error("Failed to mark enrollment as certificate issued: {}", e.getMessage());
            throw new InvalidRequestException(e.getMessage());
        }

        // Postconditions: Verify certificate created successfully
        assert certificate.getId() != null : "Certificate must have ID after saving";
        assert certificate.getCode() != null : "Certificate must have code after saving";
        assert enrollment.getCertificateIssued() : "Enrollment must be marked with certificate issued";

        log.info("Successfully issued certificate {} for enrollment {}. Score: {}, Grade: {}",
                certificate.getId(), enrollmentId, certificate.getFinalScore(), certificate.getGrade());

        // Send notification to student - implementation pending
        // When NotificationService is available:
        // notificationService.sendCertificateIssuedNotification(
        //     student.getAccount().getId(),
        //     certificate.getId(),
        //     course.getTitle()
        // );
        // emailService.sendCertificateIssuedEmail(
        //     student.getAccount().getEmail(),
        //     student.getFullName(),
        //     course.getTitle(),
        //     certificate.getCode(),
        //     generateCertificateViewUrl(certificate.getId())
        // );

        // Generate and store PDF certificate file - implementation pending
        // When PDF generation service is available:
        // byte[] pdfBytes = certificatePdfService.generatePdf(certificate);
        // String pdfUrl = fileStorageService.uploadCertificatePdf(
        //     certificate.getId(),
        //     pdfBytes,
        //     String.format("certificate_%s_%s.pdf", student.getStudentCode(), course.getId())
        // );
        // certificate.setFileUrl(pdfUrl);
        // certificateRepository.save(certificate);

        log.warn("Certificate notification and PDF generation pending - requires NotificationService and PDF library");

        return certificateMapper.toDetailResponse(certificate);
    }

    /**
     * Revoke certificate (Admin only)
     *
     * Preconditions:
     * - Certificate must exist
     * - Certificate must not be already revoked
     *
     * Postconditions:
     * - Certificate marked as revoked
     * - Revoke reason and timestamp recorded
     */
    @Transactional
    public CertificateDetailResponse revokeCertificate(Long certificateId, String reason) {
        log.info("Revoking certificate: {}", certificateId);

        Certificate certificate = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found with id: " + certificateId));

        Account currentUser = accountService.verifyCurrentAccount();

        try {
            certificate.revoke(reason, currentUser.getUsername());
            certificateRepository.save(certificate);

            log.info("Certificate {} revoked by {}", certificateId, currentUser.getUsername());
        } catch (IllegalStateException e) {
            throw new InvalidRequestException(e.getMessage());
        }

        return certificateMapper.toDetailResponse(certificate);
    }

    /* ==================== HELPER METHODS ==================== */

    /**
     * Determine verification status for display
     */
    private String determineVerificationStatus(Certificate certificate) {
        if (certificate.getIsRevoked()) {
            return "REVOKED";
        }
        if (certificate.getExpiresAt() != null && Instant.now().isAfter(certificate.getExpiresAt())) {
            return "EXPIRED";
        }
        return "VALID";
    }

    /**
     * Generate certificate URL
     */
    private String generateCertificateUrl(Long studentId, Long courseId) {
        return CERTIFICATE_BASE_URL + studentId + "/" + courseId + "/certificate.pdf";
    }

    /**
     * Generate mock certificate PDF (placeholder)
     * TODO: Implement actual PDF generation using library like iText or PDFBox
     */
    private byte[] generateMockCertificatePdf(Certificate certificate) {
        String content = String.format(
                "CERTIFICATE OF COMPLETION\n\n" +
                "This certifies that\n%s\n\n" +
                "has successfully completed\n%s\n\n" +
                "Certificate Code: %s\n" +
                "Issued: %s\n" +
                "Grade: %s\n" +
                "Score: %.2f",
                certificate.getStudent().getFullName(),
                certificate.getCourse().getTitle(),
                certificate.getCode(),
                certificate.getIssuedAt(),
                certificate.getGrade(),
                certificate.getFinalScore()
        );

        return content.getBytes();
    }

    /**
     * Validate certificate access for student
     *
     * Access Rules:
     * - STUDENT: Can only view their own certificates
     * - TEACHER: Can view certificates for students enrolled in their courses (future implementation)
     * - ADMIN: Can view any certificates
     */
    private void validateCertificateAccessForStudent(Account currentUser, Student targetStudent) {
        Role currentRole = currentUser.getRole();

        // ADMIN can access any certificates
        if (currentRole == Role.ADMIN) {
            return;
        }

        // STUDENT can only access their own certificates
        if (currentRole == Role.STUDENT) {
            Student currentStudent = studentRepository.findByAccount(currentUser)
                    .orElseThrow(() -> new ResourceNotFoundException("Current student not found"));

            if (!currentStudent.getId().equals(targetStudent.getId())) {
                throw new UnauthorizedException("You can only view your own certificates");
            }
            return;
        }

        // TEACHER can view certificates for students in their courses
        // Future implementation: Check if teacher owns any course the student is enrolled in
        if (currentRole == Role.TEACHER) {
            log.debug("Teacher access to student certificates - enrollment check pending");
            // When enrollment check is implemented:
            // boolean hasEnrollment = enrollmentRepository
            //     .existsStudentInTeacherCourse(targetStudent.getId(), currentUser.getId());
            // if (!hasEnrollment) {
            //     throw new UnauthorizedException("You can only view certificates for students in your courses");
            // }
            return;
        }

        throw new UnauthorizedException("Access denied to view certificates");
    }

    /**
     * Validate certificate download access
     *
     * Access Rules:
     * - STUDENT: Can only download their own certificates
     * - TEACHER: Can download certificates from their courses
     * - ADMIN: Can download any certificate
     */
    private void validateCertificateDownloadAccess(Account currentUser, Certificate certificate) {
        Role currentRole = currentUser.getRole();

        // ADMIN can download any certificate
        if (currentRole == Role.ADMIN) {
            return;
        }

        // STUDENT can only download their own certificates
        if (currentRole == Role.STUDENT) {
            Student currentStudent = studentRepository.findByAccount(currentUser)
                    .orElseThrow(() -> new ResourceNotFoundException("Current student not found"));

            if (!certificate.getStudent().getId().equals(currentStudent.getId())) {
                throw new UnauthorizedException("You can only download your own certificates");
            }
            return;
        }

        // TEACHER can download certificates from their courses
        if (currentRole == Role.TEACHER) {
            Course course = certificate.getCourse();
            if (course.getTeacher() == null ||
                !course.getTeacher().getAccount().getId().equals(currentUser.getId())) {
                throw new UnauthorizedException("You can only download certificates from your courses");
            }
            return;
        }

        throw new UnauthorizedException("Access denied to download certificate");
    }

    /**
     * Validate course access for teacher
     *
     * Access Rules:
     * - TEACHER: Can only access their own courses
     * - ADMIN: Can access any course
     */
    private void validateCourseAccessForTeacher(Account currentUser, Course course) {
        Role currentRole = currentUser.getRole();

        // ADMIN can access any course
        if (currentRole == Role.ADMIN) {
            return;
        }

        // TEACHER can only access their own courses
        if (currentRole == Role.TEACHER) {
            if (course.getTeacher() == null ||
                !course.getTeacher().getAccount().getId().equals(currentUser.getId())) {
                throw new UnauthorizedException("You can only view certificates for your own courses");
            }
            return;
        }

        throw new UnauthorizedException("Access denied to view course certificates");
    }
}
