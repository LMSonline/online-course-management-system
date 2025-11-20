package vn.uit.lms.shared.dto.response.course;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.uit.lms.shared.constant.Difficulty;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseResponse {

    private Long id;

    private String title;

    private String shortDescription;

    private Difficulty difficulty;

    private String thumbnailUrl;

    private String slug;

    private Boolean isClosed;

    private Long categoryId;
    private String categoryName;

    private Long teacherId;
    private String teacherName;

    private Long lastVersionId;
    private Integer versionNumber;
}

