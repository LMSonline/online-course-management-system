/**
 * Comprehensive Mock Data for Teacher Management Screens
 * Consistent data structure for all teacher tabs: students, qna, notifications, analytics, payouts
 */

// ============================================
// STUDENTS MOCK DATA
// ============================================

export const mockStudents = [
  {
    id: 1,
    studentId: 101,
    studentName: "Nguyễn Văn An",
    studentEmail: "nguyenvanan@example.com",
    studentCode: "SV2024001",
    avatarUrl:
      "https://ui-avatars.com/api/?name=Nguyen+Van+An&background=6366f1&color=fff",
    enrollmentDate: "2024-01-15",
    lastActivityAt: "2026-01-13T10:30:00",
    status: "ACTIVE",
    completionPercentage: 87,
    courseTitle: "Full-Stack Web Development",
    courseId: 1,
    progress: 87,
    completedLessons: 42,
    totalLessons: 48,
    assignmentsSubmitted: 15,
    totalAssignments: 18,
    averageGrade: 92.5,
    timeSpent: "124h 30m",
  },
  {
    id: 2,
    studentId: 102,
    studentName: "Trần Thị Bình",
    studentEmail: "tranthibinh@example.com",
    studentCode: "SV2024002",
    avatarUrl:
      "https://ui-avatars.com/api/?name=Tran+Thi+Binh&background=ec4899&color=fff",
    enrollmentDate: "2024-01-20",
    lastActivityAt: "2026-01-13T08:15:00",
    status: "ACTIVE",
    completionPercentage: 95,
    courseTitle: "Full-Stack Web Development",
    courseId: 1,
    progress: 95,
    completedLessons: 46,
    totalLessons: 48,
    assignmentsSubmitted: 18,
    totalAssignments: 18,
    averageGrade: 96.8,
    timeSpent: "156h 45m",
  },
  {
    id: 3,
    studentId: 103,
    studentName: "Lê Hoàng Cường",
    studentEmail: "lehoangcuong@example.com",
    studentCode: "SV2024003",
    avatarUrl:
      "https://ui-avatars.com/api/?name=Le+Hoang+Cuong&background=10b981&color=fff",
    enrollmentDate: "2024-02-01",
    lastActivityAt: "2026-01-12T16:45:00",
    status: "ACTIVE",
    completionPercentage: 62,
    courseTitle: "Python for Data Science",
    courseId: 2,
    progress: 62,
    completedLessons: 25,
    totalLessons: 40,
    assignmentsSubmitted: 10,
    totalAssignments: 15,
    averageGrade: 85.3,
    timeSpent: "87h 20m",
  },
  {
    id: 4,
    studentId: 104,
    studentName: "Phạm Minh Dương",
    studentEmail: "phamminduong@example.com",
    studentCode: "SV2024004",
    avatarUrl:
      "https://ui-avatars.com/api/?name=Pham+Minh+Duong&background=f59e0b&color=fff",
    enrollmentDate: "2024-02-10",
    lastActivityAt: "2026-01-13T14:20:00",
    status: "ACTIVE",
    completionPercentage: 78,
    courseTitle: "Python for Data Science",
    courseId: 2,
    progress: 78,
    completedLessons: 31,
    totalLessons: 40,
    assignmentsSubmitted: 12,
    totalAssignments: 15,
    averageGrade: 88.7,
    timeSpent: "102h 15m",
  },
  {
    id: 5,
    studentId: 105,
    studentName: "Võ Thị Em",
    studentEmail: "vothiem@example.com",
    studentCode: "SV2024005",
    avatarUrl:
      "https://ui-avatars.com/api/?name=Vo+Thi+Em&background=8b5cf6&color=fff",
    enrollmentDate: "2023-12-15",
    lastActivityAt: "2026-01-10T09:30:00",
    status: "COMPLETED",
    completionPercentage: 100,
    courseTitle: "UI/UX Design Fundamentals",
    courseId: 3,
    progress: 100,
    completedLessons: 35,
    totalLessons: 35,
    assignmentsSubmitted: 12,
    totalAssignments: 12,
    averageGrade: 94.2,
    timeSpent: "145h 50m",
  },
  {
    id: 6,
    studentId: 106,
    studentName: "Đặng Văn Giang",
    studentEmail: "dangvangiang@example.com",
    studentCode: "SV2024006",
    avatarUrl:
      "https://ui-avatars.com/api/?name=Dang+Van+Giang&background=ef4444&color=fff",
    enrollmentDate: "2024-03-01",
    lastActivityAt: "2026-01-05T11:00:00",
    status: "ACTIVE",
    completionPercentage: 34,
    courseTitle: "Mobile App Development",
    courseId: 4,
    progress: 34,
    completedLessons: 14,
    totalLessons: 42,
    assignmentsSubmitted: 5,
    totalAssignments: 16,
    averageGrade: 76.5,
    timeSpent: "48h 30m",
  },
  {
    id: 7,
    studentId: 107,
    studentName: "Hoàng Thị Hoa",
    studentEmail: "hoangthihoa@example.com",
    studentCode: "SV2024007",
    avatarUrl:
      "https://ui-avatars.com/api/?name=Hoang+Thi+Hoa&background=06b6d4&color=fff",
    enrollmentDate: "2024-01-25",
    lastActivityAt: "2026-01-13T07:45:00",
    status: "ACTIVE",
    completionPercentage: 91,
    courseTitle: "Full-Stack Web Development",
    courseId: 1,
    progress: 91,
    completedLessons: 44,
    totalLessons: 48,
    assignmentsSubmitted: 17,
    totalAssignments: 18,
    averageGrade: 90.1,
    timeSpent: "138h 25m",
  },
  {
    id: 8,
    studentId: 108,
    studentName: "Bùi Văn Hùng",
    studentEmail: "buivanhung@example.com",
    studentCode: "SV2024008",
    avatarUrl:
      "https://ui-avatars.com/api/?name=Bui+Van+Hung&background=14b8a6&color=fff",
    enrollmentDate: "2024-02-20",
    lastActivityAt: "2026-01-11T13:30:00",
    status: "ACTIVE",
    completionPercentage: 55,
    courseTitle: "DevOps Essentials",
    courseId: 5,
    progress: 55,
    completedLessons: 22,
    totalLessons: 38,
    assignmentsSubmitted: 8,
    totalAssignments: 14,
    averageGrade: 82.4,
    timeSpent: "76h 10m",
  },
  {
    id: 9,
    studentId: 109,
    studentName: "Ngô Thị Lan",
    studentEmail: "ngothilan@example.com",
    studentCode: "SV2024009",
    avatarUrl:
      "https://ui-avatars.com/api/?name=Ngo+Thi+Lan&background=a855f7&color=fff",
    enrollmentDate: "2024-01-18",
    lastActivityAt: "2026-01-13T15:20:00",
    status: "ACTIVE",
    completionPercentage: 83,
    courseTitle: "Full-Stack Web Development",
    courseId: 1,
    progress: 83,
    completedLessons: 40,
    totalLessons: 48,
    assignmentsSubmitted: 16,
    totalAssignments: 18,
    averageGrade: 89.3,
    timeSpent: "112h 45m",
  },
  {
    id: 10,
    studentId: 110,
    studentName: "Trương Văn Minh",
    studentEmail: "truongvanminh@example.com",
    studentCode: "SV2024010",
    avatarUrl:
      "https://ui-avatars.com/api/?name=Truong+Van+Minh&background=f97316&color=fff",
    enrollmentDate: "2024-02-05",
    lastActivityAt: "2026-01-13T12:10:00",
    status: "ACTIVE",
    completionPercentage: 71,
    courseTitle: "Python for Data Science",
    courseId: 2,
    progress: 71,
    completedLessons: 28,
    totalLessons: 40,
    assignmentsSubmitted: 11,
    totalAssignments: 15,
    averageGrade: 86.7,
    timeSpent: "94h 20m",
  },
  {
    id: 11,
    studentId: 111,
    studentName: "Phan Thị Nga",
    studentEmail: "phanthinga@example.com",
    studentCode: "SV2024011",
    avatarUrl:
      "https://ui-avatars.com/api/?name=Phan+Thi+Nga&background=84cc16&color=fff",
    enrollmentDate: "2024-02-15",
    lastActivityAt: "2026-01-12T18:30:00",
    status: "ACTIVE",
    completionPercentage: 68,
    courseTitle: "UI/UX Design Fundamentals",
    courseId: 3,
    progress: 68,
    completedLessons: 24,
    totalLessons: 35,
    assignmentsSubmitted: 9,
    totalAssignments: 12,
    averageGrade: 91.2,
    timeSpent: "89h 15m",
  },
  {
    id: 12,
    studentId: 112,
    studentName: "Lý Văn Phong",
    studentEmail: "lyvanphong@example.com",
    studentCode: "SV2024012",
    avatarUrl:
      "https://ui-avatars.com/api/?name=Ly+Van+Phong&background=0ea5e9&color=fff",
    enrollmentDate: "2024-03-10",
    lastActivityAt: "2026-01-13T09:45:00",
    status: "ACTIVE",
    completionPercentage: 45,
    courseTitle: "Mobile App Development",
    courseId: 4,
    progress: 45,
    completedLessons: 19,
    totalLessons: 42,
    assignmentsSubmitted: 7,
    totalAssignments: 16,
    averageGrade: 81.5,
    timeSpent: "62h 30m",
  },
  {
    id: 13,
    studentId: 113,
    studentName: "Đinh Thị Quỳnh",
    studentEmail: "dinhthiquynh@example.com",
    studentCode: "SV2024013",
    avatarUrl:
      "https://ui-avatars.com/api/?name=Dinh+Thi+Quynh&background=d946ef&color=fff",
    enrollmentDate: "2023-11-20",
    lastActivityAt: "2026-01-08T14:20:00",
    status: "COMPLETED",
    completionPercentage: 100,
    courseTitle: "Python for Data Science",
    courseId: 2,
    progress: 100,
    completedLessons: 40,
    totalLessons: 40,
    assignmentsSubmitted: 15,
    totalAssignments: 15,
    averageGrade: 93.8,
    timeSpent: "162h 40m",
  },
  {
    id: 14,
    studentId: 114,
    studentName: "Vũ Văn Tài",
    studentEmail: "vuvantai@example.com",
    studentCode: "SV2024014",
    avatarUrl:
      "https://ui-avatars.com/api/?name=Vu+Van+Tai&background=f43f5e&color=fff",
    enrollmentDate: "2024-02-25",
    lastActivityAt: "2026-01-13T11:15:00",
    status: "ACTIVE",
    completionPercentage: 58,
    courseTitle: "DevOps Essentials",
    courseId: 5,
    progress: 58,
    completedLessons: 22,
    totalLessons: 38,
    assignmentsSubmitted: 9,
    totalAssignments: 14,
    averageGrade: 84.6,
    timeSpent: "81h 50m",
  },
  {
    id: 15,
    studentId: 115,
    studentName: "Mai Thị Uyên",
    studentEmail: "maithiuyen@example.com",
    studentCode: "SV2024015",
    avatarUrl:
      "https://ui-avatars.com/api/?name=Mai+Thi+Uyen&background=22d3ee&color=fff",
    enrollmentDate: "2024-01-22",
    lastActivityAt: "2026-01-13T16:40:00",
    status: "ACTIVE",
    completionPercentage: 89,
    courseTitle: "Full-Stack Web Development",
    courseId: 1,
    progress: 89,
    completedLessons: 43,
    totalLessons: 48,
    assignmentsSubmitted: 16,
    totalAssignments: 18,
    averageGrade: 91.7,
    timeSpent: "128h 35m",
  },
];

