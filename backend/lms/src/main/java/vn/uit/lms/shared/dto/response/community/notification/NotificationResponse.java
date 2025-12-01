package vn.uit.lms.shared.dto.response.community.notification;


import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private String type;
    private String title;
    private String content;
    private Boolean isRead;
    private String referenceType;
    private String referenceId;
    private String deliveredAt;
    private String createdAt;
}
