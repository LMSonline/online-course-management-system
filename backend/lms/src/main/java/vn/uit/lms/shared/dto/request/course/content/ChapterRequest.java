package vn.uit.lms.shared.dto.request.course.content;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ChapterRequest {

    @NotBlank
    private String title;

}
