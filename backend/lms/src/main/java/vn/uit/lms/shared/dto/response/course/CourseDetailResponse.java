package vn.uit.lms.shared.dto.response.course;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.uit.lms.shared.constant.Difficulty;
import vn.uit.lms.shared.dto.response.account.AccountResponse;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseDetailResponse {

    private Long id;

    private String title;

    private String shortDescription;

    private Difficulty difficulty;

    private String thumbnailUrl;

    private String slug;
    private String canonicalUrl;

    // SEO
    private String metaTitle;
    private String metaDescription;
    private String seoKeywords;

    private boolean indexed;
    private Boolean isClosed;

    // Relations
    private CategoryDto category;
    private Long teacherId;

    private Long PublicVersionId;

    private List<String> tags;

//    private List<CourseVersionResponse> versions;

    @Data
    public static class CategoryDto {
        private Long id;
        private String name;
        private String code;
        private String description;
    }
}

