package vn.uit.lms.shared.dto.request.course.content;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ChapterReorderRequest {

    @NotNull
    @Min(1)
    private Integer newPosition;


}
