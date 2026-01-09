/**
 * QuizAttemptScreen
 * Route: /learn/:courseSlug/quizzes/:id/attempt
 * Layout: AuthenticatedLayout
 * Guard: requireStudent
 */
export default function QuizAttemptScreen({
  params,
}: {
  params: { courseSlug: string; id: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>QuizAttemptScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Course slug: {params.courseSlug}, Quiz ID: {params.id}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement QUIZ_START_ACTION on enter</li>
          <li>Implement QUIZ_GET_BY_ID query</li>
          <li>Render quiz questions</li>
          <li>Add submit answer functionality</li>
          <li>Add finish quiz functionality</li>
          <li>Handle timeout/error states</li>
        </ul>
      </div>
    </div>
  );
}

