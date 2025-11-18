package vn.uit.lms.controller.course;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.course.CategoryService;
import vn.uit.lms.shared.dto.request.course.CategoryRequest;
import vn.uit.lms.shared.dto.response.course.CategoryResponseDto;
import vn.uit.lms.shared.util.annotation.AdminOnly;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping("/admin/categories")
    @AdminOnly
    public ResponseEntity<CategoryResponseDto> createCategory(@Valid @RequestBody CategoryRequest categoryRequest) {
        CategoryResponseDto createdCategory = categoryService.createCategory(categoryRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<CategoryResponseDto> getCategoryById(@PathVariable Long id) {
        CategoryResponseDto category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(category);
    }

    @GetMapping("/admin/categories/{id}")
    @AdminOnly
    public ResponseEntity<CategoryResponseDto> getCategoryByIdForAdmin(@PathVariable Long id) {
        CategoryResponseDto category = categoryService.getCategoryByIdForAdmin(id);
        return ResponseEntity.ok(category);
    }

    @GetMapping("/categories/tree")
    public ResponseEntity<List<CategoryResponseDto>> getCategoryTree() {
        List<CategoryResponseDto> categoryTree = categoryService.getCategoryTree();
        return ResponseEntity.ok(categoryTree);
    }

    @GetMapping("/admin/categories/deleted")
    @AdminOnly
    public ResponseEntity<List<CategoryResponseDto>> getAllDeleted() {
        List<CategoryResponseDto> deletedCategories = categoryService.getAllDeletedCategories();
        return ResponseEntity.ok(deletedCategories);
    }

    @DeleteMapping("/admin/categories/{id}")
    @AdminOnly
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(null);
    }

    @PatchMapping("/admin/categories/{id}/restore")
    @AdminOnly
    public ResponseEntity<CategoryResponseDto> restoreCategory(@PathVariable Long id) {
        CategoryResponseDto category = categoryService.restoreCategory(id);
        return ResponseEntity.ok(category);
    }

    @PutMapping("/admin/categories/{id}")
    @AdminOnly
    public ResponseEntity<CategoryResponseDto> updateCategory(@PathVariable("id") Long id, @Valid @RequestBody CategoryRequest categoryRequest) {
        CategoryResponseDto updatedCategory = categoryService.updateCategory(id, categoryRequest);
        return ResponseEntity.ok(updatedCategory);
    }

    @GetMapping("/categories/slug/{slug}")
    public ResponseEntity<CategoryResponseDto> getCategoryBySlug(@PathVariable("slug") String slug) {
        CategoryResponseDto category = categoryService.getCategoryBySlug(slug);
        return ResponseEntity.ok(category);
    }
}
