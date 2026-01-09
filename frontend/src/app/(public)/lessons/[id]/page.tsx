/**
 * LessonDetailPublicScreen
 * Route: /lessons/:id
 * Layout: PublicLayout
 * Guard: none
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - GET /lessons/:id
 */
export default function LessonDetailPublicScreen({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>LessonDetailPublicScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Lesson ID: {params.id}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement LESSON_GET_BY_ID query</li>
          <li>Render lesson preview</li>
          <li>Handle 404/error states</li>
        </ul>
      </div>
    </div>
  );
}

