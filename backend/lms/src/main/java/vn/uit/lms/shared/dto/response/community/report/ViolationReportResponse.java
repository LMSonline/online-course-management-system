package vn.uit.lms.shared.dto.response.community.report;

import lombok.Getter;
import lombok.Setter;
import vn.uit.lms.shared.constant.ViolationReportStatus;

@Getter
@Setter
public class ViolationReportResponse {

    private Long id;
    private String reportType;
    private String description;
    private ViolationReportStatus status;
    private String createdAt;  // <<<< Thêm dòng này

    private SimpleUserDto reporter;
    private SimpleUserDto target;

    private SimpleCourseDto course;
    private SimpleLessonDto lesson;
    private SimpleCommentDto comment;

    // --- Nested Simple DTOs ---
    @Getter @Setter
    public static class SimpleUserDto {
        private Long id;
        private String username;
        private String email;
    }

    @Getter @Setter
    public static class SimpleCourseDto {
        private Long id;
        private String title;
    }

    @Getter @Setter
    public static class SimpleLessonDto {
        private Long id;
        private String title;
    }

    @Getter @Setter
    public static class SimpleCommentDto {
        private Long id;
        private String content;
    }
}
