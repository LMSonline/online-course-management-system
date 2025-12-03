package vn.uit.lms.controller.community.notification;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.community.notification.NotificationService;
import vn.uit.lms.shared.dto.request.community.notification.SendBulkNotificationRequest;
import vn.uit.lms.shared.util.annotation.AdminOnly;

@RestController
@RequestMapping("/api/v1/admin/notifications")
@RequiredArgsConstructor
@AdminOnly
public class NotificationAdminController {

    private final NotificationService notificationService;

    @PostMapping("/send-bulk")
    public ResponseEntity<?> sendBulk(@RequestBody SendBulkNotificationRequest req) {
        notificationService.sendBulk(req);
        return ResponseEntity.ok("Notifications sent");
    }
}
