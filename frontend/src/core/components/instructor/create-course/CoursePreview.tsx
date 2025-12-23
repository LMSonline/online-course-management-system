interface CoursePreviewProps {
  courseData: any;
  categories: Array<{ value: string; label: string; subcategories: string[] }>;

}

export default function CoursePreview({ courseData, categories }: CoursePreviewProps) {
  return (
    <div className="mt-6 bg-[#1a2237] border border-[#00ff00]/30 rounded-lg p-6">
      <h4 className="font-semibold mb-4 text-[#00ff00]">Course Preview</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Title:</span>
          <span className="text-white font-medium">{courseData.title || 'Not set'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Category:</span>
          <span className="text-white font-medium">
            {courseData.category ? categories.find(c => c.value === courseData.category)?.label : 'Not set'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Level:</span>
          <span className="text-white font-medium">{courseData.level || 'Not set'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Price:</span>
          <span className="text-white font-medium">
            {courseData.price === '0' ? 'Free' : courseData.price ? `$${courseData.price}` : 'Not set'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Image:</span>
          <span className="text-white font-medium">{courseData.thumbnail ? 'Uploaded' : 'Not uploaded'}</span>
        </div>
      </div>
    </div>
  );
}