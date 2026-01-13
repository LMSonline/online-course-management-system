export type MyCourse = {
  id: string;
  courseId?: number; // Thêm trường này để so sánh với id backend
  slug: string;
  title: string;
  instructor: string;
  thumbColor: string; // Tailwind gradient classes
  thumbnailUrl?: string; // URL ảnh thumbnail
  progress: number;
  lastViewed: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  rating: number;
};