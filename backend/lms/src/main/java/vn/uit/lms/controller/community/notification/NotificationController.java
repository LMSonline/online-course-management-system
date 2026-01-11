package vn.uit.lms.controller.community.notification;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.core.domain.community.notification.Notification;
import vn.uit.lms.service.community.notification.NotificationService;
import vn.uit.lms.shared.dto.PageResponse;
import vn.uit.lms.shared.dto.response.community.notification.NotificationResponse;
import vn.uit.lms.shared.mapper.community.NotificationMapper;
import vn.uit.lms.shared.util.SecurityUtils;
import vn.uit.lms.shared.util.annotation.Authenticated;

import java.util.List;
import java.util.Map;

/**
 * NotificationController - Thin controller for user notification management
 *
 * Handles notification viewing, reading, and deletion for end users
 */
@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@Authenticated
@Tag(name = "Notification Management", description = "APIs for managing user notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final NotificationMapper notificationMapper;

    /**
     * GET /notifications - Get paginated list of notifications
     */
    @Operation(
            summary = "Get notifications",
            description = "Get paginated list of notifications for current user"
    )
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping
    public ResponseEntity<PageResponse<NotificationResponse>> getList(
            @Parameter(hidden = true) Pageable pageable) {

        Long accountId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new IllegalStateException("User not authenticated"));

        Page<Notification> page = notificationService.getUserNotifications(accountId, pageable);

        List<NotificationResponse> mapped = page.getContent()
                .stream()
                .map(notificationMapper::toResponse)
                .toList();

        PageResponse<NotificationResponse> response = PageResponse.<NotificationResponse>builder()
                .items(mapped)
                .page(page.getNumber())
                .size(page.getSize())
                .totalItems(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .hasNext(page.hasNext())
                .hasPrevious(page.hasPrevious())
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * GET /notifications/{id} - Get notification details
     */
    @Operation(
            summary = "Get notification details",
            description = "Get detailed information about a specific notification"
    )
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{id}")
    public ResponseEntity<NotificationResponse> getDetail(
            @Parameter(description = "Notification ID") @PathVariable Long id) {

        Long accountId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new IllegalStateException("User not authenticated"));

        // Get notifications page with just this one ID to verify ownership
        Page<Notification> page = notificationService.getUserNotifications(accountId, Pageable.unpaged());
        Notification notification = page.getContent().stream()
                .filter(n -> n.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Notification not found or access denied"));

        return ResponseEntity.ok(notificationMapper.toResponse(notification));
    }

    /**
     * POST /notifications/{id}/mark-read - Mark notification as read
     */
    @Operation(
            summary = "Mark notification as read",
            description = "Mark a specific notification as read"
    )
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/{id}/mark-read")
    public ResponseEntity<Map<String, String>> markRead(
            @Parameter(description = "Notification ID") @PathVariable Long id) {

        Long accountId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new IllegalStateException("User not authenticated"));

        notificationService.markAsRead(id, accountId);
        return ResponseEntity.ok(Map.of("message", "Notification marked as read"));
    }

    /**
     * POST /notifications/mark-all-read - Mark all notifications as read
     */
    @Operation(
            summary = "Mark all notifications as read",
            description = "Mark all unread notifications as read for current user"
    )
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/mark-all-read")
    public ResponseEntity<Map<String, String>> markAllRead() {
        Long accountId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new IllegalStateException("User not authenticated"));

        notificationService.markAllAsRead(accountId);
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }

    /**
     * DELETE /notifications/{id} - Delete notification
     */
    @Operation(
            summary = "Delete notification",
            description = "Delete a specific notification"
    )
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(
            @Parameter(description = "Notification ID") @PathVariable Long id) {

        Long accountId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new IllegalStateException("User not authenticated"));

        notificationService.deleteNotification(id, accountId);
        return ResponseEntity.ok(Map.of("message", "Notification deleted"));
    }

    /**
     * GET /notifications/count-unread - Get count of unread notifications
     */
    @Operation(
            summary = "Get unread count",
            description = "Get the count of unread notifications for current user"
    )
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/count-unread")
    public ResponseEntity<Map<String, Long>> countUnread() {
        Long accountId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new IllegalStateException("User not authenticated"));

        long count = notificationService.getUnreadCount(accountId);
        return ResponseEntity.ok(Map.of("count", count));
    }
}
