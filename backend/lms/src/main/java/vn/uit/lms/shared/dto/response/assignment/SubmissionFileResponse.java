package vn.uit.lms.shared.dto.response.assignment;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Response DTO for submission file")
public class SubmissionFileResponse {
    @Schema(description = "File ID", example = "1")
    private Long id;

    @Schema(description = "URL to download the file", example = "https://example.com/files/submission123.pdf")
    private String fileUrl;

    @Schema(description = "Original file name", example = "assignment_solution.pdf")
    private String fileName;
}
