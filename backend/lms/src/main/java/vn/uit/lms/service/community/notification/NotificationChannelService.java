package vn.uit.lms.service.community.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.domain.community.notification.Notification;
import vn.uit.lms.core.domain.community.notification.NotificationChannel;
import vn.uit.lms.core.repository.community.notification.NotificationChannelRepository;
import vn.uit.lms.shared.constant.ChannelStatus;
import vn.uit.lms.shared.exception.ResourceNotFoundException;

import java.util.List;

@Service
public class NotificationChannelService {

    private static final Logger log = LoggerFactory.getLogger(NotificationChannelService.class);

    private final NotificationChannelRepository channelRepository;
    private final EmailChannelSender emailChannelSender;
    private final SmsChannelSender smsChannelSender;
    private final PushChannelSender pushChannelSender;

    public NotificationChannelService(NotificationChannelRepository channelRepository,
                                      EmailChannelSender emailChannelSender,
                                      SmsChannelSender smsChannelSender,
                                      PushChannelSender pushChannelSender) {
        this.channelRepository = channelRepository;
        this.emailChannelSender = emailChannelSender;
        this.smsChannelSender = smsChannelSender;
        this.pushChannelSender = pushChannelSender;
    }

    /**
     * Sends a notification through all its channels asynchronously.
     *
     * @param notification the notification to send
     */
    @Async
    @Transactional
    public void sendThroughAllChannels(Notification notification) {
        log.info("Sending notification {} through all channels", notification.getId());

        List<NotificationChannel> channels = notification.getChannels();

        for (NotificationChannel channel : channels) {
            try {
                sendThroughChannel(channel);
            } catch (Exception e) {
                log.error("Error sending notification {} through channel {}: {}",
                        notification.getId(), channel.getChannel(), e.getMessage(), e);
                channel.markAsFailed("Unexpected error: " + e.getMessage());
                channelRepository.save(channel);
            }
        }

        // Mark notification as delivered if at least one channel succeeded
        if (notification.areAllChannelsSent() || hasAtLeastOneSuccessfulChannel(channels)) {
            notification.markAsDelivered();
        }
    }

    /**
     * Sends a notification through a specific channel.
     *
     * @param channel the notification channel to send through
     */
    @Transactional
    public void sendThroughChannel(NotificationChannel channel) {
        log.info("Sending through channel: {} for notification: {}",
                channel.getChannel(), channel.getNotification().getId());

        // Mark as processing using domain behavior
        channel.markAsProcessing();
        channelRepository.save(channel);

        try {
            boolean success = false;

            // Delegate to appropriate sender based on channel type
            switch (channel.getChannel()) {
                case WEB -> {
                    // Web notifications are stored in DB only, no external sending needed
                    success = true;
                    log.info("Web notification stored successfully");
                }
                case EMAIL -> {
                    success = emailChannelSender.send(channel.getNotification());
                }
                case SMS -> {
                    success = smsChannelSender.send(channel.getNotification());
                }
                case MOBILE_PUSH -> {
                    success = pushChannelSender.send(channel.getNotification());
                }
                default -> {
                    log.warn("Unknown channel type: {}", channel.getChannel());
                    channel.markAsFailed("Unknown channel type");
                }
            }

            if (success) {
                // Mark as sent using domain behavior
                channel.markAsSent();
                log.info("Successfully sent through channel: {}", channel.getChannel());
            } else {
                channel.markAsFailed("Sender returned false");
                log.warn("Failed to send through channel: {}", channel.getChannel());
            }

        } catch (Exception e) {
            log.error("Error sending through channel {}: {}",
                    channel.getChannel(), e.getMessage(), e);
            channel.markAsFailed(e.getMessage());
        }

        channelRepository.save(channel);
    }

    /**
     * Retries failed channels for a notification.
     *
     * @param notificationId the notification ID
     * @return number of channels retried
     */
    @Transactional
    public int retryFailedChannels(Long notificationId) {
        log.info("Retrying failed channels for notification: {}", notificationId);

        List<NotificationChannel> failedChannels = channelRepository
                .findByNotificationIdAndStatus(notificationId, ChannelStatus.FAILED);

        int retried = 0;
        for (NotificationChannel channel : failedChannels) {
            try {
                // Retry using domain behavior
                channel.retry();
                channelRepository.save(channel);

                // Attempt to send again
                sendThroughChannel(channel);
                retried++;
            } catch (Exception e) {
                log.error("Error retrying channel {}: {}", channel.getId(), e.getMessage());
            }
        }

        log.info("Retried {} failed channels for notification: {}", retried, notificationId);
        return retried;
    }

