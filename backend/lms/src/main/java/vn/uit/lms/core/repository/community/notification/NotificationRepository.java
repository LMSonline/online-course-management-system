package vn.uit.lms.core.repository.community.notification;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.uit.lms.core.entity.community.notification.Notification;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientIdOrderByCreatedAtDesc(Long accountId);

    long countByRecipientIdAndIsReadFalse(Long accountId);
}