export const mockEnrollmentStats = {
  totalEnrollments: 156,
  activeEnrollments: 142,
  completedEnrollments: 14,
  averageProgress: 72.5,
  averageCompletion: 68.3,
};

// ============================================
// Q&A MOCK DATA
// ============================================

export const mockQuestions = [
  {
    id: 1,
    user: {
      id: 101,
      username: "Nguyễn Văn An",
      avatarUrl:
        "https://ui-avatars.com/api/?name=Nguyen+Van+An&background=6366f1&color=fff",
    },
    content:
      "Làm thế nào để tối ưu hóa performance của React application? Tôi đang gặp vấn đề với việc re-render quá nhiều lần.",
    createdAt: "2026-01-13T09:30:00",
    upvotes: 3,
    isVisible: true,
  },
  {
    id: 2,
    user: {
      id: 103,
      username: "Lê Hoàng Cường",
      avatarUrl:
        "https://ui-avatars.com/api/?name=Le+Hoang+Cuong&background=10b981&color=fff",
    },
    content:
      "Em không hiểu rõ về useEffect cleanup function. Khi nào thì nên sử dụng và tại sao cần thiết?",
    createdAt: "2026-01-13T08:15:00",
    upvotes: 5,
    isVisible: true,
    replies: [
      {
        id: 101,
        user: {
          id: 201,
          username: "Giảng viên Minh",
          avatarUrl:
            "https://ui-avatars.com/api/?name=Giang+Vien+Minh&background=6366f1&color=fff",
        },
        content:
          "Cleanup function được gọi khi component unmount hoặc trước khi effect chạy lại. Nó rất quan trọng để tránh memory leaks.",
        createdAt: "2026-01-13T08:45:00",
        upvotes: 8,
        isVisible: true,
      },
    ],
  },
  {
    id: 3,
    user: {
      id: 104,
      username: "Phạm Minh Dương",
      avatarUrl:
        "https://ui-avatars.com/api/?name=Pham+Minh+Duong&background=f59e0b&color=fff",
    },
    content:
      "Sự khác biệt giữa pandas DataFrame và NumPy array là gì? Khi nào nên dùng cái nào?",
    createdAt: "2026-01-12T16:20:00",
    upvotes: 2,
    isVisible: true,
  },
  {
    id: 4,
    user: {
      id: 107,
      username: "Hoàng Thị Hoa",
      avatarUrl:
        "https://ui-avatars.com/api/?name=Hoang+Thi+Hoa&background=06b6d4&color=fff",
    },
    content:
      "Best practices cho việc design mobile-first responsive website? Có những breakpoints nào được recommend?",
    createdAt: "2026-01-13T11:00:00",
    upvotes: 7,
    isVisible: true,
    replies: [
      {
        id: 102,
        user: {
          id: 201,
          username: "Giảng viên Minh",
          avatarUrl:
            "https://ui-avatars.com/api/?name=Giang+Vien+Minh&background=6366f1&color=fff",
        },
        content:
          "Breakpoints phổ biến: 320px (mobile), 768px (tablet), 1024px (desktop). Bắt đầu với mobile design trước, sau đó mở rộng lên.",
        createdAt: "2026-01-13T11:30:00",
        upvotes: 5,
        isVisible: true,
      },
    ],
  },
  {
    id: 5,
    user: {
      id: 108,
      username: "Bùi Văn Hùng",
      avatarUrl:
        "https://ui-avatars.com/api/?name=Bui+Van+Hung&background=14b8a6&color=fff",
    },
    content:
      "Kubernetes vs Docker Swarm: nên chọn cái nào cho production environment? Ưu nhược điểm của từng loại?",
    createdAt: "2026-01-11T14:30:00",
    upvotes: 12,
    isVisible: true,
    replies: [
      {
        id: 103,
        user: {
          id: 201,
          username: "Giảng viên Minh",
          avatarUrl:
            "https://ui-avatars.com/api/?name=Giang+Vien+Minh&background=6366f1&color=fff",
        },
        content:
          "Kubernetes phù hợp cho large-scale applications với nhiều tính năng. Docker Swarm đơn giản hơn, phù hợp cho small-medium projects.",
        createdAt: "2026-01-11T15:00:00",
        upvotes: 8,
        isVisible: true,
      },
    ],
  },
  {
    id: 6,
    user: {
      id: 109,
      username: "Ngô Thị Lan",
      avatarUrl:
        "https://ui-avatars.com/api/?name=Ngo+Thi+Lan&background=a855f7&color=fff",
    },
    content:
      "Làm sao để implement authentication với JWT trong React app? Có nên lưu token ở đâu?",
    createdAt: "2026-01-13T13:15:00",
    upvotes: 6,
    isVisible: true,
    replies: [
      {
        id: 104,
        user: {
          id: 201,
          username: "Giảng viên Minh",
          avatarUrl:
            "https://ui-avatars.com/api/?name=Giang+Vien+Minh&background=6366f1&color=fff",
        },
        content:
          "Nên lưu access token trong memory (state) và refresh token trong httpOnly cookie. Tránh lưu trong localStorage vì có thể bị XSS attack.",
        createdAt: "2026-01-13T13:45:00",
        upvotes: 9,
        isVisible: true,
      },
    ],
  },
  {
    id: 7,
    user: {
      id: 110,
      username: "Trương Văn Minh",
      avatarUrl:
        "https://ui-avatars.com/api/?name=Truong+Van+Minh&background=f97316&color=fff",
    },
    content:
      "Difference between .loc và .iloc trong pandas? Khi nào dùng cái nào?",
    createdAt: "2026-01-12T10:30:00",
    upvotes: 4,
    isVisible: true,
  },
  {
    id: 8,
    user: {
      id: 111,
      username: "Phan Thị Nga",
      avatarUrl:
        "https://ui-avatars.com/api/?name=Phan+Thi+Nga&background=84cc16&color=fff",
    },
    content:
      "Các principles cơ bản của User Interface design là gì? Có guidelines nào cần follow không?",
    createdAt: "2026-01-13T14:20:00",
    upvotes: 8,
    isVisible: true,
    replies: [
      {
        id: 105,
        user: {
          id: 201,
          username: "Giảng viên Minh",
          avatarUrl:
            "https://ui-avatars.com/api/?name=Giang+Vien+Minh&background=6366f1&color=fff",
        },
        content:
          "Principles: Consistency, Clarity, Feedback, Efficiency. Nên tham khảo Material Design hoặc Human Interface Guidelines.",
        createdAt: "2026-01-13T14:50:00",
        upvotes: 6,
        isVisible: true,
      },
    ],
  },
  {
    id: 9,
    user: {
      id: 112,
      username: "Lý Văn Phong",
      avatarUrl:
        "https://ui-avatars.com/api/?name=Ly+Van+Phong&background=0ea5e9&color=fff",
    },
    content:
      "React Native vs Flutter: nên chọn framework nào cho mobile app development? Performance thế nào?",
    createdAt: "2026-01-12T09:15:00",
    upvotes: 10,
    isVisible: true,
  },
  {
    id: 10,
    user: {
      id: 114,
      username: "Vũ Văn Tài",
      avatarUrl:
        "https://ui-avatars.com/api/?name=Vu+Van+Tai&background=f43f5e&color=fff",
    },
    content:
      "CI/CD pipeline best practices? Nên setup như thế nào cho một dự án medium-scale?",
    createdAt: "2026-01-11T16:45:00",
    upvotes: 11,
    isVisible: true,
    replies: [
      {
        id: 106,
        user: {
          id: 201,
          username: "Giảng viên Minh",
          avatarUrl:
            "https://ui-avatars.com/api/?name=Giang+Vien+Minh&background=6366f1&color=fff",
        },
        content:
          "Setup: Git hooks → Automated tests → Build → Deploy to staging → Manual approval → Deploy to production. Dùng GitHub Actions hoặc GitLab CI.",
        createdAt: "2026-01-11T17:15:00",
        upvotes: 7,
        isVisible: true,
      },
    ],
  },
  {
    id: 11,
    user: {
      id: 115,
      username: "Mai Thị Uyên",
      avatarUrl:
        "https://ui-avatars.com/api/?name=Mai+Thi+Uyen&background=22d3ee&color=fff",
    },
    content:
      "Server-side rendering vs Client-side rendering trong Next.js? Khi nào nên dùng getServerSideProps?",
    createdAt: "2026-01-13T10:00:00",
    upvotes: 9,
    isVisible: true,
  },
  {
    id: 12,
    user: {
      id: 101,
      username: "Nguyễn Văn An",
      avatarUrl:
        "https://ui-avatars.com/api/?name=Nguyen+Van+An&background=6366f1&color=fff",
    },
    content:
      "Làm thế nào để optimize images trong web app? Có nên dùng lazy loading không?",
    createdAt: "2026-01-12T14:30:00",
    upvotes: 5,
    isVisible: true,
    replies: [
      {
        id: 107,
        user: {
          id: 201,
          username: "Giảng viên Minh",
          avatarUrl:
            "https://ui-avatars.com/api/?name=Giang+Vien+Minh&background=6366f1&color=fff",
        },
        content:
          "Nên: Compress images, sử dụng WebP format, implement lazy loading, dùng CDN, responsive images với srcset.",
        createdAt: "2026-01-12T15:00:00",
        upvotes: 8,
        isVisible: true,
      },
    ],
  },
];

