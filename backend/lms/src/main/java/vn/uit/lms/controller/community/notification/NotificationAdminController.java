package vn.uit.lms.controller.community.notification;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.community.notification.NotificationService;
import vn.uit.lms.shared.dto.request.community.notification.SendBulkNotificationRequest;
import vn.uit.lms.shared.util.annotation.AdminOnly;

import java.util.Map;

/**
 * NotificationAdminController - Admin-only notification management
 *
 * Handles bulk notification sending and system-wide notification management
 */
@RestController
@RequestMapping("/api/v1/admin/notifications")
@RequiredArgsConstructor
@AdminOnly
@Tag(name = "Notification Admin", description = "Admin APIs for notification management")
public class NotificationAdminController {

    private final NotificationService notificationService;

    /**
     * POST /admin/notifications/send-bulk - Send bulk notifications
     */
    @Operation(
            summary = "Send bulk notifications",
            description = "Send notifications to multiple users at once (Admin only)"
    )
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/send-bulk")
    public ResponseEntity<Map<String, Object>> sendBulk(
            @Parameter(description = "Bulk notification details")
            @Valid @RequestBody SendBulkNotificationRequest req) {

        int sentCount = notificationService.sendBulkNotification(req);

        return ResponseEntity.ok(Map.of(
                "message", "Bulk notifications sent",
                "totalRequested", req.getAccountIds().size(),
                "sentCount", sentCount
        ));
    }
}
