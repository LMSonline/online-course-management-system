// Instructor dashboard types

export type InstructorOverview = {
  totalStudents: number;
  totalCourses: number;
  monthlyRevenue: number;
  avgRating: number;
};

export type InstructorCourseSummary = {
  id: string;
  title: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  students: number;
  rating: number;
  revenue: number; // Revenue in dollars
  completionRate: number; // %
  status: "Published" | "Draft" | "Private";
  lastUpdated: string;
};

export type TeachingTask = {
  id: string;
  type: "assignment" | "quiz" | "qa";
  courseTitle: string;
  summary: string;
  dueLabel: string;
};

export type RecentReview = {
  id: string;
  courseTitle: string;
  studentName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type QuickSection = {
  id: string;
  label: string;
  description: string;
  href: string;
};

export type RevenuePoint = {
  month: string;   // "Nov", "Dec", ...
  revenue: number; // 1423.5
};

export type EnrollmentPoint = {
  courseId: string;
  courseTitle: string;
  students: number;
};

export type InstructorDashboardData = {
  overview: InstructorOverview;
  courses: InstructorCourseSummary[];
  tasks: TeachingTask[];
  reviews: RecentReview[];
  quickSections: QuickSection[];
  revenueHistory: RevenuePoint[];
  enrollmentByCourse: EnrollmentPoint[];
};

