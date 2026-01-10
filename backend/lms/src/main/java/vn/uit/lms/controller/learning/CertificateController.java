package vn.uit.lms.controller.learning;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.learning.CertificateService;
import vn.uit.lms.shared.dto.response.certificate.CertificateDetailResponse;
import vn.uit.lms.shared.dto.response.certificate.CertificateResponse;
import vn.uit.lms.shared.dto.response.certificate.CertificateVerificationResponse;
import vn.uit.lms.shared.util.annotation.StudentOnly;
import vn.uit.lms.shared.util.annotation.StudentOrTeacher;
import vn.uit.lms.shared.util.annotation.TeacherOnly;

import java.util.List;

/**
 * Certificate Controller
 * Manages certificate issuance, verification, and retrieval
 */
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Certificate Management", description = "APIs for managing course completion certificates")
public class CertificateController {

    private final CertificateService certificateService;

    /**
     * GET /students/{studentId}/certificates - Danh sách chứng chỉ
     */
    @Operation(
            summary = "Get student certificates",
            description = "Get list of all certificates earned by a student"
    )
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/students/{studentId}/certificates")
    @StudentOnly
    public ResponseEntity<List<CertificateResponse>> getStudentCertificates(
            @Parameter(description = "Student ID") @PathVariable Long studentId
    ) {
        List<CertificateResponse> response = certificateService.getStudentCertificates(studentId);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /certificates/{id} - Chi tiết chứng chỉ
     */
    @Operation(
            summary = "Get certificate details",
            description = "Get detailed information about a specific certificate"
    )
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/certificates/{id}")
    @StudentOrTeacher
    public ResponseEntity<CertificateDetailResponse> getCertificateById(
            @Parameter(description = "Certificate ID") @PathVariable Long id
    ) {
        CertificateDetailResponse response = certificateService.getCertificateById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /certificates/{code}/verify - Xác thực chứng chỉ
     */
    @Operation(
            summary = "Verify certificate",
            description = "Verify a certificate by its code. This is a public endpoint for certificate verification."
    )
    @GetMapping("/certificates/{code}/verify")
    public ResponseEntity<CertificateVerificationResponse> verifyCertificate(
            @Parameter(description = "Certificate code") @PathVariable String code
    ) {
        CertificateVerificationResponse response = certificateService.verifyCertificate(code);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /certificates/{id}/download - Tải chứng chỉ
     */
    @Operation(
            summary = "Download certificate",
            description = "Download certificate as PDF file"
    )
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/certificates/{id}/download")
    @StudentOnly
    public ResponseEntity<byte[]> downloadCertificate(
            @Parameter(description = "Certificate ID") @PathVariable Long id
    ) {
        byte[] certificateData = certificateService.downloadCertificate(id);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=certificate-" + id + ".pdf")
                .body(certificateData);
    }

    /**
     * GET /courses/{courseId}/certificates - Chứng chỉ của khóa học (Teacher)
     */
    @Operation(
            summary = "Get course certificates",
            description = "Get list of all certificates issued for a course (Teacher access)"
    )
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/courses/{courseId}/certificates")
    @TeacherOnly
    public ResponseEntity<List<CertificateResponse>> getCourseCertificates(
            @Parameter(description = "Course ID") @PathVariable Long courseId
    ) {
        List<CertificateResponse> response = certificateService.getCourseCertificates(courseId);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /enrollments/{enrollmentId}/issue-certificate - Issue certificate for enrollment
     */
    @Operation(
            summary = "Issue certificate",
            description = "Issue a certificate for a completed enrollment (System or Teacher)"
    )
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/enrollments/{enrollmentId}/issue-certificate")
    @TeacherOnly
    public ResponseEntity<CertificateDetailResponse> issueCertificate(
            @Parameter(description = "Enrollment ID") @PathVariable Long enrollmentId
    ) {
        CertificateDetailResponse response = certificateService.issueCertificate(enrollmentId);
        return ResponseEntity.ok(response);
    }
}

