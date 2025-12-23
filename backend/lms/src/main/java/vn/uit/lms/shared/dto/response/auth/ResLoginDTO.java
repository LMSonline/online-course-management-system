package vn.uit.lms.shared.dto.response.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.uit.lms.shared.constant.Role;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Response DTO for login operation")
public class ResLoginDTO {

    @Schema(description = "JWT access token", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String accessToken;

    @Schema(description = "JWT refresh token", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String refreshToken;

    @Schema(description = "Access token expiration time", example = "2025-11-30T11:15:30Z")
    private Instant accessTokenExpiresAt;

    @Schema(description = "Refresh token expiration time", example = "2025-12-07T10:15:30Z")
    private Instant refreshTokenExpiresAt;

    @Schema(description = "User information")
    private UserInfo user;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "User information")
    public static class UserInfo {

        @Schema(description = "User ID", example = "123")
        private Long id;

        @Schema(description = "Username", example = "john_doe")
        private String username;

        @Schema(description = "Email address", example = "john.doe@example.com")
        private String email;

        @Schema(description = "User role", example = "STUDENT")
        private Role role;

        @Schema(description = "Full name", example = "John Doe")
        private String fullName;

        @Schema(description = "Avatar URL", example = "https://example.com/avatars/john.jpg")
        private String avatarUrl;

        @Schema(description = "Language preference", example = "en")
        private String langKey;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @Schema(description = "User information embedded in JWT token")
    public static class UserInsideToken {
        @Schema(description = "Account ID", example = "123")
        private Long accountId;

        @Schema(description = "Username", example = "john_doe")
        private String username;

        @Schema(description = "Email address", example = "john.doe@example.com")
        private String email;

        @Schema(description = "User role", example = "STUDENT")
        private Role role;
    }
}
