/**
 * CourseListScreen
 * Route: /courses
 * Layout: PublicLayout
 * Guard: none
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - GET /courses?page=&size=&sort= (default sort: newest/popular)
 * - (optional) GET /categories/tree for filters
 */
export default function CourseListScreen({
  searchParams,
}: {
  searchParams: { page?: string; size?: string; sort?: string; category?: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>CourseListScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Page: {searchParams.page || "1"}, Size: {searchParams.size || "default"}, Sort: {searchParams.sort || "default"}
      </p>
      {searchParams.category && (
        <p className="text-gray-600 dark:text-gray-400">
          Category: {searchParams.category}
        </p>
      )}
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement COURSE_GET_LIST query</li>
          <li>Add filters (category, level, rating, price)</li>
          <li>Add sort options</li>
          <li>Implement pagination</li>
          <li>Handle empty/error states</li>
        </ul>
      </div>
    </div>
  );
}

