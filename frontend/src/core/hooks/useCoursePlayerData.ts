import useSWR from "swr";

export interface LessonData {
  id: string;
  title: string;
  duration: string;
  isPreview?: boolean;
  videoUrl: string;
  description?: string;
  resources?: any[];
  notes?: string;
}

export interface SectionData {
  id: string;
  title: string;
  lessons: LessonData[];
}

export interface CoursePlayerData {
  id: string;
  title: string;
  breadcrumb: string[];
  sections: SectionData[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useCoursePlayerData(slug: string) {
  // Đổi endpoint cho đúng backend thực tế
  const { data, error, isLoading } = useSWR<CoursePlayerData>(
    slug ? `/api/learner/courses/${slug}/player` : null,
    fetcher
  );
  return {
    data,
    error,
    isLoading,
  };
}
