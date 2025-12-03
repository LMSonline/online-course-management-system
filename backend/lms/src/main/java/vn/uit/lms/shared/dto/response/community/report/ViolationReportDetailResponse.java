package vn.uit.lms.shared.dto.response.community.report;

import lombok.Getter;
import lombok.Setter;
import vn.uit.lms.shared.constant.ViolationReportStatus;

@Getter
@Setter
public class ViolationReportDetailResponse {

    private Long id;
    private String reportType;
    private String description;
    private ViolationReportStatus status;

    private String createdAt;
    private String updatedAt;

    private ViolationReportResponse.SimpleUserDto reporter;
    private ViolationReportResponse.SimpleUserDto target;

    private ViolationReportResponse.SimpleCourseDto course;
    private ViolationReportResponse.SimpleLessonDto lesson;
    private ViolationReportResponse.SimpleCommentDto comment;
}
