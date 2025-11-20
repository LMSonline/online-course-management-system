package vn.uit.lms.service.event;

import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import vn.uit.lms.service.MailService;

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
