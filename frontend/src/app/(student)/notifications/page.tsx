/**
 * NotificationsScreen
 * Route: /notifications
 * Layout: AuthenticatedLayout
 * Guard: requireStudent
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - GET /notifications?page=&size=&sort=createdAt,desc
 */
export default function NotificationsScreen({
  searchParams,
}: {
  searchParams: { page?: string; size?: string; sort?: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>NotificationsScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Page: {searchParams.page || "1"}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement NOTIFICATION_GET_LIST query</li>
          <li>Render notifications list</li>
          <li>Add mark as read functionality</li>
          <li>Add pagination</li>
          <li>Handle empty/error states</li>
        </ul>
      </div>
    </div>
  );
}

