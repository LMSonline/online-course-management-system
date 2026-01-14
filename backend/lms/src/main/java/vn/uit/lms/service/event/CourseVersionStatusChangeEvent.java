package vn.uit.lms.service.event;

import vn.uit.lms.core.domain.course.CourseVersion;


public record CourseVersionStatusChangeEvent (
    CourseVersion courseVersion,
    String reason
){}



