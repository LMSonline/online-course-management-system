package vn.uit.lms.shared.mapper.course.content;

import vn.uit.lms.core.entity.course.content.Chapter;
import vn.uit.lms.shared.dto.response.course.content.ChapterDto;

public class ChapterMapper {

    public static ChapterDto toChapterDto(Chapter chapter) {
        return ChapterDto.builder()
                .id(chapter.getId())
                .title(chapter.getTitle())
                .orderIndex(chapter.getOrderIndex())
                .build();
    }


}
