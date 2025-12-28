"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import Hls from "hls.js";
import {
    X,
    ChevronRight,
    ChevronDown,
    Play,
    FileText,
    Award,
    FileQuestion,
    CheckCircle,
    Loader2,
    Menu,
    ChevronLeft,
    List,
    Download,
    ExternalLink,
    FileIcon,
    Link2,
    Clock,
} from "lucide-react";
import { courseService } from "@/services/courses/course.service";
import { courseVersionService } from "@/services/courses/course-version.service";
import { lessonService } from "@/services/courses/content/lesson.service";
import { chapterService } from "@/services/courses/content/chapter.service";
import { lessonResourceService } from "@/services/courses/content/lesson-resource.service";
import { assessmentService } from "@/services/assessment/assessment.service";
import { assignmentService } from "@/services/assignment/assignment.service";
import { CourseDetailResponse, CourseVersionResponse } from "@/services/courses/course.types";
import { ChapterResponse } from "@/services/courses/content/chapter.types";
import { LessonResponse } from "@/services/courses/content/lesson.types";
import { LessonResourceResponse } from "@/services/courses/content/lesson-resource.types";
import { QuizResponse } from "@/services/assessment/assessment.types";
import { AssignmentResponse } from "@/services/assignment/assignment.types";
import { toast } from "sonner";

