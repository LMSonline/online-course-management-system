package vn.uit.lms.shared.dto.response.account;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UploadAvatarResponse {

    private String avatarUrl;
    private String thumbnailUrl;

}
