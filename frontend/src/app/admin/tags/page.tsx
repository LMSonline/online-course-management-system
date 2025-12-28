"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAdminTagsQuery } from "@/hooks/admin/useTags";
import {
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
} from "@/hooks/admin/useTags";
import { TagRequest, TagResponse } from "@/services/courses/course.types";
import { Loader2, Plus, Edit2, Trash2, AlertCircle, X, Search } from "lucide-react";

/**
 * Admin Tags CRUD Page
 * Route: /admin/tags
 * Layout: AdminLayout
 * Guard: requireAdmin
 * 
 * Data:
 * - TAG_GET_LIST (paginated list)
 * - TAG_CREATE (mutation)
 * - TAG_UPDATE (mutation)
 * - TAG_DELETE (mutation)
 */
export default function AdminTagsScreen() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = parseInt(searchParams.get("page") || "0", 10);
  const size = parseInt(searchParams.get("size") || "20", 10);
  const q = searchParams.get("q") || undefined;

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTag, setEditingTag] = useState<TagResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState(q || "");
  const [formData, setFormData] = useState<TagRequest>({
    name: "",
  });

  const {
    data: tagsData,
    isLoading,
    error,
    refetch,
  } = useAdminTagsQuery({ page, size, q });

  const { mutate: createTag, isPending: isCreating } = useCreateTagMutation();
  const { mutate: updateTag, isPending: isUpdating } = useUpdateTagMutation();
  const { mutate: deleteTag, isPending: isDeleting } = useDeleteTagMutation();

  const handleSearch = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (searchQuery.trim()) {
      newSearchParams.set("q", searchQuery.trim());
    } else {
      newSearchParams.delete("q");
    }
    newSearchParams.set("page", "0");
    router.push(`/admin/tags?${newSearchParams.toString()}`);
  };

  const handleCreate = () => {
    createTag(formData, {
      onSuccess: () => {
        setShowCreateModal(false);
        setFormData({ name: "" });
        refetch();
      },
    });
  };

  const handleUpdate = () => {
    if (!editingTag) return;

    updateTag(
      { id: editingTag.id, payload: formData },
      {
        onSuccess: () => {
          setEditingTag(null);
          setFormData({ name: "" });
          refetch();
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this tag?")) return;

    deleteTag(id, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const handleEdit = (tag: TagResponse) => {
    setEditingTag(tag);
    setFormData({ name: tag.name });
  };

  const handlePageChange = (newPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("page", newPage.toString());
    router.push(`/admin/tags?${newSearchParams.toString()}`);
  };

  const tags = tagsData?.items || [];
  const totalPages = tagsData?.totalPages || 0;

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
              Error loading tags
            </h2>
          </div>
          <p className="text-red-600 dark:text-red-300 text-sm mb-4">
            {error instanceof Error ? error.message : "Failed to load tags"}
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
        <h1 className="text-3xl font-bold">Tags Management</h1>
        <button
          onClick={() => {
            setShowCreateModal(true);
            setFormData({ name: "" });
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand-600)] text-white rounded-lg hover:bg-[var(--brand-900)] transition"
        >
          <Plus className="h-5 w-5" />
          Create Tag
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search tags..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[var(--brand-600)] focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-[var(--brand-600)] text-white rounded-lg hover:bg-[var(--brand-900)] transition"
          >
            Search
          </button>
        </div>
      </div>

      {tags.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            {q ? "No tags found matching your search." : "No tags found. Create your first tag."}
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-6">
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
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {tags.map((tag) => (
                  <tr key={tag.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {tag.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {tag.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {tag.slug || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(tag)}
                          className="text-[var(--brand-600)] hover:text-[var(--brand-900)]"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(tag.id)}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(Math.max(0, page - 1))}
                disabled={page === 0}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || editingTag) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingTag ? "Edit Tag" : "Create Tag"}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingTag(null);
                  setFormData({ name: "" });
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
            </div>

            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={editingTag ? handleUpdate : handleCreate}
                disabled={isCreating || isUpdating || !formData.name.trim()}
                className="flex-1 px-4 py-2 bg-[var(--brand-600)] text-white rounded-lg hover:bg-[var(--brand-900)] transition disabled:opacity-50"
              >
                {isCreating || isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                    {editingTag ? "Updating..." : "Creating..."}
                  </>
                ) : editingTag ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingTag(null);
                  setFormData({ name: "" });
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


