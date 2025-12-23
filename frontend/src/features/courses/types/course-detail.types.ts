// Course detail types

export type CourseSection = {
  id: string;
  title: string;
  lecturesCount: number;
  duration: string;
};

export type CourseDetail = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  rating: number;
  ratingCount: number;
  studentsCount: number;
  lastUpdated: string;
  language: string;
  subtitles: string[];
  level: "Beginner" | "Intermediate" | "Advanced";
  whatYouWillLearn: string[];
  includes: string[];
  sections: CourseSection[];
  description: string;
  instructor: {
    name: string;
    title: string;
    avatarUrl?: string;
    about: string;
  };
};

