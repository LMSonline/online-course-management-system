import { Image as ImageIcon, Award, Upload } from 'lucide-react';

interface StepCourseImageProps {
  courseData: any;
  setCourseData: (data: any) => void;
  handleThumbnailUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function StepCourseImage({ courseData, setCourseData, handleThumbnailUpload }: StepCourseImageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-[#00ff00]" />
          Course Image
        </h3>
        <p className="text-gray-400 mb-6">Upload a high-quality image that represents your course</p>
      </div>

      {/* Image Guidelines */}
      <div className="bg-[#1a2237] border border-gray-700 rounded-lg p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-[#00ff00]" />
          Image Requirements
        </h4>
        <ul className="space-y-2 text-sm text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-[#00ff00] mt-0.5">✓</span>
            <span><strong>Dimensions:</strong> 1280x720 pixels (16:9 ratio) recommended</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#00ff00] mt-0.5">✓</span>
            <span><strong>Format:</strong> JPG or PNG</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#00ff00] mt-0.5">✓</span>
            <span><strong>Size:</strong> Maximum 5MB</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#00ff00] mt-0.5">✓</span>
            <span><strong>Quality:</strong> High resolution, clear and professional</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#00ff00] mt-0.5">✓</span>
            <span><strong>Content:</strong> Should be relevant to your course topic</span>
          </li>
        </ul>
      </div>

      {/* Upload Area */}
      {!courseData.thumbnailPreview ? (
        <label className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center hover:border-[#00ff00] transition-colors cursor-pointer block bg-[#1a2237]">
          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-lg text-white mb-2">Click to upload course image</p>
          <p className="text-sm text-gray-400 mb-4">
            JPG, PNG (1280x720 recommended, max 5MB)
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailUpload}
            className="hidden"
          />
          <button type="button" className="px-6 py-2 bg-[#00ff00] hover:bg-[#00dd00] text-black rounded-lg font-medium transition-colors">
            Choose File
          </button>
        </label>
      ) : (
        <div className="space-y-4">
          {/* Image Preview */}
          <div className="relative bg-[#1a2237] border border-gray-700 rounded-lg overflow-hidden">
            <img 
              src={courseData.thumbnailPreview} 
              alt="Course thumbnail preview" 
              className="w-full h-auto"
            />
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setCourseData({ ...courseData, thumbnail: null, thumbnailPreview: null })}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              >
                Remove Image
              </button>
            </div>
          </div>

          {/* Image Info */}
          {courseData.thumbnail && (
            <div className="bg-[#1a2237] border border-gray-700 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Filename:</span>
                  <p className="text-white font-medium truncate">{courseData.thumbnail.name}</p>
                </div>
                <div>
                  <span className="text-gray-400">Size:</span>
                  <p className="text-white font-medium">{(courseData.thumbnail.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
            </div>
          )}

          {/* Upload Different Image */}
          <label className="w-full flex items-center justify-center gap-2 py-3 border border-gray-700 hover:bg-[#1a2237] rounded-lg transition-colors cursor-pointer">
            <Upload className="w-5 h-5" />
            Upload Different Image
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailUpload}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
}