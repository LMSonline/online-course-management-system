package vn.uit.lms.shared.mapper;

import org.springframework.stereotype.Component;
import vn.uit.lms.core.domain.learning.Progress;
import vn.uit.lms.shared.dto.response.progress.LessonProgressResponse;

@Component
public class ProgressMapper {

    public LessonProgressResponse toLessonProgressResponse(Progress progress) {
        if (progress == null) {
            return null;
        }

        return LessonProgressResponse.builder()
                .id(progress.getId())
                .lessonId(progress.getLesson() != null ? progress.getLesson().getId() : null)
                .lessonTitle(progress.getLesson() != null ? progress.getLesson().getTitle() : null)
                .lessonType(progress.getLesson() != null && progress.getLesson().getType() != null
                        ? progress.getLesson().getType().name() : null)
                .lessonDurationSeconds(progress.getLesson() != null ? progress.getLesson().getDurationSeconds() : null)
                .status(progress.getStatus())
                .viewedAt(progress.getViewedAt())
                .timesViewed(progress.getTimesViewed())
                .watchedDurationSeconds(progress.getWatchedDurationSeconds())
                .watchedPercentage(progress.getWatchedPercentage())
                .completedAt(progress.getCompletedAt())
                .isBookmarked(progress.getIsBookmarked())
                .notes(progress.getNotes())
                .build();
    }
}

