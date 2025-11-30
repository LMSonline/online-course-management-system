package vn.uit.lms.shared.dto.response.account;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Response DTO for avatar upload")
public class UploadAvatarResponse {

    @Schema(description = "URL of the uploaded avatar", example = "https://example.com/avatars/user123.jpg")
    private String avatarUrl;

    @Schema(description = "URL of the thumbnail version", example = "https://example.com/avatars/user123_thumb.jpg")
    private String thumbnailUrl;

}
