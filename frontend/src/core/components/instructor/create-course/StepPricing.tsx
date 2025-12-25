import { DollarSign, Tag, Check } from 'lucide-react';

interface StepPricingProps {
  courseData: any;
  setCourseData: (data: any) => void;
}

export default function StepPricing({ courseData, setCourseData }: StepPricingProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-[#00ff00]" />
          Course Pricing
        </h3>
        <p className="text-gray-400 mb-6">Set the price for your course</p>
      </div>

      {/* Pricing Options */}
      <div className="grid grid-cols-2 gap-6">
        {/* Free Course */}
        <button
          onClick={() => setCourseData({ ...courseData, price: '0' })}
          className={`p-6 border-2 rounded-lg text-left transition-all ${
            courseData.price === '0'
              ? 'border-[#00ff00] bg-[#00ff00]/10'
              : 'border-gray-700 hover:border-gray-600'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-xl font-semibold mb-2">Free Course</h4>
              <p className="text-sm text-gray-400">Make your course accessible to everyone</p>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              courseData.price === '0' ? 'border-[#00ff00] bg-[#00ff00]' : 'border-gray-700'
            }`}>
              {courseData.price === '0' && <Check className="w-4 h-4 text-black" />}
            </div>
          </div>
          <div className="text-3xl font-bold text-[#00ff00]">$0</div>
        </button>

        {/* Paid Course */}
        <button
          onClick={() => setCourseData({ ...courseData, price: courseData.price === '0' ? '' : courseData.price })}
          className={`p-6 border-2 rounded-lg text-left transition-all ${
            courseData.price !== '0'
              ? 'border-[#00ff00] bg-[#00ff00]/10'
              : 'border-gray-700 hover:border-gray-600'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-xl font-semibold mb-2">Paid Course</h4>
              <p className="text-sm text-gray-400">Set a custom price for your course</p>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              courseData.price !== '0' ? 'border-[#00ff00] bg-[#00ff00]' : 'border-gray-700'
            }`}>
              {courseData.price !== '0' && <Check className="w-4 h-4 text-black" />}
            </div>
          </div>
          <div className="text-3xl font-bold text-[#00ff00]">Custom</div>
        </button>
      </div>

      {/* Price Input (only for paid courses) */}
      {courseData.price !== '0' && (
        <div className="bg-[#1a2237] border border-gray-700 rounded-lg p-6">
          <label className="block text-sm font-medium mb-3">
            Set Your Price <span className="text-red-400">*</span>
          </label>
          <div className="flex items-center gap-4">
            <select
              value={courseData.currency}
              onChange={(e) => setCourseData({ ...courseData, currency: e.target.value })}
              className="bg-[#12182b] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00ff00]"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="VND">VND (₫)</option>
            </select>
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">$</span>
              <input
                type="number"
                placeholder="99.99"
                value={courseData.price === '0' ? '' : courseData.price}
                onChange={(e) => setCourseData({ ...courseData, price: e.target.value })}
                className="w-full bg-[#12182b] border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white text-lg placeholder:text-gray-500 focus:outline-none focus:border-[#00ff00]"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Suggested pricing: $19.99 - $199.99 depending on course content and length
          </p>
        </div>
      )}

      {/* Pricing Tips */}
      <div className="bg-[#1a2237] border border-gray-700 rounded-lg p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5 text-[#00ff00]" />
          Pricing Tips
        </h4>
        <ul className="space-y-3 text-sm text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-[#00ff00] mt-0.5">•</span>
            <span>Research similar courses to understand market pricing</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#00ff00] mt-0.5">•</span>
            <span>Consider the value you provide: content quality, duration, and outcomes</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#00ff00] mt-0.5">•</span>
            <span>Free courses can help build your reputation and student base</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#00ff00] mt-0.5">•</span>
            <span>You can offer promotional discounts later to attract more students</span>
          </li>
        </ul>
      </div>
    </div>
  );
}