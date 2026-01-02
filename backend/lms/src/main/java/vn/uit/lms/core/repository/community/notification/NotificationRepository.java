package vn.uit.lms.core.repository.community.notification;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.uit.lms.core.domain.Account;
import vn.uit.lms.core.domain.community.notification.Notification;

import java.time.Instant;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    // Find by recipient
    Page<Notification> findByRecipientOrderByCreatedAtDesc(Account recipient, Pageable pageable);

    // Find unread notifications
    Page<Notification> findByRecipientAndIsReadFalseOrderByCreatedAtDesc(Account recipient, Pageable pageable);

    List<Notification> findByRecipientAndIsReadFalse(Account recipient);

    // Count unread
    long countByRecipientAndIsReadFalse(Account recipient);

    // Find by type
    Page<Notification> findByRecipientAndTypeOrderByCreatedAtDesc(Account recipient, String type, Pageable pageable);

    // Find by reference
    List<Notification> findByReferenceTypeAndReferenceId(String referenceType, String referenceId);

    // Find old read notifications for cleanup
    List<Notification> findByIsReadTrueAndCreatedAtBefore(Instant cutoffDate);
}
