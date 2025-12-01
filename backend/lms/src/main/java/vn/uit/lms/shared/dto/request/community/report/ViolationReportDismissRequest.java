package vn.uit.lms.shared.dto.request.community.report;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ViolationReportDismissRequest {
    private String reason; // lý do bác bỏ
}
