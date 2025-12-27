// src/lib/teacher/dashboard/types.ts

export type TeacherOverview = {
  totalStudents: number;
  totalCourses: number;
  monthlyRevenue: number;
  avgRating: number;
};

export type TeacherCourseSummary = {
  id: string;
  title: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  students: number;
  rating: number;
  completionRate: number; // %
  revenue: number; // monthly revenue
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

// ✅ Dùng cho biểu đồ doanh thu theo tháng
export type RevenuePoint = {
  month: string; // "Nov", "Dec", ...
  revenue: number; // 1423.5
};

// ✅ Dùng cho biểu đồ học viên theo khóa
export type EnrollmentPoint = {
  courseId: string;
  courseTitle: string;
  students: number;
};

export type TeacherDashboardData = {
  overview: TeacherOverview;
  courses: TeacherCourseSummary[];
  tasks: TeachingTask[];
  reviews: RecentReview[];
  quickSections: QuickSection[];
  revenueHistory: RevenuePoint[];
  enrollmentByCourse: EnrollmentPoint[];
};

export const TEACHER_DASHBOARD_MOCK: TeacherDashboardData = {
  overview: {
    totalStudents: 8421,
    totalCourses: 6,
    monthlyRevenue: 1423.5,
    avgRating: 4.72,
  },
  quickSections: [
    {
      id: "courses",
      label: "Courses",
      description: "Create, update and publish your courses.",
      href: "/teacher/courses",
    },
    {
      id: "assignments",
      label: "Assignments & Quizzes",
      description: "Manage homework, quizzes and grading.",
      href: "/teacher/assessments",
    },
    {
      id: "students",
      label: "Students",
      description: "View enrolled learners and progress.",
      href: "/teacher/students",
    },
    {
      id: "messages",
      label: "Messages & Q&A",
      description: "Answer questions and support your class.",
      href: "/teacher/messages",
    },
    {
      id: "earnings",
      label: "Earnings",
      description: "Track payouts and revenue analytics.",
      href: "/teacher/earnings",
    },
  ],
  courses: [
    {
      id: "c1",
      title: "React & TypeScript for Modern Web Apps",
      category: "Web Development",
      level: "Intermediate",
      students: 4352,
      rating: 4.7,
      completionRate: 62,
      revenue: 8704.5,
      status: "Published",
      lastUpdated: "Mar 10, 2025",
    },
    {
      id: "c2",
      title: "Node.js & Express – REST APIs from Zero to Hero",
      category: "Backend",
      level: "Intermediate",
      students: 2150,
      rating: 4.6,
      completionRate: 54,
      revenue: 5375.0,
      status: "Published",
      lastUpdated: "Feb 28, 2025",
    },
    {
      id: "c3",
      title: "Git & GitHub Essentials for Developers",
      category: "DevTools",
      level: "Beginner",
      students: 980,
      rating: 4.8,
      completionRate: 71,
      revenue: 1960.0,
      status: "Published",
      lastUpdated: "Jan 16, 2025",
    },
    {
      id: "c4",
      title: "Clean Architecture in TypeScript",
      category: "Architecture",
      level: "Advanced",
      students: 312,
      rating: 4.9,
      completionRate: 38,
      revenue: 780.0,
      status: "Draft",
      lastUpdated: "Mar 5, 2025",
    },
  ],
  tasks: [
    {
      id: "t1",
      type: "assignment",
      courseTitle: "React & TypeScript for Modern Web Apps",
      summary: "12 assignment submissions waiting for grading.",
      dueLabel: "Due today",
    },
    {
      id: "t2",
      type: "quiz",
      courseTitle: "Git & GitHub Essentials for Developers",
      summary: "Quiz 02 – 5 attempts flagged for review.",
      dueLabel: "Review this week",
    },
    {
      id: "t3",
      type: "qa",
      courseTitle: "Node.js & Express – REST APIs from Zero to Hero",
      summary: "7 unanswered Q&A threads from students.",
      dueLabel: "New in last 24 hours",
    },
  ],
  reviews: [
    {
      id: "r1",
      courseTitle: "React & TypeScript for Modern Web Apps",
      studentName: "Linh Tran",
      rating: 5,
      comment:
        "Great explanations and real-world examples. Loved the LMS project!",
      createdAt: "2 hours ago",
    },
    {
      id: "r2",
      courseTitle: "Git & GitHub Essentials for Developers",
      studentName: "Khoa Nguyen",
      rating: 4.5,
      comment: "Super clear. Would love more advanced branching examples.",
      createdAt: "Yesterday",
    },
    {
      id: "r3",
      courseTitle: "Node.js & Express – REST APIs from Zero to Hero",
      studentName: "Mai Pham",
      rating: 4.0,
      comment: "Content is great, some videos could be a bit shorter.",
      createdAt: "3 days ago",
    },
  ],
  revenueHistory: [
    { month: "Nov", revenue: 980 },
    { month: "Dec", revenue: 1120 },
    { month: "Jan", revenue: 1340 },
    { month: "Feb", revenue: 1210 },
    { month: "Mar", revenue: 1423.5 },
  ],
  enrollmentByCourse: [
    {
      courseId: "c1",
      courseTitle: "React & TypeScript for Modern Web Apps",
      students: 4352,
    },
    {
      courseId: "c2",
      courseTitle: "Node.js & Express – REST APIs from Zero to Hero",
      students: 2150,
    },
    {
      courseId: "c3",
      courseTitle: "Git & GitHub Essentials for Developers",
      students: 980,
    },
    {
      courseId: "c4",
      courseTitle: "Clean Architecture in TypeScript",
      students: 312,
    },
  ],
};
