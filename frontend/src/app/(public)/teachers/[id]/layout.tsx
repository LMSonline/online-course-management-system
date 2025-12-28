import { Metadata } from "next";
import { teacherService } from "@/services/teacher/teacher.service";

/**
 * Generate metadata for teacher profile page
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const teacherId = parseInt(id, 10);
  
  if (isNaN(teacherId)) {
    return {
      title: "Instructor | LMS",
      description: "Teacher profile",
    };
  }
  
  try {
    const teacher = await teacherService.getById(teacherId);
    
    return {
      title: `${teacher.fullName || `Teacher #${teacherId}`} | Instructor | LMS`,
      description: teacher.bio || teacher.headline || `View courses by ${teacher.fullName || "this instructor"}`,
      openGraph: {
        title: teacher.fullName || `Teacher #${teacherId}`,
        description: teacher.headline || teacher.bio || "",
        images: teacher.avatarUrl ? [teacher.avatarUrl] : [],
      },
    };
  } catch {
    return {
      title: "Instructor | LMS",
      description: "Teacher profile",
    };
  }
}

