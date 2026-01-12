package vn.uit.lms.controller.learning;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.learning.CertificateService;
import vn.uit.lms.shared.dto.response.certificate.CertificateVerificationResponse;

@RestController
@RequestMapping("/api/v1/public/certificates")
@RequiredArgsConstructor
public class PublicCertificateController {

    private final CertificateService certificateService;

    /**
     * UC-4-06: Tra cứu / xác minh chứng chỉ (public)
     */
    @GetMapping("/verify")
    public CertificateVerificationResponse verifyCertificate(
            @RequestParam String code
    ) {
        return certificateService.verifyCertificate(code);
    }
}
