/**
 * ChapterManageScreen
 * Route: /courses/:courseId/versions/:versionId/chapters
 * Layout: CreatorLayout
 * Guard: requireCreator
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - GET /courses/:courseId/versions/:versionId/chapters (CHAPTER_GET_LIST)
 */
export default function ChapterManageScreen({
  params,
}: {
  params: { courseId: string; versionId: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>ChapterManageScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Course ID: {params.courseId}, Version ID: {params.versionId}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement CHAPTER_GET_LIST query</li>
          <li>Render chapters management</li>
          <li>Add create/edit/delete/reorder functionality</li>
          <li>Handle error states</li>
        </ul>
      </div>
    </div>
  );
}

