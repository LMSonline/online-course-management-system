package vn.uit.lms.shared.dto.response.assignment;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SubmissionFileResponse {
    private Long id;
    private String fileUrl;
    private String fileName;
}