export const mockQnAStats = {
  totalQuestions: 245,
  unansweredQuestions: 18,
  answeredQuestions: 227,
  totalReplies: 156,
  instructorReplies: 89,
  responseRate: 92.7,
  averageResponseTimeHours: 4.5,
  totalUpvotes: 892,
  averageUpvotesPerQuestion: 3.6,
};

// ============================================
// NOTIFICATIONS MOCK DATA
// ============================================

export const mockNotifications = [
  {
    id: 1,
    type: "NEW_COMMENT",
    title: "New Question Posted",
    message: "Nguyễn Văn An asked about React performance optimization",
    referenceType: "COMMENT",
    referenceId: 1,
    isRead: false,
    createdAt: "2026-01-13T09:30:00",
  },
  {
    id: 2,
    type: "NEW_ENROLLMENT",
    title: "New Student Enrolled",
    message: "Phan Thị Mai enrolled in Full-Stack Web Development course",
    referenceType: "ENROLLMENT",
    referenceId: 156,
    isRead: false,
    createdAt: "2026-01-13T08:45:00",
  },
  {
    id: 3,
    type: "NEW_ASSIGNMENT",
    title: "Assignment Submitted",
    message: "Trần Thị Bình submitted 'React Hooks Assignment'",
    referenceType: "ASSIGNMENT",
    referenceId: 42,
    isRead: false,
    createdAt: "2026-01-13T07:20:00",
  },
  {
    id: 4,
    type: "COURSE_APPROVED",
    title: "Course Approved",
    message:
      "Your course 'Advanced TypeScript' has been approved for publication",
    referenceType: "COURSE",
    referenceId: 6,
    isRead: true,
    createdAt: "2026-01-12T16:30:00",
  },
  {
    id: 5,
    type: "NEW_COMMENT",
    title: "Comment Reply",
    message: "Lê Hoàng Cường replied to your answer on useEffect question",
    referenceType: "COMMENT",
    referenceId: 2,
    isRead: true,
    createdAt: "2026-01-12T14:15:00",
  },
  {
    id: 6,
    type: "NEW_ENROLLMENT",
    title: "Milestone Reached",
    message: "Congratulations! Your course reached 150 students",
    referenceType: "COURSE",
    referenceId: 1,
    isRead: true,
    createdAt: "2026-01-11T10:00:00",
  },
  {
    id: 7,
    type: "NEW_ASSIGNMENT",
    title: "Multiple Submissions",
    message: "5 new assignment submissions require grading",
    referenceType: "ASSIGNMENT",
    referenceId: 0,
    isRead: true,
    createdAt: "2026-01-11T09:00:00",
  },
];

