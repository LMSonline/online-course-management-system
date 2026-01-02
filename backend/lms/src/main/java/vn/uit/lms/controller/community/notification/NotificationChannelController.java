package vn.uit.lms.controller.community.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.core.domain.community.notification.Notification;
import vn.uit.lms.core.domain.community.notification.NotificationChannel;
import vn.uit.lms.core.repository.community.notification.NotificationChannelRepository;
import vn.uit.lms.core.repository.community.notification.NotificationRepository;
import vn.uit.lms.shared.constant.ChannelStatus;
import vn.uit.lms.shared.constant.ChannelType;
import vn.uit.lms.shared.dto.request.community.notification.NotificationChannelCreateRequest;
import vn.uit.lms.shared.util.annotation.AdminOnly;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/notification-channels")
@RequiredArgsConstructor
@AdminOnly
public class NotificationChannelController {

//    private final NotificationChannelRepository channelRepository;
//    private final NotificationRepository notificationRepository;
//
//    @PostMapping
//    public ResponseEntity<NotificationChannel> create(@RequestBody NotificationChannelCreateRequest req) {
//
//        NotificationChannel channel = new NotificationChannel();
//
//        Notification notification = notificationRepository
//                .findById(req.getNotificationId())
//                .orElseThrow(() -> new RuntimeException("Notification not found"));
//
//        channel.setNotification(notification);
//        channel.setChannel(ChannelType.valueOf(req.getChannel()));
//        channel.setStatus(ChannelStatus.valueOf(req.getStatus()));
//
//        return ResponseEntity.ok(channelRepository.save(channel));
//    }
//
//    @GetMapping
//    public ResponseEntity<List<NotificationChannel>> list() {
//        return ResponseEntity.ok(channelRepository.findAll());
//    }
//
//    @PutMapping("/{id}")
//    public ResponseEntity<NotificationChannel> update(@PathVariable Long id,
//                                    @RequestBody NotificationChannelCreateRequest req) {
//
//        NotificationChannel channel = channelRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Channel not found"));
//
//        Notification notification = notificationRepository
//                .findById(req.getNotificationId())
//                .orElseThrow(() -> new RuntimeException("Notification not found"));
//
//        // Update fields
//        channel.setNotification(notification);
//        channel.setChannel(ChannelType.valueOf(req.getChannel()));
//        channel.setStatus(ChannelStatus.valueOf(req.getStatus()));
//
//        return ResponseEntity.ok(channelRepository.save(channel));
//    }

}
