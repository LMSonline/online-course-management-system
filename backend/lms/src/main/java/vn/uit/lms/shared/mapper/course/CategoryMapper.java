package vn.uit.lms.shared.mapper.course;

import vn.uit.lms.core.domain.course.Category;
import vn.uit.lms.shared.dto.response.course.CategoryResponseDto;

public class CategoryMapper {

    public static CategoryResponseDto toCategoryResponseDto(Category entity) {

        CategoryResponseDto dto = new CategoryResponseDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setCode(entity.getCode());
        dto.setDescription(entity.getDescription());
        dto.setVisible(entity.getVisible());
        dto.setDeletedAt(entity.getDeletedAt());
        dto.setParentId(entity.getParent()!=null ? entity.getParent().getId() : null);

        // SEO fields
        dto.setSlug(entity.getSlug());
        dto.setMetaTitle(entity.getMetaTitle());
        dto.setMetaDescription(entity.getMetaDescription());
        dto.setThumbnailUrl(entity.getThumbnailUrl());

        if (entity.getChildren() != null) {
            entity.getChildren().forEach(child ->
                    dto.getChildren().add(toCategoryResponseDto(child))
            );
        }
        return dto;
    }
}
