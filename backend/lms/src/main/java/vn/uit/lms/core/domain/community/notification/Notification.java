package vn.uit.lms.core.domain.community.notification;


import jakarta.persistence.*;
import lombok.*;
import vn.uit.lms.core.domain.Account;
import vn.uit.lms.shared.constant.ChannelType;
import vn.uit.lms.shared.entity.BaseEntity;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(access = AccessLevel.PRIVATE)
@Table(name = "notification")
public class Notification extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "recipient_account_id")
    private Account recipient;

    @Column(nullable = false, length = 128)
    private String type;

    @Column(length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "reference_type", length = 64)
    private String referenceType;

    @Column(name = "reference_id", length = 128)
    private String referenceId;

    @Column(name = "is_read")
    private Boolean isRead = false;

    @Column(name = "delivered_at")
    private Instant deliveredAt;

    @OneToMany(mappedBy = "notification", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<NotificationChannel> channels = new ArrayList<>();

    /**
     * Factory method to create a new notification.
     *
     * @param recipient the account that will receive the notification
     * @param type the notification type
     * @param title the notification title
     * @param content the notification content
     * @return a new Notification instance
     */
    public static Notification create(Account recipient, String type, String title, String content) {
        if (recipient == null) {
            throw new IllegalArgumentException("Recipient cannot be null");
        }
        if (type == null || type.isBlank()) {
            throw new IllegalArgumentException("Type cannot be null or empty");
        }

        return Notification.builder()
                .recipient(recipient)
                .type(type)
                .title(title)
                .content(content)
                .isRead(false)
                .channels(new ArrayList<>())
                .build();
    }

    /**
     * Factory method to create a notification with reference information.
     *
     * @param recipient the account that will receive the notification
     * @param type the notification type
     * @param title the notification title
     * @param content the notification content
     * @param referenceType the type of referenced entity
     * @param referenceId the ID of referenced entity
     * @return a new Notification instance
     */
    public static Notification createWithReference(Account recipient, String type, String title,
                                                   String content, String referenceType, String referenceId) {
        Notification notification = create(recipient, type, title, content);
        notification.referenceType = referenceType;
        notification.referenceId = referenceId;
        return notification;
    }

    /**
     * Marks this notification as read.
     */
    public void markAsRead() {
        if (!this.isRead) {
            this.isRead = true;
        }
    }

    /**
     * Marks this notification as unread.
     */
    public void markAsUnread() {
        if (this.isRead) {
            this.isRead = false;
        }
    }

    /**
     * Marks this notification as delivered.
     */
    public void markAsDelivered() {
        if (this.deliveredAt == null) {
            this.deliveredAt = Instant.now();
        }
    }

    /**
     * Adds a notification channel for delivery.
     *
     * @param channelType the type of channel (WEB, EMAIL, SMS, etc.)
     * @return the created NotificationChannel
     */
    public NotificationChannel addChannel(ChannelType channelType) {
        if (channelType == null) {
            throw new IllegalArgumentException("Channel type cannot be null");
        }

        // Check if channel already exists
        boolean channelExists = this.channels.stream()
                .anyMatch(ch -> ch.getChannel() == channelType);

        if (channelExists) {
            throw new IllegalStateException(
                    String.format("Channel %s already exists for this notification", channelType)
            );
        }

        NotificationChannel channel = NotificationChannel.create(this, channelType);
        this.channels.add(channel);
        return channel;
    }

    /**
     * Adds multiple channels at once.
     *
     * @param channelTypes the list of channel types to add
     * @return the list of created NotificationChannels
     */
    public List<NotificationChannel> addChannels(List<ChannelType> channelTypes) {
        if (channelTypes == null || channelTypes.isEmpty()) {
            throw new IllegalArgumentException("Channel types cannot be null or empty");
        }

        List<NotificationChannel> createdChannels = new ArrayList<>();
        for (ChannelType channelType : channelTypes) {
            try {
                NotificationChannel channel = addChannel(channelType);
                createdChannels.add(channel);
            } catch (IllegalStateException e) {
                // Skip if channel already exists
            }
        }
        return createdChannels;
    }

    /**
     * Checks if this notification has been delivered.
     *
     * @return true if delivered, false otherwise
     */
    public boolean isDelivered() {
        return this.deliveredAt != null;
    }

    /**
     * Checks if this notification has a reference.
     *
     * @return true if has reference, false otherwise
     */
    public boolean hasReference() {
        return this.referenceType != null && this.referenceId != null;
    }

    /**
     * Checks if this notification belongs to the specified account.
     *
     * @param account the account to check
     * @return true if belongs to account, false otherwise
     */
    public boolean belongsTo(Account account) {
        return this.recipient != null && this.recipient.equals(account);
    }

    /**
     * Gets the channel by type.
     *
     * @param channelType the channel type
     * @return the NotificationChannel if found, null otherwise
     */
    public NotificationChannel getChannelByType(ChannelType channelType) {
        return this.channels.stream()
                .filter(ch -> ch.getChannel() == channelType)
                .findFirst()
                .orElse(null);
    }

    /**
     * Checks if all channels have been successfully sent.
     *
     * @return true if all channels are sent, false otherwise
     */
    public boolean areAllChannelsSent() {
        if (this.channels.isEmpty()) {
            return false;
        }
        return this.channels.stream().allMatch(NotificationChannel::isSent);
    }

    /**
     * Checks if any channel has failed.
     *
     * @return true if any channel failed, false otherwise
     */
    public boolean hasFailedChannels() {
        return this.channels.stream().anyMatch(NotificationChannel::hasFailed);
    }

    /**
     * Updates the title of this notification.
     *
     * @param newTitle the new title
     */
    public void updateTitle(String newTitle) {
        if (newTitle != null && !newTitle.isBlank()) {
            this.title = newTitle;
        }
    }

    /**
     * Updates the content of this notification.
     *
     * @param newContent the new content
     */
    public void updateContent(String newContent) {
        if (newContent != null && !newContent.isBlank()) {
            this.content = newContent;
        }
    }

    /**
     * Sets the reference for this notification.
     *
     * @param referenceType the type of referenced entity
     * @param referenceId the ID of referenced entity
     */
    public void setReference(String referenceType, String referenceId) {
        if (referenceType == null || referenceType.isBlank()) {
            throw new IllegalArgumentException("Reference type cannot be null or empty");
        }
        if (referenceId == null || referenceId.isBlank()) {
            throw new IllegalArgumentException("Reference ID cannot be null or empty");
        }
        this.referenceType = referenceType;
        this.referenceId = referenceId;
    }

}
