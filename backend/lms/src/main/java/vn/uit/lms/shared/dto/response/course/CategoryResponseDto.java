package vn.uit.lms.shared.dto.response.course;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class CategoryResponseDto {
    private Long id;
    private String name;
    private String code;
    private String description;
    private Boolean visible;
    private Long parentId;
    private Instant deletedAt;
    private List<CategoryResponseDto> children = new ArrayList<>();

    //SEO support
    private String slug;
    private String metaTitle;
    private String metaDescription;
    private String thumbnailUrl;


}
