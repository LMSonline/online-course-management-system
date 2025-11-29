package vn.uit.lms.shared.dto.response.course.content;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChapterDto {

    private Long id;
    private String title;
    private Integer orderIndex;
//    private List<LessonDto> lessons;
}

