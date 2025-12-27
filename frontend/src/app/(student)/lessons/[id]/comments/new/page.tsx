/**
 * CreateLessonCommentScreen
 * Route: /lessons/:id/comments/new
 * Layout: AuthenticatedLayout
 * Guard: requireStudent
 */
export default function CreateLessonCommentScreen({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>CreateLessonCommentScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Lesson ID: {params.id}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement COMMENT_CREATE_LESSON mutation</li>
          <li>Render comment form</li>
          <li>Handle validation/error states</li>
        </ul>
      </div>
    </div>
  );
}

