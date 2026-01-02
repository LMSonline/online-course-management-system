package vn.uit.lms.service.community.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import vn.uit.lms.core.domain.community.notification.Notification;

/**
 * Email channel sender implementation.
 */
@Service
class EmailChannelSender implements ChannelSender {
    private static final Logger log = LoggerFactory.getLogger(EmailChannelSender.class);

    @Override
    public boolean send(Notification notification) {
        log.info("Sending email notification to: {}", notification.getRecipient().getEmail());

        // TODO: Implement actual email sending logic
        // Example: emailService.send(notification.getRecipient().getEmail(), notification.getTitle(), notification.getContent());

        return true; // Return true if sent successfully
    }
}