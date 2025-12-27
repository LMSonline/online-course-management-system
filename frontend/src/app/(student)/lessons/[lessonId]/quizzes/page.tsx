/**
 * LessonQuizzesScreen
 * Route: /lessons/:lessonId/quizzes
 * Layout: AuthenticatedLayout
 * Guard: requireStudent
 */
export default function LessonQuizzesScreen({
  params,
}: {
  params: { lessonId: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>LessonQuizzesScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Lesson ID: {params.lessonId}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement QUIZ_GET_BY_LESSON query</li>
          <li>Render quizzes for lesson</li>
          <li>Handle empty/error states</li>
        </ul>
      </div>
    </div>
  );
}

