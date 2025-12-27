/**
 * SubmitAssignmentScreen
 * Route: /assignments/:assignmentId/submit
 * Layout: AuthenticatedLayout
 * Guard: requireStudent
 */
export default function SubmitAssignmentScreen({
  params,
}: {
  params: { assignmentId: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>SubmitAssignmentScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Assignment ID: {params.assignmentId}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement ASSIGNMENT_GET_BY_ID query</li>
          <li>Implement SUBMISSION_CREATE mutation</li>
          <li>Render submission form with file upload</li>
          <li>Handle validation/error states</li>
        </ul>
      </div>
    </div>
  );
}

