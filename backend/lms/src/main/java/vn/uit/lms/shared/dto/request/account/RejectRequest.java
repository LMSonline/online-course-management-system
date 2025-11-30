package vn.uit.lms.shared.dto.request.account;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "Request DTO for rejecting an account application")
public class RejectRequest {
    @Size(max=1000)
    @Schema(
        description = "Reason for rejection",
        example = "Your submitted documents do not meet our requirements",
        maxLength = 1000
    )
    private String reason;
}

