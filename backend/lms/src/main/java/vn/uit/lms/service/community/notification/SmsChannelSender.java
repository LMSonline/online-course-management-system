package vn.uit.lms.service.community.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import vn.uit.lms.core.domain.community.notification.Notification;

@Service
class SmsChannelSender implements ChannelSender {
    private static final Logger log = LoggerFactory.getLogger(SmsChannelSender.class);

    @Override
    public boolean send(Notification notification) {
        log.info("Sending SMS notification to recipient: {}", notification.getRecipient().getId());

        // TODO: Implement actual SMS sending logic
        // Example: smsService.send(phoneNumber, notification.getContent());

        return true; // Return true if sent successfully
    }

}