/**
 * LessonPlayerScreen
 * Route: /learn/:courseSlug/lessons/:id
 * Layout: AuthenticatedLayout
 * Guard: requireStudent (+ enrolledGuard)
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - GET /lessons/:id
 * - GET /lessons/:id/video/stream-url
 * - GET /lessons/:id/resources
 * - GET /lessons/:id/comments?page=&size=
 */
export default function LessonPlayerScreen({
  params,
  searchParams,
}: {
  params: { courseSlug: string; id: string };
  searchParams: { page?: string; size?: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>LessonPlayerScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Course slug: {params.courseSlug}, Lesson ID: {params.id}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement LESSON_GET_BY_ID query</li>
          <li>Implement LESSON_GET_VIDEO_STREAM_URL query</li>
          <li>Implement RESOURCE_GET_BY_LESSON query</li>
          <li>Implement COMMENT_GET_LESSON_LIST query</li>
          <li>Render video player with resources and comments</li>
          <li>Add mark viewed/completed actions</li>
          <li>Handle 403 (not enrolled) / error states</li>
        </ul>
      </div>
    </div>
  );
}

