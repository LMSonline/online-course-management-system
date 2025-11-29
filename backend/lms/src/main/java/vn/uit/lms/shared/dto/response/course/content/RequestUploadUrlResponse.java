package vn.uit.lms.shared.dto.response.course.content;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class RequestUploadUrlResponse {
    private String uploadUrl;
    private String objectKey;
    private Long expiresInSeconds;
}
