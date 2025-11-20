package vn.uit.lms.service.event;

import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import vn.uit.lms.service.MailService;

@Component
@RequiredArgsConstructor
public class CourseStatusChangeListener {

    private final MailService mailService;

    @Async
    @EventListener
    public void handleCourseStatusChange(CourseVersionStatusChangeEvent event) {
        mailService.sendCourseStatusEmail(event.getCourseVersion(), event.getReason());

    }
}
