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
@Schema(description = "Enrollment information")
public class EnrollmentResponse {

    @Schema(description = "Enrollment ID", example = "1")
    private Long id;

    @Schema(description = "Student ID", example = "1")
    private Long studentId;

    @Schema(description = "Student name", example = "Nguyen Van A")
    private String studentName;

    @Schema(description = "Student email", example = "student@example.com")
    private String studentEmail;

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

    @Schema(description = "Completed at", example = "2025-02-01T00:00:00Z")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'", timezone = "UTC")
    private Instant completedAt;

    @Schema(description = "Remaining days", example = "30")
    private Long remainingDays;

    @Schema(description = "Is active", example = "true")
    private Boolean isActive;

    @Schema(description = "Can take final exam", example = "true")
    private Boolean canTakeFinalExam;
}

