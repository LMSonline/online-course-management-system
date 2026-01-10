package vn.uit.lms.service.community.notification;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.domain.Account;
import vn.uit.lms.core.domain.community.notification.Notification;
import vn.uit.lms.core.repository.AccountRepository;
import vn.uit.lms.core.repository.community.notification.NotificationRepository;
import vn.uit.lms.shared.constant.ChannelType;
import vn.uit.lms.shared.dto.PageResponse;
import vn.uit.lms.shared.dto.request.community.notification.SendBulkNotificationRequest;
import vn.uit.lms.shared.exception.ResourceNotFoundException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;
    private final AccountRepository accountRepository;
    private final NotificationChannelService notificationChannelService;

    public NotificationService(NotificationRepository notificationRepository,
                               AccountRepository accountRepository,
                               NotificationChannelService notificationChannelService) {
        this.notificationRepository = notificationRepository;
        this.accountRepository = accountRepository;
        this.notificationChannelService = notificationChannelService;
    }

    /**
     * Creates and sends a notification to a recipient.
     *
     * @param recipientId the ID of the recipient account
     * @param type the notification type
     * @param title the notification title
     * @param content the notification content
     * @param channels the list of channels to send through
     * @return the created Notification
     */
    @Transactional
    public Notification createAndSendNotification(Long recipientId, String type, String title,
                                                  String content, List<ChannelType> channels) {
        log.info("Creating notification for recipient: {}, type: {}", recipientId, type);

        Account recipient = accountRepository.findById(recipientId)
                .orElseThrow(() -> new ResourceNotFoundException("Recipient account not found"));

        // Create notification using domain behavior
        Notification notification = Notification.create(recipient, type, title, content);

        // Add channels using domain behavior
        notification.addChannels(channels);

        // Save notification with channels
        Notification saved = notificationRepository.save(notification);

        // Send through all channels asynchronously
        notificationChannelService.sendThroughAllChannels(saved);

        log.info("Notification created and queued for delivery: id={}", saved.getId());
        return saved;
    }

    /**
     * Creates and sends a notification with reference information.
     *
     * @param recipientId the ID of the recipient account
     * @param type the notification type
     * @param title the notification title
     * @param content the notification content
     * @param referenceType the type of referenced entity
     * @param referenceId the ID of referenced entity
     * @param channels the list of channels to send through
     * @return the created Notification
     */
    @Transactional
    public Notification createNotificationWithReference(Long recipientId, String type, String title,
                                                        String content, String referenceType,
                                                        String referenceId, List<ChannelType> channels) {
        log.info("Creating notification with reference for recipient: {}, type: {}, ref: {}:{}",
                recipientId, type, referenceType, referenceId);

        Account recipient = accountRepository.findById(recipientId)
                .orElseThrow(() -> new ResourceNotFoundException("Recipient account not found"));

        // Create notification with reference using domain behavior
        Notification notification = Notification.createWithReference(
                recipient, type, title, content, referenceType, referenceId
        );

        // Add channels
        notification.addChannels(channels);

        // Save and send
        Notification saved = notificationRepository.save(notification);
        notificationChannelService.sendThroughAllChannels(saved);

        log.info("Notification with reference created: id={}", saved.getId());
        return saved;
    }

    /**
     * Marks a notification as read.
     *
     * @param notificationId the notification ID
     * @param accountId the account ID (for authorization check)
     * @throws ResourceNotFoundException if notification not found
     * @throws IllegalStateException if notification doesn't belong to account
     */
    @Transactional
    public void markAsRead(Long notificationId, Long accountId) {
        log.info("Marking notification as read: id={}, account={}", notificationId, accountId);

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        // Check ownership using domain behavior
        if (!notification.belongsTo(account)) {
            throw new IllegalStateException("Notification does not belong to this account");
        }

        // Mark as read using domain behavior
        notification.markAsRead();
        notificationRepository.save(notification);

        log.info("Notification marked as read: id={}", notificationId);
    }

    /**
     * Marks multiple notifications as read.
     *
     * @param notificationIds the list of notification IDs
     * @param accountId the account ID (for authorization check)
     */
    @Transactional
    public void markMultipleAsRead(List<Long> notificationIds, Long accountId) {
        log.info("Marking {} notifications as read for account: {}", notificationIds.size(), accountId);

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        List<Notification> notifications = notificationRepository.findAllById(notificationIds);

        int marked = 0;
        for (Notification notification : notifications) {
            if (notification.belongsTo(account) && !notification.getIsRead()) {
                notification.markAsRead();
                marked++;
            }
        }

        notificationRepository.saveAll(notifications);
        log.info("Marked {} notifications as read", marked);
    }

    /**
     * Marks all notifications as read for a user.
     *
     * @param accountId the account ID
     */
    @Transactional
    public void markAllAsRead(Long accountId) {
        log.info("Marking all notifications as read for account: {}", accountId);

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        List<Notification> unreadNotifications = notificationRepository.findByRecipientAndIsReadFalse(account);

        for (Notification notification : unreadNotifications) {
            notification.markAsRead();
        }

        notificationRepository.saveAll(unreadNotifications);
        log.info("Marked {} notifications as read", unreadNotifications.size());
    }

    /**
     * Gets all notifications for a user.
     *
     * @param accountId the account ID
     * @param pageable pagination information
     * @return page of notifications
     */
    @Transactional(readOnly = true)
    public Page<Notification> getUserNotifications(Long accountId, Pageable pageable) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        return notificationRepository.findByRecipientOrderByCreatedAtDesc(account, pageable);
    }

    /**
     * Gets unread notifications for a user.
     *
     * @param accountId the account ID
     * @param pageable pagination information
     * @return page of unread notifications
     */
    @Transactional(readOnly = true)
    public Page<Notification> getUnreadNotifications(Long accountId, Pageable pageable) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        return notificationRepository.findByRecipientAndIsReadFalseOrderByCreatedAtDesc(account, pageable);
    }

    /**
     * Gets the count of unread notifications for a user.
     *
     * @param accountId the account ID
     * @return count of unread notifications
     */
    @Transactional(readOnly = true)
    public long getUnreadCount(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        return notificationRepository.countByRecipientAndIsReadFalse(account);
    }

    /**
     * Deletes a notification.
     *
     * @param notificationId the notification ID
     * @param accountId the account ID (for authorization check)
     */
    @Transactional
    public void deleteNotification(Long notificationId, Long accountId) {
        log.info("Deleting notification: id={}, account={}", notificationId, accountId);

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        // Check ownership
        if (!notification.belongsTo(account)) {
            throw new IllegalStateException("Notification does not belong to this account");
        }

        notificationRepository.delete(notification);
        log.info("Notification deleted: id={}", notificationId);
    }

    /**
     * Deletes old read notifications (cleanup job).
     *
     * @param daysOld number of days old to consider for deletion
     * @return number of deleted notifications
     */
    @Transactional
    public int deleteOldReadNotifications(int daysOld) {
        log.info("Deleting read notifications older than {} days", daysOld);

        Instant cutoffDate = Instant.now().minus(daysOld, ChronoUnit.DAYS);
        List<Notification> oldNotifications = notificationRepository
                .findByIsReadTrueAndCreatedAtBefore(cutoffDate);

        int count = oldNotifications.size();
        notificationRepository.deleteAll(oldNotifications);

        log.info("Deleted {} old read notifications", count);
        return count;
    }

    /**
     * Gets notifications by type for a user.
     *
     * @param accountId the account ID
     * @param type the notification type
     * @param pageable pagination information
     * @return page of notifications
     */
    @Transactional(readOnly = true)
    public Page<Notification> getNotificationsByType(Long accountId, String type, Pageable pageable) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        return notificationRepository.findByRecipientAndTypeOrderByCreatedAtDesc(account, type, pageable);
    }

    /**
     * Gets notifications by reference.
     *
     * @param referenceType the reference type
     * @param referenceId the reference ID
     * @return list of notifications
     */
    @Transactional(readOnly = true)
    public List<Notification> getNotificationsByReference(String referenceType, String referenceId) {
        return notificationRepository.findByReferenceTypeAndReferenceId(referenceType, referenceId);
    }

    /**
     * Sends bulk notifications to multiple recipients.
     * Used by admins to broadcast notifications.
     *
     * @param request the bulk notification request
     * @return number of notifications sent
     */
    @Transactional
    public int sendBulkNotification(SendBulkNotificationRequest request) {
        log.info("Sending bulk notification to {} recipients", request.getAccountIds().size());

        if (request.getAccountIds() == null || request.getAccountIds().isEmpty()) {
            throw new IllegalArgumentException("Account IDs cannot be empty");
        }

        int sentCount = 0;
        List<ChannelType> defaultChannels = List.of(ChannelType.WEB, ChannelType.EMAIL);

        for (Long recipientId : request.getAccountIds()) {
            try {
                createAndSendNotification(
                        recipientId,
                        request.getType(),
                        request.getTitle(),
                        request.getContent(),
                        defaultChannels
                );
                sentCount++;
            } catch (Exception e) {
                log.error("Failed to send notification to recipient {}: {}", recipientId, e.getMessage());
                // Continue with next recipient
            }
        }

        log.info("Sent {} out of {} bulk notifications", sentCount, request.getAccountIds().size());
        return sentCount;
    }

}
