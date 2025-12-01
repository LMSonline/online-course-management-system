package vn.uit.lms.shared.dto.request.community.report;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ViolationReportTakeActionRequest {

    private String action; // DELETE_COMMENT, BAN_USER, HIDE_COURSE, HIDE_LESSON

    private String note;   // ghi chú xử lý, optional
}
