'use client';

import { useState } from 'react';
import { 
  BookOpen, 
  DollarSign, 
  Image as ImageIcon,
  Settings,
  ChevronRight,
  Check,
  Tag,
  Info,
  Award,
  Upload
} from 'lucide-react';

import StepProgress from '@/core/components/instructor/create-course/StepProgress';
import StepBasicInfo from '@/core/components/instructor/create-course/StepBasicInfo';
import StepCourseImage from '@/core/components/instructor/create-course/StepCourseImage';
import StepPricing from '@/core/components/instructor/create-course/StepPricing';
import StepSettings from '@/core/components/instructor/create-course/StepSettings';
import CoursePreview from '@/core/components/instructor/create-course/CoursePreview';

type Step = 1 | 2 | 3 | 4;

export default function CreateCourseWizardPage() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [courseData, setCourseData] = useState({
    // Step 1: Basic Info
    title: '',
    subtitle: '',
    description: '',
    category: '',
    subcategory: '',
    topic: '',
    language: '',
    level: '',
    
    // Step 2: Course Image
    thumbnail: null as File | null,
    thumbnailPreview: null as string | null,
    
    // Step 3: Pricing
    price: '',
    currency: 'USD',
    
    // Step 4: Settings
    maxStudents: '',
    courseUrl: '',
    requirements: [''],
    whatYouWillLearn: [''],
    targetAudience: ['']
  });

  const steps = [
    { number: 1, title: 'Basic Information', icon: BookOpen },
    { number: 2, title: 'Course Image', icon: ImageIcon },
    { number: 3, title: 'Pricing', icon: DollarSign },
    { number: 4, title: 'Settings', icon: Settings }
  ];

  const categories = [
    { value: 'development', label: 'Development', subcategories: ['Web Development', 'Mobile Development', 'Game Development', 'Database'] },
    { value: 'business', label: 'Business', subcategories: ['Entrepreneurship', 'Marketing', 'Sales', 'Management'] },
    { value: 'design', label: 'Design', subcategories: ['Graphic Design', 'UX/UI Design', '3D Design', 'Animation'] },
    { value: 'it-software', label: 'IT & Software', subcategories: ['IT Certification', 'Network & Security', 'Hardware', 'Operating Systems'] },
    { value: 'personal-development', label: 'Personal Development', subcategories: ['Productivity', 'Leadership', 'Career Development', 'Communication'] }
  ];

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCourseData({ 
        ...courseData, 
        thumbnail: file,
        thumbnailPreview: URL.createObjectURL(file)
      });
    }
  };

  const addArrayItem = (field: 'requirements' | 'whatYouWillLearn' | 'targetAudience') => {
    setCourseData({
      ...courseData,
      [field]: [...courseData[field], '']
    });
  };

  const updateArrayItem = (field: 'requirements' | 'whatYouWillLearn' | 'targetAudience', index: number, value: string) => {
    const newArray = [...courseData[field]];
    newArray[index] = value;
    setCourseData({
      ...courseData,
      [field]: newArray
    });
  };

  const removeArrayItem = (field: 'requirements' | 'whatYouWillLearn' | 'targetAudience', index: number) => {
    setCourseData({
      ...courseData,
      [field]: courseData[field].filter((_, i) => i !== index)
    });
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const handleSubmit = () => {
    console.log('Course data:', courseData);
    // API call to create course
    alert('Course created successfully! Redirecting to Course Builder...');
  };

  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 1:
        return Boolean(courseData.title && courseData.description && courseData.category && courseData.level);
      case 2:
        return courseData.thumbnail !== null;
      case 3:
        return courseData.price !== '';
      case 4:
        return true; // Optional fields
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      {/* Main Content */}
      <main className="w-[95%] mx-auto py-8">
        {/* Page Title */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">Create New Course</h2>
          <p className="text-gray-400">Follow the steps below to create your course</p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-12">
          <StepProgress
            steps={steps}
            currentStep={currentStep}
            isStepComplete={isStepComplete}
          />
        </div>

        {/* Form Container */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#12182b] border border-gray-800 rounded-lg p-8">
            {currentStep === 1 && (
              <StepBasicInfo
                courseData={courseData}
                setCourseData={setCourseData}
                categories={categories}
              />
            )}
            {currentStep === 2 && (
              <StepCourseImage
                courseData={courseData}
                setCourseData={setCourseData}
                handleThumbnailUpload={handleThumbnailUpload}
              />
            )}
            {currentStep === 3 && (
              <StepPricing
                courseData={courseData}
                setCourseData={setCourseData}
              />
            )}
            {currentStep === 4 && (
              <StepSettings
                courseData={courseData}
                setCourseData={setCourseData}
                addArrayItem={addArrayItem}
                updateArrayItem={updateArrayItem}
                removeArrayItem={removeArrayItem}
              />
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-700">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className="px-6 py-3 border border-gray-700 hover:bg-[#1a2237] rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>
              <div className="flex items-center gap-3">
                {currentStep < 4 ? (
                  <button
                    onClick={handleNext}
                    disabled={!isStepComplete(currentStep)}
                    className="flex items-center gap-2 px-6 py-3 bg-[#00ff00] hover:bg-[#00dd00] disabled:bg-gray-700 disabled:cursor-not-allowed text-black rounded-lg font-medium transition-colors"
                  >
                    Next Step
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-6 py-3 bg-[#00ff00] hover:bg-[#00dd00] text-black rounded-lg font-medium transition-colors"
                  >
                    Create Course & Add Content
                    <Check className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Preview Card */}
          <CoursePreview courseData={courseData} categories={categories} />
        </div>
      </main>
    </div>
  );
}
