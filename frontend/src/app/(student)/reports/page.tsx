/**
 * MyReportsScreen
 * Route: /reports
 * Layout: AuthenticatedLayout
 * Guard: requireStudent
 */
export default function MyReportsScreen() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>MyReportsScreen</h1>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement REPORT_GET_MY_LIST query</li>
          <li>Render reports list</li>
          <li>Handle empty/error states</li>
        </ul>
      </div>
    </div>
  );
}

