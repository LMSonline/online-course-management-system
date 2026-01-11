"use client";

import { useState } from "react";
import { CommentResponse } from "@/services/community/comment/comment.types";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, ThumbsUp, Eye, EyeOff, Trash2, AlertCircle } from "lucide-react";
import Button from "@/core/components/ui/Button";
import Badge from "@/core/components/ui/Badge";
import { useUpvoteComment, useToggleVisibility, useDeleteComment } from "@/hooks/teacher";

interface QuestionCardNewProps {
    comment: CommentResponse;
    onReply: (comment: CommentResponse) => void;
    onReport: (comment: CommentResponse) => void;
}

export function QuestionCardNew({ comment, onReply, onReport }: QuestionCardNewProps) {
    const [showActions, setShowActions] = useState(false);

    const upvoteMutation = useUpvoteComment();
    const toggleVisibilityMutation = useToggleVisibility();
    const deleteMutation = useDeleteComment();

    const handleUpvote = () => {
        upvoteMutation.mutate(comment.id);
    };

    const handleToggleVisibility = () => {
        toggleVisibilityMutation.mutate(comment.id);
    };

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this comment?")) {
            deleteMutation.mutate(comment.id);
        }
    };

    return (
        <div
            className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${!comment.isVisible ? "opacity-50 bg-gray-50" : "bg-white"
                }`}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                        {comment.user?.username?.charAt(0).toUpperCase() || "U"}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900">{comment.user?.username || "Unknown"}</span>
                            {!comment.replies || comment.replies.length === 0 && (
                                <Badge className="bg-yellow-100 text-yellow-800">Pending Reply</Badge>
                            )}
                            {!comment.isVisible && (
                                <Badge className="bg-gray-100 text-gray-800">Hidden</Badge>
                            )}
                        </div>

                        <p className="text-gray-700 text-sm leading-relaxed">
                            {comment.content}
                        </p>

                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-4">
                    {/* Upvote */}
                    <button
                        onClick={handleUpvote}
                        className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <ThumbsUp className="h-4 w-4" />
                        <span className="text-sm">{comment.upvotes || 0}</span>
                    </button>

                    {/* Reply Count */}
                    <div className="flex items-center gap-1 text-gray-600">
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-sm">{comment.replies?.length || 0} replies</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className={`flex items-center gap-2 transition-opacity ${showActions ? "opacity-100" : "opacity-0"}`}>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onReply(comment)}
                    >
                        Reply
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleToggleVisibility}
                    >
                        {comment.isVisible ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onReport(comment)}
                    >
                        <AlertCircle className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDelete}
                        className="text-red-600 hover:text-red-700"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
