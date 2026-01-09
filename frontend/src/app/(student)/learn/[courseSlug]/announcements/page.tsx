/**
 * CourseAnnouncementsScreen
 * Route: /learn/:courseSlug/announcements
 * Layout: AuthenticatedLayout
 * Guard: requireStudent
 */
export default function CourseAnnouncementsScreen({
  params,
}: {
  params: { courseSlug: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>CourseAnnouncementsScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Course slug: {params.courseSlug}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement notifications/announcements query for course</li>
          <li>Render announcements list</li>
          <li>Add mark as read functionality</li>
          <li>Handle empty/error states</li>
        </ul>
      </div>
    </div>
  );
}

