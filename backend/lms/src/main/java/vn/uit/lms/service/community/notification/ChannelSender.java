package vn.uit.lms.service.community.notification;

import vn.uit.lms.core.domain.community.notification.Notification;

/**
 * Interface for channel senders.
 */
interface ChannelSender {
    boolean send(Notification notification);
}