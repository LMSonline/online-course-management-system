package vn.uit.lms.shared.mapper;

import org.springframework.stereotype.Component;
import vn.uit.lms.core.domain.learning.Enrollment;
import vn.uit.lms.shared.dto.response.enrollment.EnrollmentDetailResponse;
import vn.uit.lms.shared.dto.response.enrollment.EnrollmentResponse;

@Component
public class EnrollmentMapper {

    public EnrollmentResponse toResponse(Enrollment enrollment) {
        if (enrollment == null) {
            return null;
        }

        return EnrollmentResponse.builder()
                .id(enrollment.getId())
                .studentId(enrollment.getStudent() != null ? enrollment.getStudent().getId() : null)
                .studentName(enrollment.getStudent() != null ? enrollment.getStudent().getFullName() : null)
                .studentEmail(enrollment.getStudent() != null && enrollment.getStudent().getAccount() != null
                        ? enrollment.getStudent().getAccount().getEmail() : null)
                .courseId(enrollment.getCourse() != null ? enrollment.getCourse().getId() : null)
                .courseTitle(enrollment.getCourse() != null ? enrollment.getCourse().getTitle() : null)
                .courseVersionId(enrollment.getCourseVersion() != null ? enrollment.getCourseVersion().getId() : null)
                .versionNumber(enrollment.getCourseVersion() != null ? enrollment.getCourseVersion().getVersionNumber() : null)
                .status(enrollment.getStatus())
                .enrolledAt(enrollment.getEnrolledAt())
                .startAt(enrollment.getStartAt())
                .endAt(enrollment.getEndAt())
                .completionPercentage(enrollment.getCompletionPercentage())
                .averageScore(enrollment.getAverageScore())
                .certificateIssued(enrollment.getCertificateIssued())
                .completedAt(enrollment.getCompletedAt())
                .remainingDays(enrollment.getRemainingDays())
                .isActive(enrollment.isActive())
                .canTakeFinalExam(enrollment.canTakeFinalExam())
                .finalExamScore(enrollment.getFinalExamScore())
                .finalExamWeight(enrollment.getFinalExamWeight())
                .build();
    }

    public EnrollmentDetailResponse toDetailResponse(Enrollment enrollment) {
        if (enrollment == null) {
            return null;
        }

        return EnrollmentDetailResponse.builder()
                .id(enrollment.getId())
                .studentId(enrollment.getStudent() != null ? enrollment.getStudent().getId() : null)
                .studentName(enrollment.getStudent() != null ? enrollment.getStudent().getFullName() : null)
                .studentEmail(enrollment.getStudent() != null && enrollment.getStudent().getAccount() != null
                        ? enrollment.getStudent().getAccount().getEmail() : null)
                .studentPhone(enrollment.getStudent() != null ? enrollment.getStudent().getPhone() : null)
                .courseId(enrollment.getCourse() != null ? enrollment.getCourse().getId() : null)
                .courseTitle(enrollment.getCourse() != null ? enrollment.getCourse().getTitle() : null)
                .courseVersionId(enrollment.getCourseVersion() != null ? enrollment.getCourseVersion().getId() : null)
                .versionNumber(enrollment.getCourseVersion() != null ? enrollment.getCourseVersion().getVersionNumber() : null)
                .status(enrollment.getStatus())
                .enrolledAt(enrollment.getEnrolledAt())
                .startAt(enrollment.getStartAt())
                .endAt(enrollment.getEndAt())
                .completionPercentage(enrollment.getCompletionPercentage())
                .averageScore(enrollment.getAverageScore())
                .certificateIssued(enrollment.getCertificateIssued())
                .certificateId(enrollment.getCertificate() != null ? enrollment.getCertificate().getId() : null)
                .completedAt(enrollment.getCompletedAt())
                .cancellationReason(enrollment.getCancellationReason())
                .cancelledAt(enrollment.getCancelledAt())
                .remainingDays(enrollment.getRemainingDays())
                .isActive(enrollment.isActive())
                .canTakeFinalExam(enrollment.canTakeFinalExam())
                .passScore(enrollment.getCourseVersion() != null ? enrollment.getCourseVersion().getPassScore() : null)
                .quizScores(enrollment.getQuizScores())
                .finalExamScore(enrollment.getFinalExamScore())
                .finalExamWeight(enrollment.getFinalExamWeight())
                .banReason(enrollment.getBanReason())
                .bannedAt(enrollment.getBannedAt())
                .isEligibleForCertificate(enrollment.isEligibleForCertificate())
                .minProgressPct(enrollment.getCourseVersion() != null ? enrollment.getCourseVersion().getMinProgressPct() : null)
                .finalWeight(enrollment.getCourseVersion() != null ? enrollment.getCourseVersion().getFinalWeight() : null)
                .build();
    }
}

