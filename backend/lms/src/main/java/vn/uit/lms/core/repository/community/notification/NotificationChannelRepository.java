package vn.uit.lms.core.repository.community.notification;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.uit.lms.core.entity.community.notification.NotificationChannel;

import java.util.List;

public interface NotificationChannelRepository extends JpaRepository<NotificationChannel, Long> {
    List<NotificationChannel> findByNotificationId(Long notificationId);
}
