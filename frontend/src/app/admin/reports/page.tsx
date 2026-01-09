/**
 * AdminReportsAllScreen
 * Route: /admin/reports
 * Layout: AdminLayout
 * Guard: requireAdmin
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - GET /admin/reports?page=&size= (REPORT_GET_ALL_LIST)
 */
export default async function AdminReportsAllScreen({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const page = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const size = Array.isArray(sp.size) ? sp.size[0] : sp.size;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>AdminReportsAllScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Page: {page || "1"}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement REPORT_GET_ALL_LIST query</li>
          <li>Render reports list</li>
          <li>Add pagination</li>
          <li>Handle empty/error states</li>
        </ul>
      </div>
    </div>
  );
}