// ============================================
// ANALYTICS MOCK DATA
// ============================================

export const mockAnalytics = {
  totalRevenue: 125750000,
  totalStudents: 1247,
  averageRating: 4.8,
  totalCourses: 12,
  revenueGrowth: 23.5,
  studentGrowth: 18.2,
  ratingTrend: 0.3,
  courseGrowth: 2,
  revenueTrend: [
    { month: "Jul 2025", revenue: 45200000, students: 890, rating: 4.6 },
    { month: "Aug 2025", revenue: 52300000, students: 945, rating: 4.7 },
    { month: "Sep 2025", revenue: 48900000, students: 1012, rating: 4.7 },
    { month: "Oct 2025", revenue: 61500000, students: 1098, rating: 4.7 },
    { month: "Nov 2025", revenue: 73200000, students: 1156, rating: 4.8 },
    { month: "Dec 2025", revenue: 89400000, students: 1203, rating: 4.8 },
    { month: "Jan 2026", revenue: 125750000, students: 1247, rating: 4.8 },
  ],
  topCourses: [
    {
      id: 1,
      title: "Full-Stack Web Development",
      thumbnail: "/images/course/fullstack.jpg",
      students: 342,
      revenue: 42500000,
      rating: 4.9,
      completionRate: 78.5,
    },
    {
      id: 2,
      title: "Python for Data Science",
      thumbnail: "/images/course/python-ds.jpg",
      students: 285,
      revenue: 35200000,
      rating: 4.8,
      completionRate: 82.3,
    },
    {
      id: 3,
      title: "UI/UX Design Fundamentals",
      thumbnail: "/images/course/uiux.jpg",
      students: 198,
      revenue: 24800000,
      rating: 4.7,
      completionRate: 85.1,
    },
    {
      id: 4,
      title: "Mobile App Development",
      thumbnail: "/images/course/mobile.jpg",
      students: 167,
      revenue: 21200000,
      rating: 4.6,
      completionRate: 71.2,
    },
  ],
  courseAnalytics: [
    {
      courseId: 1,
      courseTitle: "Full-Stack Web Development",
      enrollments: 342,
      activeStudents: 287,
      completionRate: 78.5,
      averageProgress: 72.3,
      revenue: 42500000,
      rating: 4.9,
      reviews: 156,
      engagementRate: 84.2,
    },
    {
      courseId: 2,
      courseTitle: "Python for Data Science",
      enrollments: 285,
      activeStudents: 251,
      completionRate: 82.3,
      averageProgress: 76.8,
      revenue: 35200000,
      rating: 4.8,
      reviews: 128,
      engagementRate: 88.1,
    },
  ],
};

