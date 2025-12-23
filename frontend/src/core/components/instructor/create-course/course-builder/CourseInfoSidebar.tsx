import React from 'react';

export default function CourseInfoSidebar() {
  return (
    <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Course Information</h3>
      <div className="space-y-4 text-sm">
        <div>
          <div className="text-gray-400 mb-1">Title</div>
          <div className="text-white font-medium">React & TypeScript for Modern Web Apps</div>
        </div>
        <div>
          <div className="text-gray-400 mb-1">Category</div>
          <div className="text-white">Development</div>
        </div>
        <div>
          <div className="text-gray-400 mb-1">Level</div>
          <div className="text-white">Intermediate</div>
        </div>
        <div>
          <div className="text-gray-400 mb-1">Price</div>
          <div className="text-white">$99.99</div>
        </div>
      </div>
      <button className="w-full mt-4 py-2 border border-gray-700 hover:bg-[#1a2237] rounded-lg text-sm transition-colors">
        Edit Course Info
      </button>
    </div>
  );
}
