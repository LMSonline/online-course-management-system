
package vn.uit.lms.shared.mapper;

import org.springframework.stereotype.Component;
import vn.uit.lms.core.domain.learning.Certificate;
import vn.uit.lms.shared.dto.response.certificate.CertificateDetailResponse;
import vn.uit.lms.shared.dto.response.certificate.CertificateResponse;

/**
 * Mapper for Certificate entity to DTOs
 */
@Component
public class CertificateMapper {

    public CertificateResponse toResponse(Certificate certificate) {
        if (certificate == null) {
            return null;
        }

        return CertificateResponse.builder()
                .id(certificate.getId())
                .code(certificate.getCode())
                .studentId(certificate.getStudent() != null ? certificate.getStudent().getId() : null)
                .studentName(certificate.getStudent() != null ? certificate.getStudent().getFullName() : null)
                .courseId(certificate.getCourse() != null ? certificate.getCourse().getId() : null)
                .courseTitle(certificate.getCourse() != null ? certificate.getCourse().getTitle() : null)
                .issuedAt(certificate.getIssuedAt())
                .finalScore(certificate.getFinalScore())
                .grade(certificate.getGrade())
                .isRevoked(certificate.getIsRevoked())
                .expiresAt(certificate.getExpiresAt())
                .fileUrl(certificate.getFileUrl())
                .build();
    }

    public CertificateDetailResponse toDetailResponse(Certificate certificate) {
        if (certificate == null) {
            return null;
        }

        return CertificateDetailResponse.builder()
                .id(certificate.getId())
                .code(certificate.getCode())
                .studentId(certificate.getStudent() != null ? certificate.getStudent().getId() : null)
                .studentName(certificate.getStudent() != null ? certificate.getStudent().getFullName() : null)
                .studentEmail(certificate.getStudent() != null && certificate.getStudent().getAccount() != null
                        ? certificate.getStudent().getAccount().getEmail() : null)
                .courseId(certificate.getCourse() != null ? certificate.getCourse().getId() : null)
                .courseTitle(certificate.getCourse() != null ? certificate.getCourse().getTitle() : null)
                .courseVersionId(certificate.getCourseVersion() != null ? certificate.getCourseVersion().getId() : null)
                .versionNumber(certificate.getCourseVersion() != null ? certificate.getCourseVersion().getVersionNumber() : null)
                .teacherId(certificate.getCourse() != null && certificate.getCourse().getTeacher() != null
                        ? certificate.getCourse().getTeacher().getId() : null)
                .teacherName(certificate.getCourse() != null && certificate.getCourse().getTeacher() != null
                        && certificate.getCourse().getTeacher().getAccount() != null
                        ? certificate.getCourse().getTeacher().getAccount().getUsername() : null)
                .issuedAt(certificate.getIssuedAt())
                .finalScore(certificate.getFinalScore())
                .grade(certificate.getGrade())
                .isRevoked(certificate.getIsRevoked())
                .revokeReason(certificate.getRevokeReason())
                .revokedAt(certificate.getRevokedAt())
                .revokedBy(certificate.getRevokedBy())
                .expiresAt(certificate.getExpiresAt())
                .fileUrl(certificate.getFileUrl())
                .metadata(certificate.getMetadata())
                .createdAt(certificate.getCreatedAt())
                .updatedAt(certificate.getUpdatedAt())
                .build();
    }
}
