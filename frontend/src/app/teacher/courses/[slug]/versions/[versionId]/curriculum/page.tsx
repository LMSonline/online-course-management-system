"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowRight, BookOpen } from "lucide-react";

/**
 * Curriculum page - Redirects to unified content management page
 * This page is kept for backward compatibility with existing links
 */
export default function CurriculumRedirectPage() {
    const router = useRouter();
    const params = useParams();
    const slug = params.slug as string;
    const versionId = params.versionId as string;

    useEffect(() => {
        // Redirect to content page immediately
        const targetUrl = `/teacher/courses/${slug}/versions/${versionId}/content`;
        router.replace(targetUrl);
    }, [slug, versionId, router]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                    <BookOpen className="w-8 h-8 text-purple-600 animate-pulse" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Redirecting to Content Management
                </h3>
                <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                    Curriculum and content are now unified
                    <ArrowRight className="w-4 h-4" />
                </p>
            </div>
        </div>
    );
}
