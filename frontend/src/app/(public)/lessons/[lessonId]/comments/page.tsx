/**
 * LessonCommentsPublicScreen
 * Route: /lessons/:lessonId/comments
 * Layout: PublicLayout
 * Guard: none
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - GET /lessons/:lessonId/comments?page=&size=&sort=latest
 */
export default function LessonCommentsPublicScreen({
  params,
  searchParams,
}: {
  params: { lessonId: string };
  searchParams: { page?: string; size?: string; sort?: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>LessonCommentsPublicScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Lesson ID: {params.lessonId}
      </p>
      <p className="text-gray-600 dark:text-gray-400">
        Page: {searchParams.page || "1"}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement COMMENT_GET_LESSON_LIST query</li>
          <li>Render comments list with pagination</li>
          <li>Handle empty/error states</li>
        </ul>
      </div>
    </div>
  );
}

