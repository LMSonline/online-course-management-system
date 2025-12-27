/**
 * TagListScreen
 * Route: /tags
 * Layout: PublicLayout
 * Guard: none
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - GET /tags?page=&size=&sort= (or GET /tags if small list)
 */
export default async function TagListScreen({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const page = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const size = Array.isArray(sp.size) ? sp.size[0] : sp.size;
  const sort = Array.isArray(sp.sort) ? sp.sort[0] : sp.sort;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>TagListScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Page: {page || "1"}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement TAG_GET_LIST query</li>
          <li>Render tag list/grid</li>
          <li>Add search/filter (client-side if small list)</li>
          <li>Handle empty/error states</li>
        </ul>
      </div>
    </div>
  );
}

