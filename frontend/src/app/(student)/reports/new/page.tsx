/**
 * SubmitReportScreen
 * Route: /reports/new
 * Layout: AuthenticatedLayout
 * Guard: requireStudent
 */
export default function SubmitReportScreen() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>SubmitReportScreen</h1>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement REPORT_CREATE mutation</li>
          <li>Render report submission form</li>
          <li>Handle validation/error states</li>
        </ul>
      </div>
    </div>
  );
}

