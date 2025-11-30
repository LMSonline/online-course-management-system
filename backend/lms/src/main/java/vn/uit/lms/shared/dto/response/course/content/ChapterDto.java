package vn.uit.lms.shared.dto.response.course.content;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Response DTO for course chapter")
public class ChapterDto {

    @Schema(description = "Chapter ID", example = "1")
    private Long id;

    @Schema(description = "Chapter title", example = "Introduction to Spring Framework")
    private String title;

    @Schema(description = "Order index in the course", example = "1")
    private Integer orderIndex;
}

