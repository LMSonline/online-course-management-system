package vn.uit.lms.shared.dto.request.course;

import lombok.Data;
import vn.uit.lms.shared.constant.Difficulty;

import java.util.List;

@Data
public class CourseUpdateRequest {

    private String title;

    private String shortDescription;

    private Long categoryId;

    private Long teacherId;

    private Boolean isClosed = false;

    private Difficulty difficulty = Difficulty.BEGINNER;

    private String metaTitle;
    private String metaDescription;
    private String seoKeywords;
    private String thumbnailUrl;

    private Boolean isIndexed = true;

    private List<String> tags;
}
