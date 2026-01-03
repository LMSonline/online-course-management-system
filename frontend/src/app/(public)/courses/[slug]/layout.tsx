import { Metadata } from "next";
import { courseService } from "@/services/courses/course.service";

/**
 * Generate metadata for course detail page
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const course = await courseService.getCourseBySlug(slug);
    
    return {
      title: course.metaTitle || `${course.title} | LMS`,
      description: course.metaDescription || course.shortDescription || `Learn ${course.title} on LMS`,
      keywords: course.seoKeywords?.split(",").map((k) => k.trim()) || [],
      openGraph: {
        title: course.title,
        description: course.shortDescription || "",
        images: course.thumbnailUrl ? [course.thumbnailUrl] : [],
      },
    };
  } catch {
    return {
      title: "Course | LMS",
      description: "Course details",
    };
  }
}

