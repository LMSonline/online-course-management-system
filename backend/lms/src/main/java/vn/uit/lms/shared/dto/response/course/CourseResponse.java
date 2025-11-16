package vn.uit.lms.shared.dto.response.course;

import lombok.Data;
import vn.uit.lms.shared.constant.Difficulty;

@Data
public class CourseResponse {

    private Long id;

    private String code;

    private String title;

    private String shortDescription;

    private Difficulty difficulty;

    private String thumbnailUrl;

    private String slug;

    private boolean isClosed;

    private Long categoryId;
    private String categoryName;

    private Long teacherId;
    private String teacherName;
}

