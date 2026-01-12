package vn.uit.lms.controller.admin;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.PostConstruct;
import vn.uit.lms.service.learning.CertificateService;
import vn.uit.lms.shared.dto.response.certificate.CertificateDetailResponse;
import vn.uit.lms.shared.dto.response.certificate.CertificateResponse;
import vn.uit.lms.shared.dto.response.certificate.CertificateVerificationResponse;
import vn.uit.lms.shared.util.annotation.AdminOnly;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/certificates")
@RequiredArgsConstructor
@AdminOnly
public class AdminCertificateController {

@PostConstruct
public void init() {
    System.out.println(">>> CertificateController LOADED <<<");
}

    private final CertificateService certificateService;

    /* =========================================================
     * ADMIN – VIEW / MANAGEMENT
     * ========================================================= */

    /**
     * UC-3-04: Admin xem danh sách chứng chỉ của 1 học viên
     */
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<CertificateResponse>> getCertificatesByStudent(
            @PathVariable Long studentId
    ) {
        return ResponseEntity.ok(
                certificateService.getStudentCertificates(studentId)
        );
    }

    /**
     * UC-3-04: Admin xem danh sách chứng chỉ theo khoá học
     */
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<CertificateResponse>> getCertificatesByCourse(
            @PathVariable Long courseId
    ) {
        return ResponseEntity.ok(
                certificateService.getCourseCertificates(courseId)
        );
    }

    /**
     * Admin xem chi tiết chứng chỉ
     */
    @GetMapping("/{id}")
    public ResponseEntity<CertificateDetailResponse> getCertificateDetail(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                certificateService.getCertificateById(id)
        );
    }

    /**
     * Admin thu hồi chứng chỉ (vi phạm, gian lận…)
     */
    @PostMapping("/{id}/revoke")
    public ResponseEntity<CertificateDetailResponse> revokeCertificate(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        String reason = body.getOrDefault("reason", "Revoked by admin");
        return ResponseEntity.ok(
                certificateService.revokeCertificate(id, reason)
        );
    }

    /**
     * Admin tải file chứng chỉ (PDF)
     */
    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadCertificate(
            @PathVariable Long id
    ) {
        byte[] pdfBytes = certificateService.downloadCertificate(id);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=certificate_" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}

