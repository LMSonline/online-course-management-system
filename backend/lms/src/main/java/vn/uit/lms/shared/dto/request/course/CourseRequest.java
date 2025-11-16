package vn.uit.lms.shared.dto.request.course;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import vn.uit.lms.shared.constant.Difficulty;

import java.util.List;

@Data
public class CourseRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String shortDescription;

    @NotNull
    private Long categoryId;

    //account id of teacher -> teacherId
    @NotNull
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

