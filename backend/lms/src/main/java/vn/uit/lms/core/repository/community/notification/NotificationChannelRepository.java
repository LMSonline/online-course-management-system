package vn.uit.lms.core.repository.community.notification;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.uit.lms.core.domain.community.notification.NotificationChannel;
import vn.uit.lms.shared.constant.ChannelStatus;

import java.util.List;

public interface NotificationChannelRepository extends JpaRepository<NotificationChannel, Long> {
    List<NotificationChannel> findByNotificationId(Long notificationId);

    // Find by status
    List<NotificationChannel> findByStatus(ChannelStatus status);

    // Find by notification and status
    List<NotificationChannel> findByNotificationIdAndStatus(Long notificationId, ChannelStatus status);
}
