package vn.uit.lms.shared.dto.request.account;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RejectRequest {
    @Size(max=1000)
    private String reason;
}

