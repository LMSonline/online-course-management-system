package vn.uit.lms.service.event;

import vn.uit.lms.core.domain.Account;

public record AccountActivatedEvent(Account account) {
}
