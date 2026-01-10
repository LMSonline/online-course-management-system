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
     */
    public List<CertificateResponse> getStudentCertificates(Long studentId) {
        log.info("Fetching certificates for student: {}", studentId);

        // Precondition: Verify student exists
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student not found with id: " + studentId);
        }

        // TODO: Verify access - student can only view their own certificates
        // Account currentUser = accountService.verifyCurrentAccount();
        // if (currentUser.getRole() == Role.STUDENT && !currentUser.getId().equals(studentId)) {
        //     throw new UnauthorizedException("You can only view your own certificates");
        // }

        List<Certificate> certificates = certificateRepository.findByStudentIdOrderByIssuedAtDesc(studentId);

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
     * - Student must own the certificate or be admin/teacher
     * - Certificate must not be revoked
     *
     * Returns:
     * - PDF file as byte array
     */
    public byte[] downloadCertificate(Long certificateId) {
        log.info("Downloading certificate: {}", certificateId);

        Certificate certificate = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found with id: " + certificateId));

        // Precondition: Certificate must not be revoked
        if (certificate.getIsRevoked()) {
            throw new InvalidRequestException("Cannot download revoked certificate");
        }

        // TODO: Verify ownership
        Account currentUser = accountService.verifyCurrentAccount();
        Student currentStudent = studentRepository.findByAccount(currentUser).orElse(null);

        if (currentStudent != null && !certificate.getStudent().getId().equals(currentStudent.getId())) {
            throw new InvalidRequestException("You can only download your own certificates");
        }

        // TODO: Generate PDF from template and return bytes
        // For now, return mock data
        log.warn("Certificate PDF generation not implemented yet - returning mock data");
        return generateMockCertificatePdf(certificate);
    }

    /**
     * Get all certificates for a course (Teacher access)
     */
    public List<CertificateResponse> getCourseCertificates(Long courseId) {
        log.info("Fetching certificates for course: {}", courseId);

        // Precondition: Verify course exists
        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Course not found with id: " + courseId);
        }

        // TODO: Verify teacher owns the course
        // Account currentUser = accountService.verifyCurrentAccount();
        // Course course = courseRepository.findById(courseId).get();
        // if (!course.getTeacher().getAccount().getId().equals(currentUser.getId())) {
        //     throw new UnauthorizedException("You can only view certificates for your own courses");
        // }

        List<Certificate> certificates = certificateRepository.findByCourseIdOrderByIssuedAtDesc(courseId);

        return certificates.stream()
                .map(certificateMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Issue certificate for a completed enrollment
     *
     * Preconditions:
     * - Enrollment must exist and be COMPLETED
     * - Enrollment must not have expired
     * - Certificate must not have been issued already
     * - Student must meet ALL requirements:
     *   + Progress: completionPercentage >= minProgressPct (e.g., >= 80%)
     *   + Score: averageScore >= passScore (calculated using formula)
     *   + Time: Within course duration (not expired)
     *
     * Formula for average score:
     * DTB = (Σ DKTBT_i + DKTCK × k) / (n + k)
     * Where:
     * - DKTBT_i: Score of regular quiz i
     * - DKTCK: Final exam score
     * - k: Final exam weight (0.5 ≤ k ≤ 1)
     * - n: Number of regular quizzes
     *
     * Example:
     * - Course: "Lập trình C# cơ bản"
     * - Total lessons: 26 (10 + 8 + 8)
     * - Duration: 60 days
     * - Regular quizzes: 7, Final exam: 1 (k = 0.6)
     * - Required: 80% progress, average score >= 8.0
     *
     * Postconditions:
     * - Certificate created with unique code
     * - Certificate file URL generated
     * - Grade calculated based on final score
     * - Enrollment marked with certificate issued flag
     */
    @Transactional
    public CertificateDetailResponse issueCertificate(Long enrollmentId) {
        log.info("Issuing certificate for enrollment: {}", enrollmentId);

        // Precondition: Verify enrollment exists
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + enrollmentId));

        // Precondition: Enrollment must be COMPLETED
        if (enrollment.getStatus() != EnrollmentStatus.COMPLETED) {
            throw new InvalidRequestException(
                    "Certificate can only be issued for completed enrollments. Current status: "
                    + enrollment.getStatus());
        }

        // Precondition: Enrollment must not be expired
        if (enrollment.isExpired()) {
            throw new InvalidRequestException(
                    "Cannot issue certificate for expired enrollment. " +
                    "Course duration exceeded.");
        }

        // Precondition: Certificate must not have been issued already
        if (enrollment.getCertificateIssued()) {
            throw new InvalidRequestException("Certificate has already been issued for this enrollment");
        }

        // Precondition: Check strict eligibility using domain logic
        if (!enrollment.isEligibleForCertificate()) {
            CourseVersion courseVersion = enrollment.getCourseVersion();
            Float passScore = courseVersion != null ? courseVersion.getPassScore() : null;
            Float currentScore = enrollment.getAverageScore();

            throw new InvalidRequestException(
                    String.format("Student does not meet certificate requirements. " +
                            "Required score: %.1f, Current score: %.1f",
                            passScore != null ? passScore : 0f,
                            currentScore != null ? currentScore : 0f)
            );
        }

        Student student = enrollment.getStudent();
        Course course = enrollment.getCourse();
        CourseVersion courseVersion = enrollment.getCourseVersion();

        // Create certificate
        Certificate certificate = Certificate.builder()
                .student(student)
                .course(course)
                .courseVersion(courseVersion)
                .issuedAt(Instant.now())
                .finalScore(enrollment.getAverageScore())
                .fileUrl(generateCertificateUrl(student.getId(), course.getId()))
                .build();

        // Calculate grade based on pass score
        Float passScore = courseVersion.getPassScore();
        if (passScore != null) {
            certificate.calculateGrade(passScore);
        }

        // Add comprehensive metadata
        certificate.addMetadata("enrollmentId", enrollmentId);
        certificate.addMetadata("completedAt", enrollment.getCompletedAt().toString());
        certificate.addMetadata("completionPercentage", enrollment.getCompletionPercentage());
        certificate.addMetadata("quizScores", enrollment.getQuizScores());
        certificate.addMetadata("finalExamScore", enrollment.getFinalExamScore());
        certificate.addMetadata("finalExamWeight", enrollment.getFinalExamWeight());
        certificate.addMetadata("formulaUsed", "DTB = (Σ DKTBT_i + DKTCK × k) / (n + k)");

        // Save certificate
        certificate = certificateRepository.save(certificate);

        // Update enrollment
        try {
            enrollment.issueCertificate(certificate);
            enrollmentRepository.save(enrollment);
        } catch (IllegalStateException e) {
            throw new InvalidRequestException(e.getMessage());
        }

        // Postcondition: Verify certificate created successfully
        assert certificate.getId() != null : "Certificate must have ID after saving";
        assert certificate.getCode() != null : "Certificate must have code after saving";
        assert enrollment.getCertificateIssued() : "Enrollment must be marked with certificate issued";

        log.info("Successfully issued certificate {} for enrollment {}. Score: {}, Grade: {}",
                certificate.getId(), enrollmentId, certificate.getFinalScore(), certificate.getGrade());

        // TODO: Send notification to student
        // TODO: Generate PDF certificate file

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
}
