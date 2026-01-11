package vn.uit.lms.core.domain.community.notification;

import jakarta.persistence.*;
import lombok.*;
import vn.uit.lms.shared.constant.ChannelStatus;
import vn.uit.lms.shared.constant.ChannelType;
import vn.uit.lms.shared.entity.BaseEntity;

import java.time.Instant;

/**
 * NotificationChannel - Rich Domain Entity
 * Encapsulates notification channel delivery logic and behavior
 */
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder(access = AccessLevel.PRIVATE)
@Table(name = "notification_channel")
public class NotificationChannel extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "notification_id")
    private Notification notification;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChannelType channel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChannelStatus status;

    private Instant sentAt;

    @Column(columnDefinition = "TEXT")
    private String errorMessage;

    /**
     * Factory method to create a new notification channel.
     *
     * @param notification the parent notification
     * @param channelType the type of channel
     * @return a new NotificationChannel instance
     */
    public static NotificationChannel create(Notification notification, ChannelType channelType) {
        if (notification == null) {
            throw new IllegalArgumentException("Notification cannot be null");
        }
        if (channelType == null) {
            throw new IllegalArgumentException("Channel type cannot be null");
        }

        return NotificationChannel.builder()
                .notification(notification)
                .channel(channelType)
                .status(ChannelStatus.PENDING)
                .build();
    }

    /**
     * Marks this channel as sent successfully.
     */
    public void markAsSent() {
        if (this.status == ChannelStatus.SENT) {
            return; // Already sent
        }

        this.status = ChannelStatus.SENT;
        this.sentAt = Instant.now();
        this.errorMessage = null;
    }

    /**
     * Marks this channel as failed with an error message.
     *
     * @param errorMessage the error message describing why it failed
     */
    public void markAsFailed(String errorMessage) {
        this.status = ChannelStatus.FAILED;
        this.errorMessage = errorMessage;
    }

    /**
     * Marks this channel as processing (being sent).
     */
    public void markAsProcessing() {
        if (this.status == ChannelStatus.PENDING) {
            this.status = ChannelStatus.PROCESSING;
        }
    }

    /**
     * Retries sending this channel by resetting to pending status.
     * Only failed channels can be retried.
     *
     * @throws IllegalStateException if channel is not in FAILED status
     */
    public void retry() {
        if (this.status != ChannelStatus.FAILED) {
            throw new IllegalStateException(
                    String.format("Cannot retry channel with status: %s. Only FAILED channels can be retried.",
                            this.status)
            );
        }

        this.status = ChannelStatus.PENDING;
        this.errorMessage = null;
        this.sentAt = null;
    }

    /**
     * Checks if this channel has been sent successfully.
     *
     * @return true if sent, false otherwise
     */
    public boolean isSent() {
        return this.status == ChannelStatus.SENT;
    }

    /**
     * Checks if this channel has failed.
     *
     * @return true if failed, false otherwise
     */
    public boolean hasFailed() {
        return this.status == ChannelStatus.FAILED;
    }

    /**
     * Checks if this channel is pending.
     *
     * @return true if pending, false otherwise
     */
    public boolean isPending() {
        return this.status == ChannelStatus.PENDING;
    }

    /**
     * Checks if this channel is currently being processed.
     *
     * @return true if processing, false otherwise
     */
    public boolean isProcessing() {
        return this.status == ChannelStatus.PROCESSING;
    }

    /**
     * Checks if this channel can be sent (is pending or failed).
     *
     * @return true if can be sent, false otherwise
     */
    public boolean canBeSent() {
        return this.status == ChannelStatus.PENDING || this.status == ChannelStatus.FAILED;
    }

    /**
     * Gets the channel type as a string.
     *
     * @return the channel type name
     */
    public String getChannelTypeName() {
        return this.channel.name();
    }

    /**
     * Checks if this is a web channel.
     *
     * @return true if WEB channel, false otherwise
     */
    public boolean isWebChannel() {
        return this.channel == ChannelType.WEB;
    }

    /**
     * Checks if this is an email channel.
     *
     * @return true if EMAIL channel, false otherwise
     */
    public boolean isEmailChannel() {
        return this.channel == ChannelType.EMAIL;
    }

    /**
     * Checks if this is an SMS channel.
     *
     * @return true if SMS channel, false otherwise
     */
    public boolean isSmsChannel() {
        return this.channel == ChannelType.SMS;
    }

    /**
     * Checks if this is a push notification channel.
     *
     * @return true if PUSH channel, false otherwise
     */
    public boolean isPushChannel() {
        return this.channel == ChannelType.MOBILE_PUSH;
    }
}