package vn.uit.lms.shared.dto.response.certificate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CertificateDetailResponse {

    private Long id;

    private String code;

    private Long studentId;

    private String studentName;

    private String studentEmail;

    private Long courseId;

    private String courseTitle;

    private Long courseVersionId;

    private Integer versionNumber;

    private Long teacherId;

    private String teacherName;

    private Instant issuedAt;

    private Float finalScore;

    private String grade;

    private Boolean isRevoked;

    private String revokeReason;

    private Instant revokedAt;

    private String revokedBy;

    private Instant expiresAt;

    private String fileUrl;

    private Map<String, Object> metadata;

    private Instant createdAt;

    private Instant updatedAt;
}

