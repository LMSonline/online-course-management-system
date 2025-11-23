package vn.uit.lms.service.event;

import vn.uit.lms.core.entity.Account;

public record AccountActivatedEvent(Account account) {
}
