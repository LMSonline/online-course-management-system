/**
 * Categories service - handles category-related API calls
 */

import { apiClient, type ApiResponse } from "@/services/core/api";
import { USE_MOCK } from "@/config/runtime";
import { unwrapApiResponse } from "@/services/core/unwrap";
import type { CategoryResponseDto } from "../types/categories.types";

/**
 * Get category tree (nested structure)
 */
export async function getCategoryTree(): Promise<CategoryResponseDto[]> {
  if (USE_MOCK) {
    // Minimal mock for development
    return Promise.resolve([
      {
        id: 1,
        name: "Development",
        code: "DEV",
        description: "Programming and software development",
        visible: true,
        parentId: null,
        deletedAt: null,
        children: [
          {
            id: 2,
            name: "Web Development",
            code: "WEB",
            description: "Build websites and web applications",
            visible: true,
            parentId: 1,
            deletedAt: null,
            children: [],
            slug: "web-development",
            metaTitle: "Web Development Courses",
            metaDescription: "Learn web development",
            thumbnailUrl: null,
          },
          {
            id: 3,
            name: "Mobile Development",
            code: "MOBILE",
            description: "Build mobile apps",
            visible: true,
            parentId: 1,
            deletedAt: null,
            children: [],
            slug: "mobile-development",
            metaTitle: "Mobile Development Courses",
            metaDescription: "Learn mobile development",
            thumbnailUrl: null,
          },
        ],
        slug: "development",
        metaTitle: "Development Courses",
        metaDescription: "Learn programming and development",
        thumbnailUrl: null,
      },
      {
        id: 4,
        name: "Design",
        code: "DESIGN",
        description: "Design courses",
        visible: true,
        parentId: null,
        deletedAt: null,
        children: [
          {
            id: 5,
            name: "UI/UX Design",
            code: "UIUX",
            description: "User interface and experience design",
            visible: true,
            parentId: 4,
            deletedAt: null,
            children: [],
            slug: "ui-ux-design",
            metaTitle: "UI/UX Design Courses",
            metaDescription: "Learn UI/UX design",
            thumbnailUrl: null,
          },
        ],
        slug: "design",
        metaTitle: "Design Courses",
        metaDescription: "Learn design",
        thumbnailUrl: null,
      },
    ]);
  }

  try {
    const response = await apiClient.get<ApiResponse<CategoryResponseDto[]> | CategoryResponseDto[]>("/categories/tree");
    return unwrapApiResponse(response.data);
  } catch (error) {
    console.error("Failed to fetch category tree:", error);
    return [];
  }
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<CategoryResponseDto | null> {
  if (USE_MOCK) {
    // Return mock category matching slug
    const tree = await getCategoryTree();
    const findCategory = (categories: CategoryResponseDto[]): CategoryResponseDto | null => {
      for (const cat of categories) {
        if (cat.slug === slug) return cat;
        if (cat.children.length > 0) {
          const found = findCategory(cat.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findCategory(tree);
  }

  try {
    const response = await apiClient.get<ApiResponse<CategoryResponseDto>>(`/categories/slug/${slug}`);
    return unwrapApiResponse(response.data);
  } catch (error) {
    console.error(`Failed to fetch category by slug ${slug}:`, error);
    return null;
  }
}

