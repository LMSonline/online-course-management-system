package vn.uit.lms.service.community.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import vn.uit.lms.core.domain.community.notification.Notification;

/**
 * Push notification sender implementation.
 */
@Service
class PushChannelSender implements ChannelSender {
    private static final Logger log = LoggerFactory.getLogger(PushChannelSender.class);

    @Override
    public boolean send(Notification notification) {
        log.info("Sending push notification to recipient: {}", notification.getRecipient().getId());

        // TODO: Implement actual push notification logic
        // Example: pushService.send(deviceToken, notification.getTitle(), notification.getContent());

        return true; // Return true if sent successfully
    }
}