"use client";

import { useCreateCourse } from "@/hooks/teacher/useCreateCourse";
import { Step1BasicInfo } from "@/core/components/teacher/create-course/Step1BasicInfo";
import { Step2SEOSettings } from "@/core/components/teacher/create-course/Step2SEOSettings";
import { Step3Thumbnail } from "@/core/components/teacher/create-course/Step3Thumbnail";
import { Step4VersionDetails } from "@/core/components/teacher/create-course/Step4VersionDetails";
import { StepProgress } from "@/core/components/teacher/create-course/StepProgress";
import { FileText, Search, Image, Target } from "lucide-react";

const STEPS = [
  { number: 1, title: "Basic Info", icon: FileText },
  { number: 2, title: "SEO Settings", icon: Search },
  { number: 3, title: "Thumbnail", icon: Image },
  { number: 4, title: "Version & Pricing", icon: Target },
];

export default function CreateCoursePage() {
  const {
    currentStep,
    formData,
    updateFormData,
    categories,
    tags,
    loadingCategories,
    loadingTags,
    isLoading,
    submitBasicInfo,
    submitSEOInfo,
    submitThumbnail,
    submitVersion,
    handleThumbnailSelect,
    skipThumbnail,
    goBack,
  } = useCreateCourse();

  return (
    <div className="max-w-6xl mx-auto my-3">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
            Create New Course
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Follow the steps below to set up your new course
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-12">
          <StepProgress currentStep={currentStep} steps={STEPS} />
        </div>

        {/* Step Content */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8">
          {currentStep === 1 && (
            <Step1BasicInfo
              formData={formData}
              updateFormData={updateFormData}
              categories={categories}
              tags={tags}
              loadingCategories={loadingCategories}
              loadingTags={loadingTags}
              onNext={submitBasicInfo}
              isLoading={isLoading}
            />
          )}

          {currentStep === 2 && (
            <Step2SEOSettings
              formData={formData}
              updateFormData={updateFormData}
              onNext={submitSEOInfo}
              onBack={goBack}
              isLoading={isLoading}
            />
          )}

          {currentStep === 3 && (
            <Step3Thumbnail
              formData={formData}
              onThumbnailSelect={handleThumbnailSelect}
              onNext={submitThumbnail}
              onBack={goBack}
              onSkip={skipThumbnail}
              isLoading={isLoading}
            />
          )}

          {currentStep === 4 && (
            <Step4VersionDetails
              formData={formData}
              updateFormData={updateFormData}
              onSubmit={submitVersion}
              onBack={goBack}
              isLoading={isLoading}
            />
          )}
        </div>

        {/* Help Text */}
        <div className="text-center mt-8">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Need help?{" "}
            <a
              href="/teacher/help"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View our course creation guide
            </a>
          </p>
        </div>
      </div>
  );
}
