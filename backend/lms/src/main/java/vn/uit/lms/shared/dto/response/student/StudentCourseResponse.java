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
@Schema(description = "Student enrolled course information")
public class StudentCourseResponse {

    @Schema(description = "Course ID", example = "1")
    private Long courseId;

    @Schema(description = "Course title", example = "Java Programming")
    private String courseTitle;

    @Schema(description = "Course description")
    private String courseDescription;

    @Schema(description = "Course thumbnail URL")
    private String courseThumbnail;

    @Schema(description = "Teacher name", example = "Nguyen Van B")
    private String teacherName;

    @Schema(description = "Enrollment date")
    private Instant enrolledAt;

    @Schema(description = "Progress percentage", example = "75.5")
    private Double progressPercentage;

    @Schema(description = "Completion status", example = "false")
    private Boolean isCompleted;

    @Schema(description = "Certificate issued", example = "false")
    private Boolean hasCertificate;
}

