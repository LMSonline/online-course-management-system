package vn.uit.lms.service.event;

import vn.uit.lms.core.domain.Account;

public record PasswordResetEvent(Account account, String rawToken) {
}
