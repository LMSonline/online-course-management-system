package vn.uit.lms.service.course;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.entity.course.Category;
import vn.uit.lms.core.repository.course.CategoryRepository;
import vn.uit.lms.shared.dto.request.course.CategoryRequest;
import vn.uit.lms.shared.dto.response.course.CategoryResponseDto;
import vn.uit.lms.shared.exception.DuplicateResourceException;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.course.CategoryMapper;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    private String normalizeCode(String code) {
        return code != null ? code.trim().toLowerCase() : null;
    }

    public boolean isDuplicatedCategoryCode(Category category){
        String code = category.getCode();
        if (code == null || code.isBlank()) return false;

        if (category.getId() == null) {
            return categoryRepository.existsByCodeAndDeletedAtIsNull(code);
        } else {
            return categoryRepository.existsByCodeAndIdNotAndDeletedAtIsNull(code, category.getId());
        }
    }

    @Transactional
    public CategoryResponseDto createCategory(CategoryRequest request) {
        Category category = new Category();
        category.setName(request.getName());
        category.setCode(normalizeCode(request.getCode()));
        category.setDescription(request.getDescription());
        category.setVisible(request.isVisible());

        if (request.getParentId() != null) {
            if (Objects.equals(request.getParentId(), category.getId())) {
                throw new InvalidRequestException("Category cannot be its own parent");
            }
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent category not found"));
            if (parent.getDeletedAt() != null) {
                throw new InvalidRequestException("Cannot assign a deleted category as parent");
            }
            category.setParent(parent);
        }

        if (isDuplicatedCategoryCode(category)) {
            throw new DuplicateResourceException("Category code already exists");
        }

        Category saved = categoryRepository.save(category);
        return CategoryMapper.toCategoryResponseDto(saved);
    }

    public CategoryResponseDto getCategoryById(Long id) {
        Category category = categoryRepository.findByIdIncludingDeleted(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        return CategoryMapper.toCategoryResponseDto(category);
    }

    public List<CategoryResponseDto> getCategoryTree() {
        List<Category> roots = categoryRepository.findAllByParentIsNullAndVisibleTrueOrderByNameAsc();
        return roots.stream().map(CategoryMapper::toCategoryResponseDto).collect(Collectors.toList());
    }

    public List<CategoryResponseDto> getAllDeletedCategories() {
        List<Category> deletedCategories = categoryRepository.findAllDeleted();
        return deletedCategories.stream()
                .map(CategoryMapper::toCategoryResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if (category.getDeletedAt() != null) {
            throw new InvalidRequestException("Category is already deleted");
        }

        if (!category.getChildren().isEmpty()) {
            throw new InvalidRequestException("Cannot delete category with subcategories");
        }

        categoryRepository.delete(category);
    }

    @Transactional
    public CategoryResponseDto restoreCategory(Long id) {
        Category category = categoryRepository.findByIdIncludingDeleted(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if (category.getParent() != null && category.getParent().getDeletedAt() != null) {
            throw new InvalidRequestException("Cannot restore category because parent is deleted. Restore parent first.");
        }

        if (isDuplicatedCategoryCode(category)) {
            throw new DuplicateResourceException("Cannot restore category. Duplicate code exists: " + category.getCode());
        }

        category.setDeletedAt(null);
        Category restored = categoryRepository.save(category);
        return CategoryMapper.toCategoryResponseDto(restored);
    }

    @Transactional
    public CategoryResponseDto updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category with id " + id + " not found"));

        category.setName(request.getName());
        category.setCode(normalizeCode(request.getCode()));
        category.setDescription(request.getDescription());
        category.setVisible(request.isVisible());

        if (request.getParentId() != null) {
            if (Objects.equals(request.getParentId(), id)) {
                throw new InvalidRequestException("Category cannot be its own parent");
            }
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent category not found"));
            if (parent.getDeletedAt() != null) {
                throw new InvalidRequestException("Cannot assign a deleted category as parent");
            }
            category.setParent(parent);
        } else {
            category.setParent(null);
        }

        if (isDuplicatedCategoryCode(category)) {
            throw new DuplicateResourceException("Category code already exists");
        }

        Category updated = categoryRepository.save(category);
        return CategoryMapper.toCategoryResponseDto(updated);
    }
}
