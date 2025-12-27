/**
 * LessonVideoUploadFlowScreen
 * Route: /lessons/:id/video
 * Layout: CreatorLayout
 * Guard: requireCreator
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - GET /lessons/:id (LESSON_GET_BY_ID)
 * - POST /lessons/:id/video/upload-url (LESSON_GET_VIDEO_UPLOAD_URL) on file select
 */
export default function LessonVideoUploadFlowScreen({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>LessonVideoUploadFlowScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Lesson ID: {params.id}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement LESSON_GET_BY_ID query</li>
          <li>Implement LESSON_GET_VIDEO_UPLOAD_URL query</li>
          <li>Render video upload flow</li>
          <li>Handle upload progress/error states</li>
        </ul>
      </div>
    </div>
  );
}

