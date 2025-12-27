/**
 * LessonResourcesManageScreen
 * Route: /lessons/:lessonId/resources
 * Layout: CreatorLayout
 * Guard: requireCreator
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - GET /lessons/:lessonId/resources (RESOURCE_GET_BY_LESSON)
 */
export default function LessonResourcesManageScreen({
  params,
}: {
  params: { lessonId: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>LessonResourcesManageScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Lesson ID: {params.lessonId}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement RESOURCE_GET_BY_LESSON query</li>
          <li>Render resources management</li>
          <li>Add create/edit/delete functionality</li>
          <li>Handle error states</li>
        </ul>
      </div>
    </div>
  );
}

