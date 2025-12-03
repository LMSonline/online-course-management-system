package vn.uit.lms.shared.dto.request.community.notification;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotificationChannelCreateRequest {
    private Long notificationId;
    private String channel;
    private String status;
}
