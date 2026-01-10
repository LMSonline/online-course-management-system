package vn.uit.lms.shared.dto.response.enrollment;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.uit.lms.shared.constant.EnrollmentStatus;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Detailed enrollment information")
public class EnrollmentDetailResponse {

    @Schema(description = "Enrollment ID", example = "1")
    private Long id;

    @Schema(description = "Student ID", example = "1")
    private Long studentId;

    @Schema(description = "Student name", example = "Nguyen Van A")
    private String studentName;

    @Schema(description = "Student email", example = "student@example.com")
    private String studentEmail;

    @Schema(description = "Student phone", example = "0123456789")
    private String studentPhone;

    @Schema(description = "Course ID", example = "1")
    private Long courseId;

    @Schema(description = "Course title", example = "Java Spring Boot")
    private String courseTitle;

    @Schema(description = "Course version ID", example = "1")
    private Long courseVersionId;

    @Schema(description = "Course version number", example = "1")
    private Integer versionNumber;

    @Schema(description = "Enrollment status", example = "ENROLLED")
    private EnrollmentStatus status;

    @Schema(description = "Enrolled at", example = "2025-01-01T00:00:00Z")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'", timezone = "UTC")
    private Instant enrolledAt;

    @Schema(description = "Started at", example = "2025-01-01T00:00:00Z")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'", timezone = "UTC")
    private Instant startAt;

    @Schema(description = "End at", example = "2025-03-01T00:00:00Z")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'", timezone = "UTC")
    private Instant endAt;

    @Schema(description = "Completion percentage", example = "75.5")
    private Float completionPercentage;

    @Schema(description = "Average score", example = "8.5")
    private Float averageScore;

    @Schema(description = "Certificate issued", example = "false")
    private Boolean certificateIssued;

    @Schema(description = "Certificate ID", example = "1")
    private Long certificateId;

    @Schema(description = "Completed at", example = "2025-02-01T00:00:00Z")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'", timezone = "UTC")
    private Instant completedAt;

    @Schema(description = "Cancellation reason", example = "Changed my mind")
    private String cancellationReason;

    @Schema(description = "Cancelled at", example = "2025-01-15T00:00:00Z")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'", timezone = "UTC")
    private Instant cancelledAt;

    @Schema(description = "Remaining days", example = "30")
    private Long remainingDays;

    @Schema(description = "Is active", example = "true")
    private Boolean isActive;

    @Schema(description = "Can take final exam", example = "true")
    private Boolean canTakeFinalExam;

    @Schema(description = "Course pass score", example = "8.0")
    private Float passScore;

    @Schema(description = "Course min progress percentage", example = "80")
    private Integer minProgressPct;

    @Schema(description = "Course final weight", example = "0.6")
    private Float finalWeight;

    @Schema(description = "Quiz scores (JSON)")
    private java.util.List<java.util.Map<String, Object>> quizScores;

    @Schema(description = "Final exam score", example = "9.0")
    private Float finalExamScore;

    @Schema(description = "Final exam weight (k factor)", example = "0.6")
    private Float finalExamWeight;

    @Schema(description = "Ban reason if kicked from course")
    private String banReason;

    @Schema(description = "Banned at", example = "2025-01-20T00:00:00Z")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'", timezone = "UTC")
    private Instant bannedAt;

    @Schema(description = "Is eligible for certificate", example = "true")
    private Boolean isEligibleForCertificate;
}

