package vn.uit.lms.service.event;

import vn.uit.lms.core.domain.Account;
import vn.uit.lms.shared.constant.AccountActionType;

public record AccountStatusChangeEvent (
     Account account,
     AccountActionType actionType,
     String reason
){}
