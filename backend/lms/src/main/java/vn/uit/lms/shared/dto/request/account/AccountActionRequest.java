package vn.uit.lms.shared.dto.request.account;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for account action operations (suspend, unlock, deactivate)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request DTO for account action operations")
public class AccountActionRequest {

    @Size(max = 1000, message = "Reason must not exceed 1000 characters")
    @Schema(
        description = "Reason for the action",
        example = "Violating community guidelines",
        maxLength = 1000
    )
    private String reason;
}

