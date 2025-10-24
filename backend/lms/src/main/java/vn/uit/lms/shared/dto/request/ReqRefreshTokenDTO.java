package vn.uit.lms.shared.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReqRefreshTokenDTO {

    @NotBlank(message = "Refresh token must not be blank")
    private String refreshToken;

    //optional fields
    private String deviceInfo;
    private String ipAddress;
}

