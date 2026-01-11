"use client";

import { useState } from "react";
import { CommentResponse } from "@/services/community/comment/comment.types";
import { formatDistanceToNow } from "date-fns";
import { X, Send } from "lucide-react";
import Button from "@/core/components/ui/Button";
import Textarea from "@/core/components/ui/Textarea";
import Badge from "@/core/components/ui/Badge";
import { useReplyToComment, useCommentReplies } from "@/hooks/teacher";

interface ReplyDialogProps {
    comment: CommentResponse;
    onClose: () => void;
}

export function ReplyDialog({ comment, onClose }: ReplyDialogProps) {
    const [replyContent, setReplyContent] = useState("");

    const { data: replies, isLoading } = useCommentReplies(comment.id);
    const replyMutation = useReplyToComment(comment.id);

    const handleSubmit = async () => {
        if (!replyContent.trim()) return;

        await replyMutation.mutateAsync({ content: replyContent });
        setReplyContent("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">Discussion Thread</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Parent Comment */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                                        {comment.user?.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold">{comment.user?.username}</span>
                                            <Badge className="bg-blue-100 text-blue-800">Original Question</Badge>
                                        </div>
                                        <p className="text-gray-700">{comment.content}</p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Replies */}
                            {replies && replies.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-gray-700">
                                        {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
                                    </h3>
                                    {replies.map((reply) => (
                                        <div key={reply.id} className="ml-6 border-l-2 border-gray-200 pl-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm font-semibold">
                                                    {reply.user?.username?.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-medium text-sm">{reply.user?.username}</span>
                                                    </div>
                                                    <p className="text-gray-700 text-sm">{reply.content}</p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Reply Box */}
                <div className="border-t p-4 bg-gray-50">
                    <div className="space-y-3">
                        <Textarea
                            value={replyContent}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReplyContent(e.target.value)}
                            placeholder="Write your reply..."
                            rows={4}
                            className="resize-none"
                        />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={!replyContent.trim() || replyMutation.isPending}
                            >
                                {replyMutation.isPending ? (
                                    "Posting..."
                                ) : (
                                    <>
                                        <Send className="h-4 w-4 mr-2" />
                                        Post Reply
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
