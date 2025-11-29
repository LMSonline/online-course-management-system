package vn.uit.lms.shared.dto.response.course.content;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import vn.uit.lms.shared.constant.LessonType;

@Getter
@Setter
@Builder
public class LessonDTO {
    private Long id;
    private Long chapterId;
    private LessonType type;
    private String title;
    private String shortDescription;
    private String contentUrl;
    private Integer durationSeconds;
    private Integer orderIndex;
}
