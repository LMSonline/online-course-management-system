package vn.uit.lms.service.event;

import vn.uit.lms.core.entity.Account;

public record AccountActiveEvent(Account account, String rawToken) {
}
