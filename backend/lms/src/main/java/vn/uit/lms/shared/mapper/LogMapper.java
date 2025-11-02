package vn.uit.lms.shared.mapper;

import vn.uit.lms.core.entity.AccountActionLog;
import vn.uit.lms.shared.constant.AccountActionType;
import vn.uit.lms.shared.constant.AccountStatus;
import vn.uit.lms.shared.dto.response.log.AccountActionLogResponse;

public class LogMapper {

    public static AccountActionLogResponse toAccountActionLogResponse(AccountActionLog accountActionLog) {
        return AccountActionLogResponse.builder()
                .id(accountActionLog.getId())
                .actionType(accountActionLog.getActionType())
                .reason(accountActionLog.getReason())
                .oldStatus(accountActionLog.getOldStatus())
                .newStatus(accountActionLog.getNewStatus())
                .performedByUsername(accountActionLog.getPerformedBy().getUsername())
                .createdAt(accountActionLog.getCreatedAt())
                .updatedAt(accountActionLog.getUpdatedAt())
                .ipAddress(accountActionLog.getIpAddress())
                .build();
    }

    public static AccountActionType mapStatusToAction(AccountStatus newStatus, AccountStatus oldStatus) {
        if (oldStatus == newStatus) {
            return AccountActionType.UNKNOWN;
        }

        return switch (newStatus) {
            case ACTIVE -> {
                if (oldStatus == AccountStatus.PENDING_APPROVAL)
                    yield AccountActionType.APPROVE;
                if (oldStatus == AccountStatus.SUSPENDED)
                    yield AccountActionType.UNLOCK;
                yield AccountActionType.UNKNOWN;
            }
            case REJECTED -> AccountActionType.REJECT;
            case SUSPENDED -> AccountActionType.SUSPEND;
            case DEACTIVATED -> AccountActionType.DEACTIVATE;
            default -> AccountActionType.UNKNOWN;
        };
    }
}
