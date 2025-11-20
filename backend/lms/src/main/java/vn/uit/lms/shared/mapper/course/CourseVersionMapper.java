package vn.uit.lms.shared.mapper.course;

import vn.uit.lms.core.entity.course.CourseVersion;
import vn.uit.lms.shared.dto.response.course.CourseVersionResponse;

public class CourseVersionMapper {

    public static CourseVersionResponse toCourseVersionResponse(CourseVersion version) {
        if (version == null) return null;

        return CourseVersionResponse.builder()
                .id(version.getId())
                .courseId(version.getCourse() != null ? version.getCourse().getId() : null)
                .versionNumber(version.getVersionNumber())
                .title(version.getTitle())
                .description(version.getDescription())
                .price(version.getPrice())
                .durationDays(version.getDurationDays())
                .passScore(version.getPassScore())
                .finalWeight(version.getFinalWeight())
                .minProgressPct(version.getMinProgressPct())
                .status(version.getStatus())
                .notes(version.getNotes())
                .approvedBy(version.getApprovedBy())
                .approvedAt(version.getApprovedAt())
                .publishedAt(version.getPublishedAt())
                .chapterCount(version.getChapters() != null ? version.getChapters().size() : 0)
                .build();
    }
}
