package vn.uit.lms.shared.dto.response.course.content;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import vn.uit.lms.shared.constant.LessonType;
import vn.uit.lms.shared.constant.VideoStatus;

@Getter
@Setter
@Builder
@Schema(description = "Response DTO for lesson information")
public class LessonDTO {
    @Schema(description = "Lesson ID", example = "1")
    private Long id;

    @Schema(description = "Chapter ID this lesson belongs to", example = "5")
    private Long chapterId;

    @Schema(description = "Type of lesson", example = "VIDEO")
    private LessonType type;

    @Schema(description = "Lesson title", example = "Spring Boot Basics")
    private String title;

    @Schema(description = "Short description", example = "Learn the fundamentals of Spring Boot")
    private String shortDescription;

    @Schema(description = "Video object key in storage (for video lessons)", example = "videos/spring-boot-basics.mp4")
    private String videoObjectKey;

    @Schema(description = "Status of the video processing (for video lessons)", example = "READY")
    private VideoStatus videoStatus;

    @Schema(description = "Indicates if the lesson is a preview", example = "true")
    private Boolean isPreview ;

    @Schema(description = "Duration in seconds (for video lessons)", example = "1800")
    private Integer durationSeconds;

    @Schema(description = "Order index in the chapter", example = "1")
    private Integer orderIndex;
}
