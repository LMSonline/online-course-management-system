package vn.uit.lms.shared.mapper.community;

import org.springframework.stereotype.Component;
import vn.uit.lms.core.domain.community.notification.Notification;
import vn.uit.lms.shared.dto.response.community.notification.NotificationResponse;

@Component
public class NotificationMapper {

    public NotificationResponse toResponse(Notification e) {
        if (e == null) return null;

        return NotificationResponse.builder()
                .id(e.getId())
                .type(e.getType())
                .title(e.getTitle())
                .content(e.getContent())
                .isRead(e.getIsRead())
                .referenceType(e.getReferenceType())
                .referenceId(e.getReferenceId())
                .deliveredAt(e.getDeliveredAt() != null ? e.getDeliveredAt().toString() : null)
                .createdAt(e.getCreatedAt() != null ? e.getCreatedAt().toString() : null)
                .build();
    }
}
