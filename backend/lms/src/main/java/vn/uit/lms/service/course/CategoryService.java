package vn.uit.lms.service.course;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.domain.course.Category;
import vn.uit.lms.core.repository.course.CategoryRepository;
import vn.uit.lms.service.helper.SEOHelperImpl;
import vn.uit.lms.shared.dto.request.course.CategoryRequest;
import vn.uit.lms.shared.dto.response.course.CategoryResponseDto;
import vn.uit.lms.shared.exception.DuplicateResourceException;
import vn.uit.lms.shared.exception.InvalidRequestException;
import vn.uit.lms.shared.exception.ResourceNotFoundException;
import vn.uit.lms.shared.mapper.course.CategoryMapper;
import vn.uit.lms.shared.annotation.EnableSoftDeleteFilter;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final SEOHelperImpl seoHelper;

    public CategoryService(CategoryRepository categoryRepository,
                           SEOHelperImpl seoHelper) {

        this.categoryRepository = categoryRepository;
        this.seoHelper = seoHelper;
    }

    private String normalizeCode(String code) {
        return code != null ? code.trim().toLowerCase() : null;
    }

    private boolean isDuplicatedCategoryCode(Category category){
        String code = category.getCode();
        if (code == null || code.isBlank()) return false;

        if (category.getId() == null) {
            return categoryRepository.existsByCodeAndDeletedAtIsNull(code);
        } else {
            return categoryRepository.existsByCodeAndIdNotAndDeletedAtIsNull(code, category.getId());
        }
    }

    private String createUniqueSlug(Category category) {
        return seoHelper.toSlug(category.getName());
    }

    private boolean isDuplicateSlug(Category category){
        String slug = category.getSlug();
        if (slug == null || slug.isBlank()) return false;
        if (category.getId() == null) {
            return categoryRepository.existsBySlugAndDeletedAtIsNull(slug);
        } else {
            return categoryRepository.existsBySlugAndIdNotAndDeletedAtIsNull(slug, category.getId());
        }
    }

    private void createSEOData(Category category) {

        //create slug
        if(category.getSlug() != null){
            if(isDuplicateSlug(category)){
                throw new DuplicateResourceException("Category slug already exists");
            }
        }else{
            String uniqueSlug = createUniqueSlug(category);
            category.setSlug(uniqueSlug);
        }

        //create meta description
        if (category.getMetaTitle() == null || category.getMetaTitle().isBlank()) {
            category.setMetaTitle(category.getName());
        }

        // metaDescription
        if (category.getMetaDescription() == null || category.getMetaDescription().isBlank()) {
            if (category.getDescription() != null && !category.getDescription().isBlank()) {
                category.setMetaDescription(seoHelper.normalizeMetaDescription(category.getDescription()));
            } else {
                category.setMetaDescription(category.getName());
            }
        }

    }


    @Transactional
    @EnableSoftDeleteFilter
    public CategoryResponseDto createCategory(CategoryRequest request) {
        Category category = new Category();
        category.setName(request.getName());
        category.setCode(normalizeCode(request.getCode()));
        category.setDescription(request.getDescription());
        category.setVisible(request.isVisible());
        category.setSlug(request.getSlug()!=null ? request.getSlug() : null);
        category.setMetaTitle(request.getMetaTitle()!=null ? request.getMetaTitle() : null);
        category.setMetaDescription(request.getMetaDescription()!=null ? request.getMetaDescription() : null);
        category.setThumbnailUrl(request.getThumbnailUrl()!=null ? request.getThumbnailUrl() : null);
        createSEOData(category);

        if (request.getParentId() != null) {
            if (Objects.equals(request.getParentId(), category.getId())) {
                throw new InvalidRequestException("Category cannot be its own parent");
            }
            Category parent = categoryRepository.findByIdAndDeletedAtIsNull(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent category not found"));
            category.setParent(parent);
        }

        if (isDuplicatedCategoryCode(category)) {
            throw new DuplicateResourceException("Category code already exists");
        }

        Category saved = categoryRepository.save(category);
        return CategoryMapper.toCategoryResponseDto(saved);
    }

    @EnableSoftDeleteFilter
    public CategoryResponseDto getCategoryById(Long id) {
        Category category = categoryRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        return CategoryMapper.toCategoryResponseDto(category);
    }

    @EnableSoftDeleteFilter
    public CategoryResponseDto getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlugAndDeletedAtIsNull(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        return CategoryMapper.toCategoryResponseDto(category);
    }

    public CategoryResponseDto getCategoryByIdForAdmin(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        return CategoryMapper.toCategoryResponseDto(category);
    }

    @EnableSoftDeleteFilter
    public List<CategoryResponseDto> getCategoryTree() {
        List<Category> roots = categoryRepository.findAllByParentIsNull();
        return roots.stream().map(CategoryMapper::toCategoryResponseDto).collect(Collectors.toList());
    }

    public List<CategoryResponseDto> getAllDeletedCategories() {
        List<Category> deletedCategories = categoryRepository.findAllByParentIsNullAndDeletedAtIsNotNull();
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
        Category category = categoryRepository.findByIdAndDeletedAtIsNotNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if (category.getParent() != null && category.getParent().getDeletedAt() != null) {
            throw new InvalidRequestException("Cannot restore category because parent is deleted. Restore parent first.");
        }

        if (isDuplicatedCategoryCode(category)) {
            throw new DuplicateResourceException("Cannot restore category. Duplicate code exists: " + category.getCode());
        }

        if (isDuplicateSlug(category)) {
            throw new DuplicateResourceException("Cannot restore category. Duplicate slug exists: " + category.getSlug());
        }

        category.setDeletedAt(null);
        Category restored = categoryRepository.save(category);
        return CategoryMapper.toCategoryResponseDto(restored);
    }

    @Transactional
    @EnableSoftDeleteFilter
    public CategoryResponseDto updateCategory(Long id, CategoryRequest request) {

        Category category = categoryRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        // Update name
        if (request.getName() != null) {
            category.setName(request.getName());
        }

        // Update code
        category.setCode(request.getCode() != null ? normalizeCode(request.getCode()) : category.getCode());

        // Update description
        if (request.getDescription() != null) {
            category.setDescription(request.getDescription());
        }

        category.setVisible(request.isVisible());

        //check parent
        if (request.getParentId() != null) {
            if (Objects.equals(request.getParentId(), id)) {
                throw new InvalidRequestException("Category cannot be its own parent");
            }
            Category parent = categoryRepository.findByIdAndDeletedAtIsNull(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent category not found"));
            category.setParent(parent);
        } else {
            category.setParent(null);
        }

        // metaTitle
        if (request.getMetaTitle() != null) {
            category.setMetaTitle(request.getMetaTitle());
        }

        // metaDescription
        if (request.getMetaDescription() != null) {
            category.setMetaDescription(request.getMetaDescription());
        }

        // thumbnail
        if (request.getThumbnailUrl() != null) {
            category.setThumbnailUrl(request.getThumbnailUrl());
        }

        // Validate code duplicate
        if (isDuplicatedCategoryCode(category)) {
            throw new DuplicateResourceException("Category code already exists");
        }

        Category saved = categoryRepository.save(category);
        return CategoryMapper.toCategoryResponseDto(saved);
    }

    // TODO: Implement getCategoryWithCourses method
    // @EnableSoftDeleteFilter
    // public CategoryWithCoursesResponse getCategoryWithCourses(Long id, Pageable pageable) {
    //     - Get category details
    //     - Query published courses in this category
    //     - Include subcategory courses if requested
    //     - Apply filters: difficulty, rating, price
    //     - Return category with paginated course list
    // }

    // TODO: Implement getCategoryStatistics method
    // public CategoryStatisticsResponse getCategoryStatistics(Long id) {
    //     - Count total courses in category
    //     - Count total enrollments across all courses
    //     - Calculate average course rating
    //     - Count active courses vs total
    //     - Include statistics from subcategories
    // }

    // TODO: Implement getPopularCategories method
    // public List<CategoryResponseDto> getPopularCategories(int limit) {
    //     - Order categories by course count or enrollment count
    //     - Include only visible categories
    //     - Filter by minimum course count threshold
    //     - Include course count and enrollment metrics
    // }

    // TODO: Implement moveCategoryToParent method
    // @Transactional
    // public CategoryResponseDto moveCategoryToParent(Long categoryId, Long newParentId) {
    //     - Validate not creating circular reference
    //     - Check if move creates too deep nesting (max 3 levels)
    //     - Update parent relationship
    //     - Validate no duplicate codes in new parent's children
    // }

    // TODO: Implement bulkDeleteCategories method
    // @Transactional
    // public void bulkDeleteCategories(List<Long> categoryIds) {
    //     - Validate no categories have active courses
    //     - Check no categories have children
    //     - Soft delete all specified categories
    //     - Log bulk operation
    // }

    // TODO: Implement searchCategories method
    // public PageResponse<CategoryResponseDto> searchCategories(String keyword, Pageable pageable) {
    //     - Search by name, description, code
    //     - Support fuzzy matching
    //     - Include course count
    //     - Order by relevance
    // }

    // TODO: Implement validateCategoryHierarchy method
    // private void validateCategoryHierarchy(Long categoryId, Long parentId) {
    //     - Check for circular references
    //     - Validate maximum nesting depth
    //     - Ensure parent is not deleted
    //     - Verify parent is visible if child is visible
    // }

    // ========== PUBLIC API METHODS ==========

    /**
     * Get all active (visible) categories for public access
     */
    @EnableSoftDeleteFilter
    public List<CategoryResponseDto> getActiveCategories() {
        List<Category> categories = categoryRepository.findByVisibleTrueAndDeletedAtIsNull();
        return categories.stream()
                .map(CategoryMapper::toCategoryResponseDto)
                .collect(Collectors.toList());
    }

}
