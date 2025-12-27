/**
 * SearchResultsScreen
 * Route: /search
 * Layout: PublicLayout
 * Guard: none
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - GET /courses?q={searchQuery}&page=&size=&sort=
 * - (optional) GET /categories/tree for filters
 * 
 * Query params: ?q=&sort=&page=
 */
export default function SearchResultsScreen({
  searchParams,
}: {
  searchParams: { q?: string; sort?: string; page?: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>SearchResultsScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Search query: {searchParams.q || "(none)"}
      </p>
      <p className="text-gray-600 dark:text-gray-400">
        Sort: {searchParams.sort || "default"}
      </p>
      <p className="text-gray-600 dark:text-gray-400">
        Page: {searchParams.page || "1"}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement COURSE_GET_LIST with search query</li>
          <li>Add filters (category, level, rating, price)</li>
          <li>Add sort options</li>
          <li>Implement pagination</li>
          <li>Handle empty/error states</li>
        </ul>
      </div>
    </div>
  );
}

