package vn.uit.lms.shared.dto.request.course;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CategoryRequest {

    @NotBlank(message = "Category name is required")
    @Size(max = 255, message = "Name must be at most 255 characters")
    private String name;

    @Size(max = 100, message = "Code must be at most 100 characters")
    private String code;

    @Size(max = 1000, message = "Description must be at most 1000 characters")
    private String description;

    private Long parentId;
    private boolean visible;

    // SEO fields (optional)
    @Size(max = 255)
    private String slug;

    @Size(max = 255)
    private String metaTitle;

    @Size(max = 1000)
    private String metaDescription;

    @Size(max = 512)
    private String thumbnailUrl;
}
