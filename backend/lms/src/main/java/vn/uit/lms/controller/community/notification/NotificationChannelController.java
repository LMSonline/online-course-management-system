package vn.uit.lms.controller.community.notification;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.core.domain.community.notification.Notification;
import vn.uit.lms.core.domain.community.notification.NotificationChannel;
import vn.uit.lms.core.repository.community.notification.NotificationChannelRepository;
import vn.uit.lms.core.repository.community.notification.NotificationRepository;
import vn.uit.lms.shared.constant.ChannelStatus;
import vn.uit.lms.shared.constant.ChannelType;
import vn.uit.lms.shared.dto.request.community.notification.NotificationChannelCreateRequest;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.util.annotation.AdminOnly;

import java.util.List;
import java.util.Map;

/**
 * NotificationChannelController - Admin management of notification channels
 *
 * Allows admins to manually create, update, and manage notification channels
 */
@RestController
@RequestMapping("/api/v1/admin/notification-channels")
@RequiredArgsConstructor
@AdminOnly
@Tag(name = "Notification Channel Admin", description = "Admin APIs for notification channel management")
public class NotificationChannelController {

    private final NotificationChannelRepository channelRepository;
    private final NotificationRepository notificationRepository;

    /**
     * POST /admin/notification-channels - Create notification channel
     */
    @Operation(
            summary = "Create notification channel",
            description = "Manually create a notification channel (Admin only)"
    )
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<NotificationChannel> create(
            @Parameter(description = "Channel details")
            @Valid @RequestBody NotificationChannelCreateRequest req) {

        Notification notification = notificationRepository
                .findById(req.getNotificationId())
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        // Use domain factory method
        ChannelType channelType = ChannelType.valueOf(req.getChannel().toUpperCase());
        NotificationChannel channel = NotificationChannel.create(notification, channelType);

        // Note: Status is set to PENDING by factory method
        // If you need different status, modify after creation or add to factory params

        return ResponseEntity.status(HttpStatus.CREATED).body(channelRepository.save(channel));
    }

    /**
     * GET /admin/notification-channels - List all notification channels
     */
    @Operation(
            summary = "List notification channels",
            description = "Get list of all notification channels (Admin only)"
    )
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping
    public ResponseEntity<List<NotificationChannel>> list() {
        return ResponseEntity.ok(channelRepository.findAll());
    }

    /**
     * DELETE /admin/notification-channels/{id} - Delete notification channel
     */
    @Operation(
            summary = "Delete notification channel",
            description = "Delete a notification channel (Admin only)"
    )
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(
            @Parameter(description = "Channel ID") @PathVariable Long id) {

        NotificationChannel channel = channelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Channel not found"));

        channelRepository.delete(channel);
        return ResponseEntity.ok(Map.of("message", "Channel deleted successfully"));
    }
}
