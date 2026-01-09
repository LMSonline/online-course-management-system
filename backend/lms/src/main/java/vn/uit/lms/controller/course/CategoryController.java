package vn.uit.lms.controller.course;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Category Management", description = "APIs for managing course categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @Operation(summary = "Create a new category")
    @PostMapping("/admin/categories")
    public ResponseEntity<CategoryResponseDto> createCategory(
            @Parameter(description = "Category details") @Valid @RequestBody CategoryRequest categoryRequest) {
        CategoryResponseDto createdCategory = categoryService.createCategory(categoryRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
    }

    @Operation(summary = "Get category by ID")
    @GetMapping("/categories/{id}")
    public ResponseEntity<CategoryResponseDto> getCategoryById(
            @Parameter(description = "Category ID") @PathVariable Long id) {
        CategoryResponseDto category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(category);
    }

    @Operation(summary = "Get category by ID (Admin)")
    @GetMapping("/admin/categories/{id}")
    public ResponseEntity<CategoryResponseDto> getCategoryByIdForAdmin(
            @Parameter(description = "Category ID") @PathVariable Long id) {
        CategoryResponseDto category = categoryService.getCategoryByIdForAdmin(id);
        return ResponseEntity.ok(category);
    }

    @Operation(summary = "Get category tree")
    @GetMapping("/categories/tree")
    public ResponseEntity<List<CategoryResponseDto>> getCategoryTree() {
        List<CategoryResponseDto> categoryTree = categoryService.getCategoryTree();
        return ResponseEntity.ok(categoryTree);
    }

    @Operation(summary = "Get all deleted categories")
    @GetMapping("/admin/categories/deleted")
    public ResponseEntity<List<CategoryResponseDto>> getAllDeleted() {
        List<CategoryResponseDto> deletedCategories = categoryService.getAllDeletedCategories();
        return ResponseEntity.ok(deletedCategories);
    }

    @Operation(summary = "Delete a category")
    @DeleteMapping("/admin/categories/{id}")
    public ResponseEntity<Void> deleteCategory(
            @Parameter(description = "Category ID") @PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Restore a deleted category")
    @PatchMapping("/admin/categories/{id}/restore")
    public ResponseEntity<CategoryResponseDto> restoreCategory(
            @Parameter(description = "Category ID") @PathVariable Long id) {
        CategoryResponseDto category = categoryService.restoreCategory(id);
        return ResponseEntity.ok(category);
    }

    @Operation(summary = "Update a category")
    @PutMapping("/admin/categories/{id}")
    public ResponseEntity<CategoryResponseDto> updateCategory(
            @Parameter(description = "Category ID") @PathVariable("id") Long id,
            @Parameter(description = "Updated category details") @Valid @RequestBody CategoryRequest categoryRequest) {
        CategoryResponseDto updatedCategory = categoryService.updateCategory(id, categoryRequest);
        return ResponseEntity.ok(updatedCategory);
    }

    @Operation(summary = "Get category by slug")
    @GetMapping("/categories/slug/{slug}")
    public ResponseEntity<CategoryResponseDto> getCategoryBySlug(
            @Parameter(description = "Category slug") @PathVariable("slug") String slug) {
        CategoryResponseDto category = categoryService.getCategoryBySlug(slug);
        return ResponseEntity.ok(category);
    }
}
