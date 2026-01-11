package vn.uit.lms.service.community.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import vn.uit.lms.core.domain.community.notification.Notification;
import vn.uit.lms.service.MailService;

/**
 * Email channel sender implementation.
 * Uses MailService for actual email delivery.
 */
@Service
class EmailChannelSender implements ChannelSender {
    private static final Logger log = LoggerFactory.getLogger(EmailChannelSender.class);

    private final MailService mailService;

    public EmailChannelSender(MailService mailService) {
        this.mailService = mailService;
    }

    @Override
    public boolean send(Notification notification) {
        try {
            String recipientEmail = notification.getRecipient().getEmail();

            if (recipientEmail == null || recipientEmail.isBlank()) {
                log.warn("Cannot send email: recipient {} has no email",
                        notification.getRecipient().getUsername());
                return false;
            }

            log.info("Sending email notification to: {}", recipientEmail);

            // Use MailService to send email asynchronously
            mailService.sendEmail(
                    recipientEmail,
                    notification.getTitle() != null ? notification.getTitle() : "Notification",
                    notification.getContent(),
                    false, // isMultipart
                    true   // isHtml
            );

            log.info("Email notification queued successfully for: {}", recipientEmail);
            return true;

        } catch (Exception e) {
            log.error("Failed to send email notification: {}", e.getMessage(), e);
            return false;
        }
    }
}