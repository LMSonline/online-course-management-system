package vn.uit.lms.service.event;

import lombok.Data;
import vn.uit.lms.core.entity.course.CourseVersion;

@Data
public class CourseVersionStatusChangeEvent {
    private final CourseVersion courseVersion;
    private final String reason;

    public CourseVersionStatusChangeEvent(CourseVersion courseVersion, String reason) {
        this.courseVersion = courseVersion;
        this.reason = reason;
    }

}
