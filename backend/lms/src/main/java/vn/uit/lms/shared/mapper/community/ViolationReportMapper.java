package vn.uit.lms.shared.mapper.community;
import vn.uit.lms.core.entity.community.report.ViolationReport;
import vn.uit.lms.shared.dto.response.community.report.ViolationReportDetailResponse;
import vn.uit.lms.shared.dto.response.community.report.ViolationReportResponse;

public class ViolationReportMapper {

    public static ViolationReportResponse toResponse(ViolationReport vr) {
        if (vr == null) return null;

        ViolationReportResponse dto = new ViolationReportResponse();

        dto.setId(vr.getId());
        dto.setReportType(vr.getReportType());
        dto.setDescription(vr.getDescription());
        dto.setStatus(vr.getStatus());
        dto.setCreatedAt(vr.getCreatedAt().toString());

        // Reporter
        if (vr.getReporter() != null) {
            var u = new ViolationReportResponse.SimpleUserDto();
            u.setId(vr.getReporter().getId());
            u.setUsername(vr.getReporter().getUsername());
            u.setEmail(vr.getReporter().getEmail());
            dto.setReporter(u);
        }

        // Target
        if (vr.getTarget() != null) {
            var u = new ViolationReportResponse.SimpleUserDto();
            u.setId(vr.getTarget().getId());
            u.setUsername(vr.getTarget().getUsername());
            u.setEmail(vr.getTarget().getEmail());
            dto.setTarget(u);
        }

        // Course
        if (vr.getCourse() != null) {
            var c = new ViolationReportResponse.SimpleCourseDto();
            c.setId(vr.getCourse().getId());
            c.setTitle(vr.getCourse().getTitle());
            dto.setCourse(c);
        }

        // Lesson
        if (vr.getLesson() != null) {
            var l = new ViolationReportResponse.SimpleLessonDto();
            l.setId(vr.getLesson().getId());
            l.setTitle(vr.getLesson().getTitle());
            dto.setLesson(l);
        }

        // Comment
        if (vr.getComment() != null) {
            var c = new ViolationReportResponse.SimpleCommentDto();
            c.setId(vr.getComment().getId());
            c.setContent(vr.getComment().getContent());
            dto.setComment(c);
        }

        return dto;
    }

    public static ViolationReportDetailResponse toDetail(ViolationReport vr) {
        if (vr == null) return null;

        ViolationReportDetailResponse d = new ViolationReportDetailResponse();
        d.setId(vr.getId());
        d.setReportType(vr.getReportType());
        d.setDescription(vr.getDescription());
        d.setStatus(vr.getStatus());
        d.setCreatedAt(vr.getCreatedAt() != null ? vr.getCreatedAt().toString() : null);
        d.setUpdatedAt(vr.getUpdatedAt() != null ? vr.getUpdatedAt().toString() : null);


        d.setReporter(toResponse(vr).getReporter());
        d.setTarget(toResponse(vr).getTarget());
        d.setCourse(toResponse(vr).getCourse());
        d.setLesson(toResponse(vr).getLesson());
        d.setComment(toResponse(vr).getComment());

        return d;
    }
}