    /**
     * Gets all channels for a notification.
     *
     * @param notificationId the notification ID
     * @return list of notification channels
     */
    @Transactional(readOnly = true)
    public List<NotificationChannel> getChannelsByNotification(Long notificationId) {
        return channelRepository.findByNotificationId(notificationId);
    }

    /**
     * Gets channels by status.
     *
     * @param status the channel status
     * @return list of notification channels
     */
    @Transactional(readOnly = true)
    public List<NotificationChannel> getChannelsByStatus(ChannelStatus status) {
        return channelRepository.findByStatus(status);
    }

    /**
     * Gets failed channels for a notification.
     *
     * @param notificationId the notification ID
     * @return list of failed channels
     */
    @Transactional(readOnly = true)
    public List<NotificationChannel> getFailedChannels(Long notificationId) {
        return channelRepository.findByNotificationIdAndStatus(notificationId, ChannelStatus.FAILED);
    }

    /**
     * Marks a specific channel as sent (for testing or manual override).
     *
     * @param channelId the channel ID
     */
    @Transactional
    public void markChannelAsSent(Long channelId) {
        NotificationChannel channel = channelRepository.findById(channelId)
                .orElseThrow(() -> new ResourceNotFoundException("Channel not found"));

        channel.markAsSent();
        channelRepository.save(channel);
        log.info("Channel {} marked as sent", channelId);
    }

    /**
     * Marks a specific channel as failed.
     *
     * @param channelId the channel ID
     * @param errorMessage the error message
     */
    @Transactional
    public void markChannelAsFailed(Long channelId, String errorMessage) {
        NotificationChannel channel = channelRepository.findById(channelId)
                .orElseThrow(() -> new ResourceNotFoundException("Channel not found"));

        channel.markAsFailed(errorMessage);
        channelRepository.save(channel);
        log.info("Channel {} marked as failed: {}", channelId, errorMessage);
    }

    /**
     * Retries a specific channel.
     *
     * @param channelId the channel ID
     */
    @Transactional
    public void retryChannel(Long channelId) {
        NotificationChannel channel = channelRepository.findById(channelId)
                .orElseThrow(() -> new ResourceNotFoundException("Channel not found"));

        channel.retry();
        channelRepository.save(channel);

        // Attempt to send
        sendThroughChannel(channel);
        log.info("Channel {} retried", channelId);
    }

    /**
     * Batch retry all pending channels (for scheduled jobs).
     *
     * @return number of channels processed
     */
    @Transactional
    public int processPendingChannels() {
        log.info("Processing pending channels");

        List<NotificationChannel> pendingChannels = channelRepository
                .findByStatus(ChannelStatus.PENDING);

        int processed = 0;
        for (NotificationChannel channel : pendingChannels) {
            try {
                sendThroughChannel(channel);
                processed++;
            } catch (Exception e) {
                log.error("Error processing pending channel {}: {}", channel.getId(), e.getMessage());
            }
        }

        log.info("Processed {} pending channels", processed);
        return processed;
    }

    /**
     * Gets statistics for notification channels.
     *
     * @param notificationId the notification ID
     * @return channel statistics
     */
    @Transactional(readOnly = true)
    public ChannelStatistics getChannelStatistics(Long notificationId) {
        List<NotificationChannel> channels = channelRepository.findByNotificationId(notificationId);

        long total = channels.size();
        long sent = channels.stream().filter(NotificationChannel::isSent).count();
        long failed = channels.stream().filter(NotificationChannel::hasFailed).count();
        long pending = channels.stream().filter(NotificationChannel::isPending).count();
        long processing = channels.stream().filter(NotificationChannel::isProcessing).count();

        return new ChannelStatistics(total, sent, failed, pending, processing);
    }

    private boolean hasAtLeastOneSuccessfulChannel(List<NotificationChannel> channels) {
        return channels.stream().anyMatch(NotificationChannel::isSent);
    }
    public record ChannelStatistics(
            long total,
            long sent,
            long failed,
            long pending,
            long processing
    ) {}
}