/**
 * ReportDetailScreen
 * Route: /reports/:id
 * Layout: AuthenticatedLayout
 * Guard: requireStudent
 */
export default function ReportDetailScreen({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>ReportDetailScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Report ID: {params.id}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement REPORT_GET_DETAIL query</li>
          <li>Render report details</li>
          <li>Handle 404/error states</li>
        </ul>
      </div>
    </div>
  );
}

