package vn.uit.lms.shared.dto.request.course.content;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import vn.uit.lms.shared.constant.LessonType;

@Getter
@Setter
public class CreateLessonRequest {

    @NotNull(message = "Lesson type is required")
    private LessonType type;

    @NotBlank(message = "Title is required")
    private String title;

    private String shortDescription;

}

