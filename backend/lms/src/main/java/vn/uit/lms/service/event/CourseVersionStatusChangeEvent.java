package vn.uit.lms.service.event;

import lombok.Data;
import vn.uit.lms.core.entity.course.CourseVersion;


public record CourseVersionStatusChangeEvent (
    CourseVersion courseVersion,
    String reason
){}
