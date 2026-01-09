"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/auth/authStore";
import {
  useCreateCourseComment,
  useCreateLessonComment,
  useUpdateComment,
  useDeleteComment,
} from "@/hooks/comment/useComments";
import { CommentResponse } from "@/services/community/community.types";
import { Edit2, Trash2, Send, X } from "lucide-react";
// Simple date formatter (fallback if date-fns not available)
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

interface CommentThreadProps {
  resourceType: "course" | "lesson";
  resourceId: number;
  comments: CommentResponse[];
}

export function CommentThread({ resourceType, resourceId, comments }: CommentThreadProps) {
  const { accountId } = useAuthStore();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [newComment, setNewComment] = useState("");

  const createCourseComment = useCreateCourseComment();
  const createLessonComment = useCreateLessonComment();
  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment();

  const handleCreateComment = () => {
    if (!newComment.trim()) return;

    const payload = { content: newComment.trim() };
    if (resourceType === "course") {
      createCourseComment.mutate({ courseId: resourceId, payload });
    } else {
      createLessonComment.mutate({ lessonId: resourceId, payload });
    }
    setNewComment("");
  };

  const handleStartEdit = (comment: CommentResponse) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handleSaveEdit = (commentId: number) => {
    if (!editContent.trim()) return;

    updateComment.mutate({
      commentId,
      payload: { content: editContent.trim() },
    });
    setEditingId(null);
    setEditContent("");
  };

  const handleDelete = (commentId: number) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      deleteComment.mutate(commentId);
    }
  };

  const renderComment = (comment: CommentResponse, depth: number = 0) => {
    const isEditing = editingId === comment.id;
    const isOwner = comment.authorId === accountId;

    return (
      <div key={comment.id} className={depth > 0 ? "ml-8 mt-4" : "mb-6"}>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              {comment.authorAvatarUrl ? (
                <img
                  src={comment.authorAvatarUrl}
                  alt={comment.authorName || "User"}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {(comment.authorName || "U")[0].toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <p className="font-medium text-sm">{comment.authorName || "Anonymous"}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(comment.createdAt)}
                </p>
              </div>
            </div>
            {isOwner && !isEditing && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStartEdit(comment)}
                  className="p-1 text-gray-500 hover:text-[var(--brand-600)] transition"
                  aria-label="Edit comment"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="p-1 text-gray-500 hover:text-red-600 transition"
                  aria-label="Delete comment"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
                rows={3}
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSaveEdit(comment.id)}
                  className="px-3 py-1 bg-[var(--brand-600)] text-white rounded-lg hover:bg-[var(--brand-900)] text-sm transition"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {comment.content}
            </p>
          )}
        </div>

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            {comment.replies.map((reply) => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Create Comment Form */}
      <div className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm resize-none"
          rows={3}
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={handleCreateComment}
            disabled={!newComment.trim() || createCourseComment.isPending || createLessonComment.isPending}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand-600)] text-white rounded-lg hover:bg-[var(--brand-900)] transition disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            Post Comment
          </button>
        </div>
      </div>

      {/* Comments List */}
      {comments.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div>
          {comments.map((comment) => renderComment(comment))}
        </div>
      )}
    </div>
  );
}

