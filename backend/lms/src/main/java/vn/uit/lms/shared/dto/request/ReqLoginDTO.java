package vn.uit.lms.shared.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for login request.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReqLoginDTO {

    /** Username or email of the user. */
    @NotBlank(message = "Login is required")
    private String login;

    /** User password. */
    @NotBlank(message = "Password is required")
    private String password;

    //optional fields
    private String deviceInfo;
    private String ipAddress;
}
