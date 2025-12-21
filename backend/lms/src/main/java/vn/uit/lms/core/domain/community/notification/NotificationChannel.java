package vn.uit.lms.core.domain.community.notification;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import vn.uit.lms.shared.constant.ChannelStatus;
import vn.uit.lms.shared.constant.ChannelType;
import vn.uit.lms.shared.entity.BaseEntity;

import java.time.Instant;

@Entity
@Getter
@Setter
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
    private ChannelType channel = ChannelType.WEB;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChannelStatus status = ChannelStatus.PENDING;

    private Instant sentAt;

    @Column(columnDefinition = "TEXT")
    private String errorMessage;
}
