package vn.uit.lms.controller.community.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.core.entity.community.notification.Notification;
import vn.uit.lms.service.community.notification.NotificationService;
import vn.uit.lms.shared.dto.PageResponse;
import vn.uit.lms.shared.dto.response.community.notification.NotificationResponse;
import vn.uit.lms.shared.mapper.community.NotificationMapper;
import vn.uit.lms.shared.util.SecurityUtils;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final NotificationMapper notificationMapper; // ⭐ FIXED

    @GetMapping
    public ResponseEntity<?> getList(Pageable pageable) {

        Long accountId = SecurityUtils.getCurrentUserId().orElseThrow();

        PageResponse<Notification> page = notificationService.getMyNotifications(accountId, pageable);

        List<NotificationResponse> mapped = page.getItems()
                .stream()
                .map(notificationMapper::toResponse) // ⭐ FIXED
                .collect(Collectors.toList());

        PageResponse<NotificationResponse> response = PageResponse.<NotificationResponse>builder()
                .items(mapped)
                .page(page.getPage())
                .size(page.getSize())
                .totalItems(page.getTotalItems())
                .totalPages(page.getTotalPages())
                .hasNext(page.isHasNext())
                .hasPrevious(page.isHasPrevious())
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDetail(@PathVariable Long id) {
        Long accountId = SecurityUtils.getCurrentUserId().orElseThrow();
        Notification n = notificationService.get(id, accountId);
        return ResponseEntity.ok(notificationMapper.toResponse(n)); // ⭐ FIXED
    }

    @PostMapping("/{id}/mark-read")
    public ResponseEntity<?> markRead(@PathVariable Long id) {
        Long acc = SecurityUtils.getCurrentUserId().orElseThrow();
        notificationService.markRead(id, acc); // ⭐ FIXED
        return ResponseEntity.ok("Marked as read");
    }

    @PostMapping("/mark-all-read")
    public ResponseEntity<?> markAllRead() {
        Long acc = SecurityUtils.getCurrentUserId().orElseThrow();
        notificationService.markAllRead(acc); // ⭐ FIXED
        return ResponseEntity.ok("All marked read");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Long acc = SecurityUtils.getCurrentUserId().orElseThrow();
        notificationService.delete(id, acc); // ⭐ FIXED
        return ResponseEntity.ok("Deleted");
    }

    @GetMapping("/count-unread")
    public ResponseEntity<?> countUnread() {
        Long acc = SecurityUtils.getCurrentUserId().orElseThrow();
        return ResponseEntity.ok(notificationService.countUnread(acc)); // ⭐ FIXED
    }
}
