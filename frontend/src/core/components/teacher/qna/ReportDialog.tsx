"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Button from "@/core/components/ui/Button";
import Textarea from "@/core/components/ui/Textarea";
import Label from "@/core/components/ui/Label";
import { useCreateReport } from "@/hooks/teacher";
import { ViolationReportType } from "@/services/community/report/report.types";

interface ReportDialogProps {
    commentId: number;
    onClose: () => void;
}

const REPORT_TYPES: { value: ViolationReportType; label: string; description: string }[] = [
    { value: "SPAM", label: "Spam", description: "Repetitive or irrelevant content" },
    { value: "HARASSMENT", label: "Harassment", description: "Bullying or threatening behavior" },
    { value: "VIOLENCE", label: "Violence", description: "Violent or threatening content" },
    { value: "COPYRIGHT", label: "Copyright Violation", description: "Unauthorized use of copyrighted material" },
    { value: "INAPPROPRIATE_CONTENT", label: "Inappropriate Content", description: "Explicit or unsuitable material" },
    { value: "MISINFORMATION", label: "Misinformation", description: "False or misleading information" },
    { value: "OTHER", label: "Other", description: "Other violations not listed above" },
];

export function ReportDialog({ commentId, onClose }: ReportDialogProps) {
    const [selectedType, setSelectedType] = useState<ViolationReportType>("SPAM");
    const [description, setDescription] = useState("");

    const createReportMutation = useCreateReport();

    const handleSubmit = async () => {
        if (!description.trim()) {
            alert("Please provide a description");
            return;
        }

        await createReportMutation.mutateAsync({
            commentId,
            reportType: selectedType,
            description,
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">Report Comment</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label>Report Type</Label>
                        <div className="space-y-2">
                            {REPORT_TYPES.map((type) => (
                                <label
                                    key={type.value}
                                    className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                >
                                    <input
                                        type="radio"
                                        name="reportType"
                                        value={type.value}
                                        checked={selectedType === type.value}
                                        onChange={() => setSelectedType(type.value)}
                                        className="mt-1"
                                    />
                                    <div>
                                        <p className="font-medium text-sm">{type.label}</p>
                                        <p className="text-xs text-gray-500">{type.description}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">
                            Description <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                            placeholder="Please provide details about the violation..."
                            rows={4}
                            className="resize-none"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 p-4 border-t bg-gray-50">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!description.trim() || createReportMutation.isPending}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {createReportMutation.isPending ? "Submitting..." : "Submit Report"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
