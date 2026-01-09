/**
 * AssignmentDetailScreen
 * Route: /assignments/:id
 * Layout: AuthenticatedLayout
 * Guard: requireStudent
 */
export default function AssignmentDetailScreen({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>AssignmentDetailScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Assignment ID: {params.id}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement ASSIGNMENT_GET_BY_ID query</li>
          <li>Render assignment details</li>
          <li>Handle 404/error states</li>
        </ul>
      </div>
    </div>
  );
}

