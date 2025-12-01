package vn.uit.lms.shared.dto.request.community.report;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ViolationReportReviewRequest {
    private String note;   // optional - admin ghi chú khi bắt đầu xem xét
}
