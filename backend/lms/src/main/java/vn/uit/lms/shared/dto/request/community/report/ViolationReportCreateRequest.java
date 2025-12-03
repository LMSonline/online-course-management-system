package vn.uit.lms.shared.dto.request.community.report;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ViolationReportCreateRequest {

    private Long targetAccountId;  // ai bị report (có thể null nếu report course/lesson/comment)
    private Long courseId;         // optional
    private Long lessonId;         // optional
    private Long commentId;        // optional

    private String reportType;     // VD: "SPAM", "HARASSMENT", "VIOLENCE", "COPYRIGHT"
    private String description;    // mô tả chi tiết
}
