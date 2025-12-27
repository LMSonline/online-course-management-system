/**
 * EditCommentScreen
 * Route: /comments/:id/edit
 * Layout: AuthenticatedLayout
 * Guard: requireStudent
 */
export default function EditCommentScreen({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>EditCommentScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Comment ID: {params.id}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement comment detail query (if available)</li>
          <li>Implement COMMENT_UPDATE mutation</li>
          <li>Render edit comment form</li>
          <li>Handle validation/error states</li>
        </ul>
      </div>
    </div>
  );
}

