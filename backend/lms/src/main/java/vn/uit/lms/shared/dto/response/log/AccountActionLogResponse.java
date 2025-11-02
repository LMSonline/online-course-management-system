package vn.uit.lms.shared.dto.response.log;

import lombok.Builder;
import lombok.Data;
import vn.uit.lms.shared.constant.AccountActionType;

import java.time.Instant;

@Data
@Builder
public class AccountActionLogResponse {
    private Long id;
    private AccountActionType actionType;
    private String reason;
    private String oldStatus;
    private String newStatus;
    private Instant createdAt;
    private Instant updatedAt;
    private String performedByUsername;
    private String ipAddress;

}
