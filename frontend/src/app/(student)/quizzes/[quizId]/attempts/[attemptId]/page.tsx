/**
 * QuizAttemptPlayScreen
 * Route: /quizzes/:quizId/attempts/:attemptId
 * Layout: AuthenticatedLayout
 * Guard: requireStudent
 */
export default function QuizAttemptPlayScreen({
  params,
}: {
  params: { quizId: string; attemptId: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>QuizAttemptPlayScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Quiz ID: {params.quizId}, Attempt ID: {params.attemptId}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement attempt detail query</li>
          <li>Render quiz attempt (resume/play)</li>
          <li>Add submit answer functionality</li>
          <li>Add finish quiz functionality</li>
          <li>Handle timeout/error states</li>
        </ul>
      </div>
    </div>
  );
}