// ============================================
// PAYOUTS MOCK DATA
// ============================================

export const mockPayouts = {
  availableBalance: 45250000,
  pendingBalance: 12800000,
  totalEarnings: 125750000,
  lastPayout: {
    amount: 38500000,
    date: "2025-12-28",
    status: "COMPLETED",
  },
  pendingPayouts: [
    {
      id: 1,
      amount: 12800000,
      requestDate: "2026-01-10",
      status: "PENDING",
      expectedDate: "2026-01-17",
      method: "Bank Transfer",
    },
  ],
  payoutHistory: [
    {
      id: 1,
      amount: 38500000,
      requestDate: "2025-12-20",
      completedDate: "2025-12-28",
      status: "COMPLETED",
      method: "Bank Transfer",
      transactionId: "TXN202512280001",
    },
    {
      id: 2,
      amount: 42300000,
      requestDate: "2025-11-18",
      completedDate: "2025-11-25",
      status: "COMPLETED",
      method: "Bank Transfer",
      transactionId: "TXN202511250001",
    },
    {
      id: 3,
      amount: 35700000,
      requestDate: "2025-10-15",
      completedDate: "2025-10-22",
      status: "COMPLETED",
      method: "Bank Transfer",
      transactionId: "TXN202510220001",
    },
  ],
  transactions: [
    {
      id: 1,
      type: "ENROLLMENT",
      description: "Course enrollment - Full-Stack Web Development",
      amount: 1250000,
      studentName: "Nguyễn Văn An",
      courseTitle: "Full-Stack Web Development",
      date: "2026-01-13",
      status: "COMPLETED",
    },
    {
      id: 2,
      type: "ENROLLMENT",
      description: "Course enrollment - Python for Data Science",
      amount: 980000,
      studentName: "Trần Thị Bình",
      courseTitle: "Python for Data Science",
      date: "2026-01-12",
      status: "COMPLETED",
    },
    {
      id: 3,
      type: "PAYOUT",
      description: "Withdrawal to bank account",
      amount: -38500000,
      studentName: null,
      courseTitle: null,
      date: "2025-12-28",
      status: "COMPLETED",
    },
    {
      id: 4,
      type: "ENROLLMENT",
      description: "Course enrollment - UI/UX Design Fundamentals",
      amount: 1150000,
      studentName: "Lê Hoàng Cường",
      courseTitle: "UI/UX Design Fundamentals",
      date: "2026-01-11",
      status: "COMPLETED",
    },
    {
      id: 5,
      type: "ENROLLMENT",
      description: "Course enrollment - Mobile App Development",
      amount: 1380000,
      studentName: "Phạm Minh Dương",
      courseTitle: "Mobile App Development",
      date: "2026-01-10",
      status: "COMPLETED",
    },
  ],
  monthlyStats: [
    { month: "Jul 2025", revenue: 45200000, enrollments: 89 },
    { month: "Aug 2025", revenue: 52300000, enrollments: 102 },
    { month: "Sep 2025", revenue: 48900000, enrollments: 95 },
    { month: "Oct 2025", revenue: 61500000, enrollments: 118 },
    { month: "Nov 2025", revenue: 73200000, enrollments: 142 },
    { month: "Dec 2025", revenue: 89400000, enrollments: 175 },
    { month: "Jan 2026", revenue: 12800000, enrollments: 24 },
  ],
};

