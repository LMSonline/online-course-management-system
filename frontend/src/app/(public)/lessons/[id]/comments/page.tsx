/**
 * LessonCommentsPublicScreen
 * Route: /lessons/:id/comments
 * Layout: PublicLayout
 * Guard: none
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - GET /lessons/:id/comments?page=&size=&sort=latest
 */
export default async function LessonCommentsPublicScreen({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const page = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const size = Array.isArray(sp.size) ? sp.size[0] : sp.size;
  const sort = Array.isArray(sp.sort) ? sp.sort[0] : sp.sort;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>LessonCommentsPublicScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Lesson ID: {id}
      </p>
      <p className="text-gray-600 dark:text-gray-400">
        Page: {page || "1"}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement COMMENT_GET_LESSON_LIST query</li>
          <li>Render comments list with pagination</li>
          <li>Handle empty/error states</li>
        </ul>
      </div>
    </div>
  );
}

