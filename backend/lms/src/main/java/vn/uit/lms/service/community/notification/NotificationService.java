package vn.uit.lms.service.community.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import vn.uit.lms.core.entity.community.notification.Notification;
import vn.uit.lms.core.repository.AccountRepository;
import vn.uit.lms.core.repository.community.notification.NotificationRepository;
import vn.uit.lms.shared.dto.PageResponse;
import vn.uit.lms.shared.dto.request.community.notification.SendBulkNotificationRequest;
import vn.uit.lms.shared.exception.ResourceNotFoundException;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final AccountRepository accountRepository;

    public PageResponse<Notification> getMyNotifications(Long accountId, Pageable pageable) {

        // ⭐ Lấy hết notification của user
        List<Notification> all = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(accountId);

        // ⭐ Tính toán phân trang thủ công
        int page = pageable.getPageNumber();
        int size = pageable.getPageSize();
        int start = page * size;
        int end = Math.min(start + size, all.size());

        List<Notification> items =
                (start < all.size()) ? all.subList(start, end) : List.of();

        return PageResponse.<Notification>builder()
                .items(items)
                .page(page)
                .size(size)
                .totalItems(all.size())
                .totalPages((int) Math.ceil((double) all.size() / size))
                .hasNext(end < all.size())
                .hasPrevious(page > 0)
                .build();
    }

    public Notification get(Long id, Long accountId) {
        return notificationRepository.findById(id)
                .filter(n -> n.getRecipient().getId().equals(accountId))
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
    }

    public void markRead(Long id, Long accountId) {
        Notification noti = get(id, accountId);
        noti.setIsRead(true);
        notificationRepository.save(noti);
    }

    public void markAllRead(Long accountId) {
        List<Notification> list = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(accountId);
        list.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(list);
    }

    public void delete(Long id, Long accountId) {
        Notification noti = get(id, accountId);
        noti.setDeletedAt(Instant.now());
        notificationRepository.save(noti);
    }

    public long countUnread(Long accountId) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(accountId);
    }

    public void sendBulk(SendBulkNotificationRequest req) {

        for (Long accId : req.getAccountIds()) {
            Notification n = new Notification();
            n.setType(req.getType());
            n.setTitle(req.getTitle());
            n.setContent(req.getContent());
            n.setRecipient(accountRepository.getReferenceById(accId));
            notificationRepository.save(n);
        }
    }

}