// ============================================
// COURSES MOCK DATA
// ============================================

export const mockCourses = [
  {
    id: 1,
    title: "Full-Stack Web Development",
    description:
      "Master modern web development with React, Node.js, and MongoDB",
    thumbnail: "/images/course/fullstack.jpg",
    price: 1250000,
    students: 342,
    rating: 4.9,
    status: "PUBLISHED",
    createdAt: "2024-06-15",
  },
  {
    id: 2,
    title: "Python for Data Science",
    description:
      "Learn Python, pandas, NumPy for data analysis and machine learning",
    thumbnail: "/images/course/python-ds.jpg",
    price: 980000,
    students: 285,
    rating: 4.8,
    status: "PUBLISHED",
    createdAt: "2024-07-20",
  },
  {
    id: 3,
    title: "UI/UX Design Fundamentals",
    description: "Create beautiful and user-friendly interfaces with Figma",
    thumbnail: "/images/course/uiux.jpg",
    price: 1150000,
    students: 198,
    rating: 4.7,
    status: "PUBLISHED",
    createdAt: "2024-08-10",
  },
  {
    id: 4,
    title: "Mobile App Development",
    description: "Build cross-platform mobile apps with React Native",
    thumbnail: "/images/course/mobile.jpg",
    price: 1380000,
    students: 167,
    rating: 4.6,
    status: "PUBLISHED",
    createdAt: "2024-09-05",
  },
  {
    id: 5,
    title: "DevOps Essentials",
    description: "Master CI/CD, Docker, Kubernetes, and cloud deployment",
    thumbnail: "/images/course/devops.jpg",
    price: 1450000,
    students: 143,
    rating: 4.8,
    status: "PUBLISHED",
    createdAt: "2024-10-12",
  },
];

// ============================================
// REPORTS MOCK DATA (if needed)
// ============================================

export const mockReports = {
  integrityViolations: [
    {
      id: 1,
      studentName: "Student X",
      courseTitle: "Full-Stack Web Development",
      violationType: "PLAGIARISM",
      assignmentTitle: "React Hooks Assignment",
      detectedAt: "2026-01-10",
      severity: "HIGH",
      status: "UNDER_REVIEW",
    },
  ],
  performanceReports: {
    lowPerformers: 12,
    atRiskStudents: 8,
    needsAttention: 15,
  },
};
