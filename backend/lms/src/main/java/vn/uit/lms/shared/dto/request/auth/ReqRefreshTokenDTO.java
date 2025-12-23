package vn.uit.lms.shared.dto.request.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "Request DTO for refreshing access token")
public class ReqRefreshTokenDTO {

    @NotBlank(message = "Refresh token must not be blank")
    @Schema(
        description = "Refresh token to generate new access token",
        example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String refreshToken;

    //optional fields
    @Schema(description = "Device information", example = "Chrome 120.0 on Windows 10")
    private String deviceInfo;

    @Schema(description = "IP address of the client", example = "192.168.1.1")
    private String ipAddress;
}