export default function TeacherViewCoursePage() {
    const params = useParams();
    const slug = params.slug as string;
    const versionId = params.versionId ? parseInt(params.versionId as string) : null;

    const [selectedLesson, setSelectedLesson] = useState<LessonResponse | null>(null);
    const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [loadingVideo, setLoadingVideo] = useState(false);
    const [allLessons, setAllLessons] = useState<Record<number, LessonResponse[]>>({});
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<Hls | null>(null);
    const videoRefreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Lesson content data
    const [lessonResources, setLessonResources] = useState<LessonResourceResponse[]>([]);
    const [lessonQuizzes, setLessonQuizzes] = useState<QuizResponse[]>([]);
    const [lessonAssignments, setLessonAssignments] = useState<AssignmentResponse[]>([]);
    const [loadingContent, setLoadingContent] = useState(false);

    // Fetch course
    const { data: course } = useQuery<CourseDetailResponse>({
        queryKey: ["course-detail", slug],
        queryFn: () => courseService.getCourseBySlug(slug),
    });

    // Fetch version
    const { data: versions } = useQuery<CourseVersionResponse[]>({
        queryKey: ["course-versions", course?.id],
        queryFn: () => courseVersionService.getCourseVersions(course!.id),
        enabled: !!course?.id,
    });

    const currentVersion = versionId
        ? versions?.find((v) => v.id === versionId)
        : versions?.[0];

    // Fetch chapters
    const { data: chapters = [], isLoading: loadingChapters } = useQuery<ChapterResponse[]>({
        queryKey: ["chapters", course?.id, currentVersion?.id],
        queryFn: () => chapterService.getListChapters(course!.id, currentVersion!.id),
        enabled: !!course?.id && !!currentVersion?.id,
    });

    // Load all lessons
    useEffect(() => {
        if (chapters.length > 0) {
            loadAllLessons();
        }
    }, [chapters]);

    // Load lesson content when selected lesson changes
    useEffect(() => {
        if (selectedLesson) {
            loadLessonContent(selectedLesson.id);
        }
    }, [selectedLesson]);

    const loadLessonContent = async (lessonId: number) => {
        try {
            setLoadingContent(true);
            const [resources, quizzes, assignments] = await Promise.all([
                lessonResourceService.getLessonResources(lessonId).catch(() => []),
                assessmentService.getQuizzesByLesson(lessonId).catch(() => []),
                assignmentService.getAssignmentsByLesson(lessonId).catch(() => []),
            ]);
            setLessonResources(resources);
            setLessonQuizzes(quizzes);
            setLessonAssignments(assignments);
        } catch (error) {
            console.error("Failed to load lesson content:", error);
        } finally {
            setLoadingContent(false);
        }
    };

    const loadAllLessons = async () => {
        const lessonsData: Record<number, LessonResponse[]> = {};
        const expandedSet = new Set<number>();

        for (const chapter of chapters) {
            try {
                const lessons = await lessonService.getLessonsByChapter(chapter.id);
                lessonsData[chapter.id] = lessons;
                expandedSet.add(chapter.id); // Auto-expand all chapters

                if (!selectedLesson && lessons.length > 0) {
                    const firstVideoLesson = lessons.find(l => l.type === "VIDEO" && l.videoStatus === "READY");
                    if (firstVideoLesson) {
                        setSelectedLesson(firstVideoLesson);
                    }
                }
            } catch (error) {
                console.error(`Failed to load lessons for chapter ${chapter.id}:`, error);
                lessonsData[chapter.id] = [];
            }
        }
        setAllLessons(lessonsData);
        setExpandedChapters(expandedSet);
    };

    // Load video and setup auto-refresh
    useEffect(() => {
        if (selectedLesson?.type === "VIDEO" && selectedLesson?.videoStatus === "READY") {
            loadVideoStream(selectedLesson.id);

            // Setup auto-refresh every 50 minutes (presigned URLs valid for 1 hour)
            if (videoRefreshIntervalRef.current) {
                clearInterval(videoRefreshIntervalRef.current);
            }

            videoRefreshIntervalRef.current = setInterval(() => {
                console.log("Auto-refreshing video stream URL...");
                loadVideoStream(selectedLesson.id);
            }, 50 * 60 * 1000); // 50 minutes
        } else {
            setVideoUrl(null);
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
            if (videoRefreshIntervalRef.current) {
                clearInterval(videoRefreshIntervalRef.current);
                videoRefreshIntervalRef.current = null;
            }
        }

        return () => {
            if (videoRefreshIntervalRef.current) {
                clearInterval(videoRefreshIntervalRef.current);
            }
        };
    }, [selectedLesson]);

    // Setup HLS player
    useEffect(() => {
        if (!videoUrl || !videoRef.current) return;

        const video = videoRef.current;

        if (hlsRef.current) {
            hlsRef.current.destroy();
        }

        if (videoUrl.startsWith("data:application/vnd.apple.mpegurl")) {
            const base64Data = videoUrl.split(",")[1];
            const playlistContent = atob(base64Data);

            if (Hls.isSupported()) {
                const hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: false,
                    backBufferLength: 90,
                });

                hlsRef.current = hls;
                const blob = new Blob([playlistContent], { type: "application/vnd.apple.mpegurl" });
                const blobUrl = URL.createObjectURL(blob);

                hls.loadSource(blobUrl);
                hls.attachMedia(video);

                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    video.play().catch(e => console.log("Auto-play prevented:", e));
                });

                hls.on(Hls.Events.ERROR, (event, data) => {
                    console.error("HLS Error:", data);
                    if (data.fatal) {
                        switch (data.type) {
                            case Hls.ErrorTypes.NETWORK_ERROR:
                                console.log("Network error, trying to recover...");
                                hls.startLoad();
                                break;
                            case Hls.ErrorTypes.MEDIA_ERROR:
                                console.log("Media error, trying to recover...");
                                hls.recoverMediaError();
                                break;
                            default:
                                console.log("Fatal error, refreshing video URL...");
                                if (selectedLesson) {
                                    loadVideoStream(selectedLesson.id);
                                }
                                break;
                        }
                    }
                });

                return () => {
                    URL.revokeObjectURL(blobUrl);
                    hls.destroy();
                };
            } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = videoUrl;
                video.addEventListener("loadedmetadata", () => {
                    video.play().catch(e => console.log("Auto-play prevented:", e));
                });
            }
        } else {
            video.src = videoUrl;
        }

        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
        };
    }, [videoUrl]);

    const loadVideoStream = async (lessonId: number) => {
        try {
            setLoadingVideo(true);
            const streamUrl = await lessonService.getVideoStreamingUrl(lessonId);
            setVideoUrl(streamUrl);
        } catch (error: any) {
            console.error("Failed to load video stream:", error);
            toast.error(error?.message || "Failed to load video");
            setVideoUrl(null);
        } finally {
            setLoadingVideo(false);
        }
    };

    const toggleChapter = (chapterId: number) => {
        const newExpanded = new Set(expandedChapters);
        if (newExpanded.has(chapterId)) {
            newExpanded.delete(chapterId);
        } else {
            newExpanded.add(chapterId);
        }
        setExpandedChapters(newExpanded);
    };

    const getLessonIcon = (type: string) => {
        switch (type) {
            case "VIDEO": return Play;
            case "DOCUMENT": return FileText;
            case "ASSIGNMENT": return FileQuestion;
            case "QUIZ": return Award;
            case "FINAL_EXAM": return CheckCircle;
            default: return FileText;
        }
    };

    const formatDuration = (seconds?: number) => {
        if (!seconds) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const goToNextLesson = () => {
        if (!selectedLesson) return;

        let currentChapterIndex = -1;
        let currentLessonIndex = -1;

        for (let i = 0; i < chapters.length; i++) {
            const lessons = allLessons[chapters[i].id] || [];
            const lessonIndex = lessons.findIndex(l => l.id === selectedLesson.id);
            if (lessonIndex !== -1) {
                currentChapterIndex = i;
                currentLessonIndex = lessonIndex;
                break;
            }
        }

        if (currentChapterIndex === -1) return;

        const currentChapterLessons = allLessons[chapters[currentChapterIndex].id] || [];
        if (currentLessonIndex < currentChapterLessons.length - 1) {
            setSelectedLesson(currentChapterLessons[currentLessonIndex + 1]);
            return;
        }

        if (currentChapterIndex < chapters.length - 1) {
            const nextChapterLessons = allLessons[chapters[currentChapterIndex + 1].id] || [];
            if (nextChapterLessons.length > 0) {
                setSelectedLesson(nextChapterLessons[0]);
                expandedChapters.add(chapters[currentChapterIndex + 1].id);
                setExpandedChapters(new Set(expandedChapters));
            }
        }
    };

    const goToPreviousLesson = () => {
        if (!selectedLesson) return;

        let currentChapterIndex = -1;
        let currentLessonIndex = -1;

        for (let i = 0; i < chapters.length; i++) {
            const lessons = allLessons[chapters[i].id] || [];
            const lessonIndex = lessons.findIndex(l => l.id === selectedLesson.id);
            if (lessonIndex !== -1) {
                currentChapterIndex = i;
                currentLessonIndex = lessonIndex;
                break;
            }
        }

        if (currentChapterIndex === -1) return;

        const currentChapterLessons = allLessons[chapters[currentChapterIndex].id] || [];
        if (currentLessonIndex > 0) {
            setSelectedLesson(currentChapterLessons[currentLessonIndex - 1]);
            return;
        }

        if (currentChapterIndex > 0) {
            const prevChapterLessons = allLessons[chapters[currentChapterIndex - 1].id] || [];
            if (prevChapterLessons.length > 0) {
                setSelectedLesson(prevChapterLessons[prevChapterLessons.length - 1]);
                expandedChapters.add(chapters[currentChapterIndex - 1].id);
                setExpandedChapters(new Set(expandedChapters));
            }
        }
    };

    if (!course || !currentVersion) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col">
            {/* Header */}
            <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50">
                <div className="px-4 py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href={`/teacher/courses/${slug}/versions`}
                            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-400" />
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-slate-800 rounded-lg transition-colors lg:hidden"
                        >
                            <Menu className="w-5 h-5 text-slate-400" />
                        </button>
                        <div>
                            <h1 className="text-lg font-semibold text-white line-clamp-1">
                                {course.title}
                            </h1>
                            <p className="text-sm text-slate-400">
                                v{currentVersion.versionNumber} - {currentVersion.title}
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <aside
                    className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                        } lg:translate-x-0 fixed lg:relative z-40 w-80 bg-slate-950 border-r border-slate-800 h-[calc(100vh-57px)] overflow-y-auto transition-transform`}
                >
                    <div className="p-4 border-b border-slate-800">
                        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                            <List className="w-4 h-4" />
                            Course Content
                        </h2>
                    </div>

                    <div className="divide-y divide-slate-800">
                        {chapters.map((chapter, chapterIndex) => {
                            const lessons = allLessons[chapter.id] || [];
                            const isExpanded = expandedChapters.has(chapter.id);

                            return (
                                <div key={chapter.id}>
                                    <button
                                        onClick={() => toggleChapter(chapter.id)}
                                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-900 transition-colors"
                                    >
                                        <div className="flex items-start gap-3 flex-1 text-left">
                                            <span className="text-xs font-medium text-slate-500 mt-1">
                                                {chapterIndex + 1}
                                            </span>
                                            <div className="flex-1">
                                                <h3 className="text-sm font-medium text-white">
                                                    {chapter.title}
                                                </h3>
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    {lessons.length} lessons
                                                </p>
                                            </div>
                                        </div>
                                        {isExpanded ? (
                                            <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                        )}
                                    </button>

                                    {isExpanded && (
                                        <div className="bg-slate-900/50">
                                            {lessons.map((lesson, lessonIndex) => {
                                                const Icon = getLessonIcon(lesson.type);
                                                const isSelected = selectedLesson?.id === lesson.id;
                                                const isVideo = lesson.type === "VIDEO";
                                                const isReady = lesson.videoStatus === "READY";

                                                return (
                                                    <button
                                                        key={lesson.id}
                                                        onClick={() => setSelectedLesson(lesson)}
                                                        disabled={isVideo && !isReady}
                                                        className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-800/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isSelected ? "bg-indigo-600/20 border-l-4 border-indigo-500" : ""
                                                            }`}
                                                    >
                                                        <span className="text-xs text-slate-500 w-8 text-right">
                                                            {lessonIndex + 1}
                                                        </span>
                                                        <Icon className={`w-4 h-4 flex-shrink-0 ${isSelected ? "text-indigo-400" : "text-slate-400"
                                                            }`} />
                                                        <div className="flex-1 text-left">
                                                            <p className={`text-sm ${isSelected ? "text-white font-medium" : "text-slate-300"
                                                                }`}>
                                                                {lesson.title}
                                                            </p>
                                                            {isVideo && lesson.durationSeconds && lesson.durationSeconds > 0 && (
                                                                <p className="text-xs text-slate-500 mt-0.5">
                                                                    {formatDuration(lesson.durationSeconds)}
                                                                </p>
                                                            )}
                                                            {isVideo && !isReady && (
                                                                <p className="text-xs text-amber-500 mt-0.5">
                                                                    Processing...
                                                                </p>
                                                            )}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    {selectedLesson ? (
                        <div>
                            {/* Video Player */}
                            {selectedLesson.type === "VIDEO" && (
                                <div className="relative bg-black aspect-video">
                                    {loadingVideo ? (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Loader2 className="w-12 h-12 text-white animate-spin" />
                                        </div>
                                    ) : videoUrl ? (
                                        <video
                                            ref={videoRef}
                                            controls
                                            className="w-full h-full"
                                            onEnded={goToNextLesson}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-white">
                                            <p>Video not available</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Lesson Content */}
                            <div className="p-6 bg-slate-900">
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    {selectedLesson.title}
                                </h2>

                                {/* Lesson Resources */}
                                {loadingContent ? (
                                    <div className="flex justify-center py-8">
                                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                                    </div>
                                ) : (
                                    <div className="space-y-6 mb-8">
                                        {/* Resources Section */}
                                        {lessonResources.length > 0 && (
                                            <div className="bg-slate-800 rounded-lg p-4">
                                                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                                    <FileIcon className="w-5 h-5" />
                                                    Resources
                                                </h3>
                                                <div className="space-y-2">
                                                    {lessonResources.map((resource) => (
                                                        <div
                                                            key={resource.id}
                                                            className="flex items-center justify-between p-3 bg-slate-750 hover:bg-slate-700 rounded-lg transition-colors"
                                                        >
                                                            <div className="flex items-center gap-3 flex-1">
                                                                {resource.resourceType === "FILE" ? (
                                                                    <FileText className="w-5 h-5 text-indigo-400" />
                                                                ) : (
                                                                    <Link2 className="w-5 h-5 text-green-400" />
                                                                )}
                                                                <div className="flex-1">
                                                                    <p className="text-white font-medium">{resource.title}</p>
                                                                    {resource.description && (
                                                                        <p className="text-sm text-slate-400">{resource.description}</p>
                                                                    )}
                                                                    {resource.fileName && (
                                                                        <p className="text-xs text-slate-500 mt-1">
                                                                            {resource.fileName} {resource.formattedFileSize && `(${resource.formattedFileSize})`}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {resource.downloadUrl && (
                                                                <a
                                                                    href={resource.downloadUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
                                                                >
                                                                    <Download className="w-4 h-4" />
                                                                    Download
                                                                </a>
                                                            )}
                                                            {resource.externalUrl && !resource.downloadUrl && (
                                                                <a
                                                                    href={resource.externalUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
                                                                >
                                                                    <ExternalLink className="w-4 h-4" />
                                                                    Open
                                                                </a>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Quizzes Section */}
                                        {lessonQuizzes.length > 0 && (
                                            <div className="bg-slate-800 rounded-lg p-4">
                                                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                                    <Award className="w-5 h-5" />
                                                    Quizzes
                                                </h3>
                                                <div className="space-y-2">
                                                    {lessonQuizzes.map((quiz) => (
                                                        <div
                                                            key={quiz.id}
                                                            className="flex items-center justify-between p-3 bg-slate-750 hover:bg-slate-700 rounded-lg transition-colors"
                                                        >
                                                            <div className="flex-1">
                                                                <p className="text-white font-medium">{quiz.title}</p>
                                                                {quiz.description && (
                                                                    <p className="text-sm text-slate-400 mt-1">{quiz.description}</p>
                                                                )}
                                                                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                                                    {quiz.totalQuestions && (
                                                                        <span>{quiz.totalQuestions} questions</span>
                                                                    )}
                                                                    {quiz.timeLimit && (
                                                                        <span className="flex items-center gap-1">
                                                                            <Clock className="w-3 h-3" />
                                                                            {quiz.timeLimit} mins
                                                                        </span>
                                                                    )}
                                                                    {quiz.passingScore && (
                                                                        <span>Passing: {quiz.passingScore}%</span>
                                                                    )}
                                                                    <span className={`px-2 py-0.5 rounded ${quiz.status === 'PUBLISHED' ? 'bg-green-900/30 text-green-400' :
                                                                        quiz.status === 'DRAFT' ? 'bg-amber-900/30 text-amber-400' :
                                                                            'bg-slate-700 text-slate-400'
                                                                        }`}>
                                                                        {quiz.status}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Assignments Section */}
                                        {lessonAssignments.length > 0 && (
                                            <div className="bg-slate-800 rounded-lg p-4">
                                                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                                    <FileQuestion className="w-5 h-5" />
                                                    Assignments
                                                </h3>
                                                <div className="space-y-2">
                                                    {lessonAssignments.map((assignment) => (
                                                        <div
                                                            key={assignment.id}
                                                            className="flex items-center justify-between p-3 bg-slate-750 hover:bg-slate-700 rounded-lg transition-colors"
                                                        >
                                                            <div className="flex-1">
                                                                <p className="text-white font-medium">{assignment.title}</p>
                                                                {assignment.description && (
                                                                    <p className="text-sm text-slate-400 mt-1">{assignment.description}</p>
                                                                )}
                                                                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                                                    {assignment.maxScore && (
                                                                        <span>Max score: {assignment.maxScore}</span>
                                                                    )}
                                                                    {assignment.dueDate && (
                                                                        <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                                                                    )}
                                                                    {assignment.totalSubmissions !== undefined && (
                                                                        <span>{assignment.totalSubmissions} submissions</span>
                                                                    )}
                                                                    <span className={`px-2 py-0.5 rounded ${assignment.status === 'PUBLISHED' ? 'bg-green-900/30 text-green-400' :
                                                                        assignment.status === 'DRAFT' ? 'bg-amber-900/30 text-amber-400' :
                                                                            'bg-slate-700 text-slate-400'
                                                                        }`}>
                                                                        {assignment.status}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Empty State */}
                                        {lessonResources.length === 0 && lessonQuizzes.length === 0 && lessonAssignments.length === 0 && (
                                            <div className="bg-slate-800 rounded-lg p-8 text-center">
                                                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                                                <p className="text-slate-400">No additional content for this lesson</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Navigation Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={goToPreviousLesson}
                                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Previous
                                    </button>
                                    <button
                                        onClick={goToNextLesson}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <Play className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                                <p className="text-xl font-semibold text-white mb-2">
                                    Select a lesson to start
                                </p>
                                <p className="text-slate-400">
                                    Choose a lesson from the sidebar to begin
                                </p>
                            </div>
                        </div>
                    )
                    }
                </main >
            </div >

            {/* Sidebar Overlay for Mobile */}
            {
                sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )
            }
        </div >
    );
}
