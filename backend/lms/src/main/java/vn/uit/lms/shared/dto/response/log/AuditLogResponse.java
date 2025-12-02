package vn.uit.lms.shared.dto.response.log;

import lombok.Getter;
import lombok.Setter;
import vn.uit.lms.shared.constant.AuditAction;

import java.time.LocalDateTime;

@Getter
@Setter
public class AuditLogResponse {
    private Long id;
    private String tableName;
    private String recordId;
    private AuditAction action;
    private String changedData;
    private Long userAccountId;
    private String ipAddress;
    private LocalDateTime createdAt;
}
