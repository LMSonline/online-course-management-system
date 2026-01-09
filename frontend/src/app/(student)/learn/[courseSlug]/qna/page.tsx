/**
 * CourseQAScreen
 * Route: /learn/:courseSlug/qna
 * Layout: AuthenticatedLayout
 * Guard: requireStudent
 */
export default function CourseQAScreen({
  params,
}: {
  params: { courseSlug: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>CourseQAScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Course slug: {params.courseSlug}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement Q&A/questions query for course</li>
          <li>Render questions list</li>
          <li>Handle empty/error states</li>
        </ul>
      </div>
    </div>
  );
}

