package vn.uit.lms.shared.dto.request.community.notification;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SendBulkNotificationRequest {
    private List<Long> accountIds;
    private String type;
    private String title;
    private String content;
}
