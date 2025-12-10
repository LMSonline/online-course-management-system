package vn.uit.lms.shared.dto.response.student;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Student certificate information")
public class StudentCertificateResponse {

    @Schema(description = "Certificate ID", example = "1")
    private Long id;

    @Schema(description = "Certificate code", example = "CERT-2024-001")
    private String certificateCode;

    @Schema(description = "Course ID", example = "1")
    private Long courseId;

    @Schema(description = "Course title", example = "Java Programming")
    private String courseTitle;

    @Schema(description = "Teacher name", example = "Nguyen Van B")
    private String teacherName;

    @Schema(description = "Certificate issue date")
    private Instant issuedAt;

    @Schema(description = "Certificate URL")
    private String certificateUrl;

    @Schema(description = "Completion score", example = "95.5")
    private Double completionScore;
}

