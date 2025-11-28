package vn.uit.lms.shared.mapper.course.content;

import vn.uit.lms.core.entity.course.content.Lesson;
import vn.uit.lms.shared.dto.request.course.content.CreateLessonRequest;
import vn.uit.lms.shared.dto.response.course.content.LessonDTO;

public class LessonMapper {

    public static Lesson toEntity(CreateLessonRequest request) {
        return Lesson.builder()
                .type(request.getType())
                .title(request.getTitle())
                .shortDescription(request.getShortDescription())
                .durationSeconds(0)
                .build();
    }

    public static LessonDTO toResponse(Lesson lesson) {
        return LessonDTO.builder()
                .id(lesson.getId())
                .chapterId(lesson.getChapter() != null ? lesson.getChapter().getId() : null)
                .type(lesson.getType())
                .title(lesson.getTitle())
                .shortDescription(lesson.getShortDescription())
                .contentUrl(lesson.getContentUrl())
                .durationSeconds(lesson.getDurationSeconds())
                .orderIndex(lesson.getOrderIndex())
                .build();
    }
}

