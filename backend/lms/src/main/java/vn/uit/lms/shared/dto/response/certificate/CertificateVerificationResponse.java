package vn.uit.lms.shared.dto.response.certificate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CertificateVerificationResponse {

    private String code;

    private String studentName;

    private String courseName;

    private Instant issuedAt;

    private Instant expiresAt;

    private Boolean isValid;

    private String status;

    private Float finalScore;

    private String grade;

    private Boolean isRevoked;

    private String revokeReason;
}

