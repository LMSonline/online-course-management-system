"use client";

import { useState } from "react";
import { useAdminCategoriesQuery } from "@/hooks/admin/useCategories";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/hooks/admin/useCategories";
import { CategoryRequest, CategoryResponse } from "@/services/courses/course.types";
import { Loader2, Plus, Edit2, Trash2, AlertCircle, X } from "lucide-react";
import { toast } from "sonner";

/**
 * Admin Categories CRUD Page
 * Route: /admin/categories
 * Layout: AdminLayout
 * Guard: requireAdmin
 * 
 * Data:
 * - CATEGORY_GET_TREE (list)
 * - CATEGORY_CREATE (mutation)
 * - CATEGORY_UPDATE (mutation)
 * - CATEGORY_DELETE (mutation)
 */
export default function AdminCategoriesScreen() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryResponse | null>(null);
  const [formData, setFormData] = useState<CategoryRequest>({
    name: "",
    slug: "",
    description: "",
    parentId: undefined,
  });

  const {
    data: categories = [],
    isLoading,
    error,
    refetch,
  } = useAdminCategoriesQuery();

  const { mutate: createCategory, isPending: isCreating } = useCreateCategoryMutation();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategoryMutation();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategoryMutation();

  const handleCreate = () => {
    createCategory(formData, {
      onSuccess: () => {
        setShowCreateModal(false);
        setFormData({ name: "", slug: "", description: "", parentId: undefined });
        refetch();
      },
    });
  };

  const handleUpdate = () => {
    if (!editingCategory) return;

    updateCategory(
      { id: editingCategory.id, payload: formData },
      {
        onSuccess: () => {
          setEditingCategory(null);
          setFormData({ name: "", slug: "", description: "", parentId: undefined });
          refetch();
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    deleteCategory(id, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const handleEdit = (category: CategoryResponse) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug || "",
      description: category.description || "",
      parentId: category.parentId,
    });
  };

  const flattenCategories = (cats: CategoryResponse[], level = 0): CategoryResponse[] => {
    const result: CategoryResponse[] = [];
    for (const cat of cats) {
      result.push({ ...cat, name: "  ".repeat(level) + cat.name });
      if (cat.children && cat.children.length > 0) {
        result.push(...flattenCategories(cat.children, level + 1));
      }
    }
    return result;
  };

  const flatCategories = flattenCategories(categories);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-[var(--brand-600)]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">
              Error loading categories
            </h2>
          </div>
          <p className="text-red-600 dark:text-red-300 text-sm mb-4">
            {error instanceof Error ? error.message : "Failed to load categories"}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Categories Management</h1>
        <button
          onClick={() => {
            setShowCreateModal(true);
            setFormData({ name: "", slug: "", description: "", parentId: undefined });
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand-600)] text-white rounded-lg hover:bg-[var(--brand-900)] transition"
        >
          <Plus className="h-5 w-5" />
          Create Category
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">No categories found. Create your first category.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Parent
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {flatCategories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {category.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {category.slug || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {category.parentId || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-[var(--brand-600)] hover:text-[var(--brand-900)]"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || editingCategory) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingCategory ? "Edit Category" : "Create Category"}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingCategory(null);
                  setFormData({ name: "", slug: "", description: "", parentId: undefined });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[var(--brand-600)] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[var(--brand-600)] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[var(--brand-600)] focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Parent ID (optional)</label>
                <input
                  type="number"
                  value={formData.parentId || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      parentId: e.target.value ? parseInt(e.target.value, 10) : undefined,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[var(--brand-600)] focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={editingCategory ? handleUpdate : handleCreate}
                disabled={isCreating || isUpdating || !formData.name.trim()}
                className="flex-1 px-4 py-2 bg-[var(--brand-600)] text-white rounded-lg hover:bg-[var(--brand-900)] transition disabled:opacity-50"
              >
                {isCreating || isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                    {editingCategory ? "Updating..." : "Creating..."}
                  </>
                ) : editingCategory ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingCategory(null);
                  setFormData({ name: "", slug: "", description: "", parentId: undefined });
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


