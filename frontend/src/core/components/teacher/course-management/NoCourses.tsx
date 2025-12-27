import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function NoCourses({ searchQuery }: { searchQuery: string }) {
  return (
    <div className="text-center py-16 border border-dashed border-gray-800 rounded-lg">
      <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-2">No courses found</h3>
      <p className="text-gray-400 mb-6">
        {searchQuery 
          ? `No courses match "${searchQuery}"`
          : 'Start creating your first course!'
        }
      </p>
      {!searchQuery && (
        <Link href="/instructor/create-course" className="px-6 py-3 bg-[#00ff00] hover:bg-[#00dd00] text-black rounded-lg font-medium transition-colors">
          Create Your First Course
        </Link>
      )}
    </div>
  );
}
