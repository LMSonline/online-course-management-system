package vn.uit.lms.service.event.listener;

import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import vn.uit.lms.service.MailService;
import vn.uit.lms.service.event.AccountActivatedEvent;
import vn.uit.lms.service.event.AccountActiveEvent;
import vn.uit.lms.service.event.AccountStatusChangeEvent;
import vn.uit.lms.service.event.PasswordResetEvent;

@Component
@RequiredArgsConstructor
public class AccountListener {

    private final MailService mailService;

    @Async
    @EventListener
    public void handleAccountStatusChange(AccountStatusChangeEvent event) {
        mailService.sendAccountActionEmail(event.account(), event.actionType(), event.reason());
    }

    @Async
    @EventListener
    public void handleActiveAccount(AccountActiveEvent event) {
        mailService.sendActivationEmail(event.account(), event.rawToken());
    }

    @Async
    @EventListener
    public void handleAccountActivated(AccountActivatedEvent event) {
        mailService.sendActivationSuccessEmail(event.account());
    }

    @Async
    @EventListener
    public void handlePasswordReset(PasswordResetEvent event) {
        mailService.sendPasswordResetMail(event.account(), event.rawToken());
    }





}
