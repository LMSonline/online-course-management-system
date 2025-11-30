package vn.uit.lms.shared.dto.response.course.content;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@Schema(description = "Response DTO for upload URL request")
public class RequestUploadUrlResponse {
    @Schema(description = "Pre-signed upload URL", example = "https://minio.example.com/bucket/upload?signature=...")
    private String uploadUrl;

    @Schema(description = "Object key in storage", example = "videos/course-1/lesson-5/video.mp4")
    private String objectKey;

    @Schema(description = "URL expiration time in seconds", example = "3600")
    private Long expiresInSeconds;
}
