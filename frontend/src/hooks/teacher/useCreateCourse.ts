import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { courseService } from "@/services/courses/course.service";
import { courseVersionService } from "@/services/courses/course-version.service";
import { categoryService } from "@/services/courses/category.service";
import { tagService } from "@/services/courses/tag.service";
import {
  CourseRequest,
  CourseVersionRequest,
  CourseDetailResponse,
  Difficulty,
} from "@/services/courses/course.types";

export interface CourseFormData {
  // Step 1: Basic Info
  title: string;
  shortDescription: string;
  categoryId: number;
  difficulty: Difficulty | "";
  tags: string[];

  // Step 2: SEO & Meta
  metaTitle: string;
  metaDescription: string;
  seoKeywords: string;
  isIndexed: boolean;
  isClosed: boolean;

  // Step 3: Thumbnail
  thumbnailFile: File | null;
  thumbnailPreview: string | null;

  // Step 4: Version Details
  versionTitle: string;
  versionDescription: string;
  price: number;
  durationDays: number;
  passScore: number;
  finalWeight: number;
  minProgressPct: number;
  notes: string;
}

export const useCreateCourse = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [createdCourse, setCreatedCourse] =
    useState<CourseDetailResponse | null>(null);

  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    shortDescription: "",
    categoryId: 0,
    difficulty: "",
    tags: [],
    metaTitle: "",
    metaDescription: "",
    seoKeywords: "",
    isIndexed: true,
    isClosed: false,
    thumbnailFile: null,
    thumbnailPreview: null,
    versionTitle: "",
    versionDescription: "",
    price: 0,
    durationDays: 30,
    passScore: 8.0, // Scale 0-10
    finalWeight: 0.6, // Scale 0-1
    minProgressPct: 80,
    notes: "",
  });

  // Fetch categories
  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getCategoryTree(),
  });

  // Fetch tags
  const { data: tagsData, isLoading: loadingTags } = useQuery({
    queryKey: ["tags"],
    queryFn: () => tagService.getTags(),
  });

  const tags = tagsData?.items || [];

  // Mutation: Create Course
  const createCourseMutation = useMutation({
    mutationFn: async (data: CourseRequest) => {
      return await courseService.createCourse(data);
    },
    onSuccess: (data) => {
      setCreatedCourse(data);
      toast.success("Course created successfully!");
      setCurrentStep(2); // Move to SEO settings (not 3!)
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create course");
    },
  });

  // Mutation: Upload Thumbnail
  const uploadThumbnailMutation = useMutation({
    mutationFn: async ({
      courseId,
      file,
    }: {
      courseId: number;
      file: File;
    }) => {
      return await courseService.uploadThumbnail(courseId, file);
    },
    onSuccess: () => {
      toast.success("Thumbnail uploaded successfully!");
      setCurrentStep(4); // Move to version creation
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to upload thumbnail");
    },
  });

  // Mutation: Update Course Version (version 1 is auto-created with course)
  const updateVersionMutation = useMutation({
    mutationFn: async ({
      courseId,
      versionId,
      data,
    }: {
      courseId: number;
      versionId: number;
      data: CourseVersionRequest;
    }) => {
      return await courseVersionService.updateCourseVersion(
        courseId,
        versionId,
        data
      );
    },
    onSuccess: (updatedVersion) => {
      toast.success("Course version updated successfully!");
      toast.success("Redirecting to course builder...");
      // Redirect to version content page to start building
      if (createdCourse) {
        router.push(
          `/teacher/courses/${createdCourse.slug}/versions/${updatedVersion.id}/content`
        );
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update course version");
    },
  });

  const updateFormData = (updates: Partial<CourseFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleThumbnailSelect = (file: File) => {
    updateFormData({
      thumbnailFile: file,
      thumbnailPreview: URL.createObjectURL(file),
    });
  };

  const submitBasicInfo = async () => {
    // Get teacherId from auth context or user session
    const teacherId = 1; // TODO: Get from useAuth hook

    const courseData: CourseRequest = {
      title: formData.title,
      shortDescription: formData.shortDescription,
      categoryId: formData.categoryId,
      teacherId,
      difficulty: formData.difficulty || undefined,
      tags: formData.tags,
      isClosed: formData.isClosed,
      isIndexed: formData.isIndexed,
    };

    await createCourseMutation.mutateAsync(courseData);
  };

  const submitSEOInfo = async () => {
    if (!createdCourse) return;

    const updateData = {
      metaTitle: formData.metaTitle,
      metaDescription: formData.metaDescription,
      seoKeywords: formData.seoKeywords,
      isIndexed: formData.isIndexed,
    };

    try {
      await courseService.updateCourse(createdCourse.id, updateData);
      toast.success("SEO information updated!");
      setCurrentStep(3);
    } catch (error: any) {
      toast.error(error?.message || "Failed to update SEO info");
    }
  };

  const submitThumbnail = async () => {
    if (!createdCourse || !formData.thumbnailFile) {
      toast.error("Please select a thumbnail");
      return;
    }

    await uploadThumbnailMutation.mutateAsync({
      courseId: createdCourse.id,
      file: formData.thumbnailFile,
    });
  };

  const submitVersion = async () => {
    if (!createdCourse) return;

    try {
      // Get the first version that was auto-created
      const versions = await courseVersionService.getCourseVersions(
        createdCourse.id
      );
      if (!versions || versions.length === 0) {
        toast.error("No version found for this course");
        return;
      }

      const firstVersion = versions[0];

      // Check if user provided any custom version data
      const hasCustomData =
        formData.versionTitle.trim() ||
        formData.versionDescription.trim() ||
        formData.price !== 0 ||
        formData.durationDays !== 30 ||
        formData.passScore !== 8.0 ||
        formData.finalWeight !== 0.6;

      if (hasCustomData) {
        const versionData: CourseVersionRequest = {
          title: formData.versionTitle || firstVersion.title,
          description: formData.versionDescription,
          price: formData.price,
          durationDays: formData.durationDays,
          passScore: formData.passScore,
          finalWeight: formData.finalWeight,
          minProgressPct: formData.minProgressPct,
          notes: formData.notes,
        };

        try {
          await updateVersionMutation.mutateAsync({
            courseId: createdCourse.id,
            versionId: firstVersion.id,
            data: versionData,
          });
        } catch (error: any) {
          // If update fails (API not available), just redirect
          console.warn(
            "Update version API not available, redirecting...",
            error
          );
          toast.warning("Version created with default values");
          toast.success("Redirecting to course builder...");
          router.push(
            `/teacher/courses/${createdCourse.slug}/versions/${firstVersion.id}/content`
          );
        }
      } else {
        // No custom data, just redirect
        toast.success("Course created successfully!");
        router.push(
          `/teacher/courses/${createdCourse.slug}/versions/${firstVersion.id}/content`
        );
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to process version");
    }
  };

  const skipThumbnail = () => {
    setCurrentStep(4);
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Combined loading state for easier consumption
  const isLoading =
    createCourseMutation.isPending ||
    uploadThumbnailMutation.isPending ||
    updateVersionMutation.isPending;

  return {
    formData,
    updateFormData,
    currentStep,
    setCurrentStep,
    categories,
    tags,
    loadingCategories,
    loadingTags,
    createdCourse,
    handleThumbnailSelect,
    submitBasicInfo,
    submitSEOInfo,
    submitThumbnail,
    submitVersion,
    skipThumbnail,
    goBack,
    isLoading,
    isCreatingCourse: createCourseMutation.isPending,
    isUploadingThumbnail: uploadThumbnailMutation.isPending,
    isUpdatingVersion: updateVersionMutation.isPending,
  };
};
