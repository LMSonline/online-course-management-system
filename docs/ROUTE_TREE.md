# Route Tree Structure

**Generated:** 2025-01-XX  
**Source:** docs/routes.md

---

## Route Groups

```
src/app/
├── (public)/          # PublicLayout, no guard
├── (auth)/            # PublicMinimalLayout, GuestGuard
├── (student)/         # AuthenticatedLayout, StudentGuard
├── (creator)/         # CreatorLayout, CreatorGuard
└── admin/             # AdminLayout, AdminGuard
```

---

## (public) - Public Routes

```
(public)/
├── layout.tsx                    # PublicLayout
├── page.tsx                      # HomeScreen (/)
├── search/
│   └── page.tsx                  # SearchResultsScreen
├── categories/
│   ├── page.tsx                  # CategoryTreeScreen
│   └── [slug]/
│       └── page.tsx              # CategoryDetailScreen
├── courses/
│   ├── page.tsx                  # CourseListScreen
│   ├── [slug]/
│   │   ├── page.tsx              # CourseDetailScreen
│   │   └── reviews/
│   │       └── page.tsx          # CourseReviewsPublicScreen
│   └── [courseId]/
│       ├── rating-summary/
│       │   └── page.tsx          # CourseRatingSummaryScreen
│       └── comments/
│           └── page.tsx          # CourseCommentsPublicScreen
├── tags/
│   └── page.tsx                  # TagListScreen
├── teachers/
│   └── [id]/
│       └── page.tsx              # TeacherPublicProfileScreen
├── lessons/
│   ├── [id]/
│   │   └── page.tsx              # LessonDetailPublicScreen
│   └── [lessonId]/
│       └── comments/
│           └── page.tsx          # LessonCommentsPublicScreen
└── 403/
    └── page.tsx                  # ForbiddenScreen
```

---

## (auth) - Auth Routes

```
(auth)/
├── layout.tsx                    # PublicMinimalLayout + GuestGuard
├── login/
│   └── page.tsx                  # LoginScreen
├── register/
│   └── page.tsx                  # RegisterScreen (docs-standard)
├── signup/
│   └── page.tsx                  # RegisterScreen (backward compat)
├── forgot-password/
│   └── page.tsx                  # ForgotPasswordScreen
└── reset-password/
    └── page.tsx                  # ResetPasswordScreen
```

---

## (student) - Student Routes

```
(student)/
├── layout.tsx                    # AuthenticatedLayout + StudentGuard
├── students/
│   └── me/
│       └── page.tsx              # StudentMeScreen
├── my-learning/
│   └── page.tsx                  # MyEnrollmentsScreen
├── enrollments/
│   └── [id]/
│       └── page.tsx              # EnrollmentDetailScreen
├── wishlist/
│   └── page.tsx                  # WishlistScreen
├── notifications/
│   └── page.tsx                  # NotificationsScreen
├── me/
│   ├── page.tsx                  # AuthMeScreen
│   ├── profile/
│   │   ├── page.tsx              # ProfileScreen
│   │   └── edit/
│   │       └── page.tsx          # ProfileEditScreen
│   └── avatar/
│       └── page.tsx              # UploadAvatarScreen
├── settings/
│   └── page.tsx                  # SettingsScreen
├── learn/
│   └── [courseSlug]/
│       ├── page.tsx              # CourseLearningHomeScreen
│       ├── progress/
│       │   └── page.tsx          # CourseProgressOverviewScreen
│       ├── lessons/
│       │   └── [lessonId]/
│       │       └── page.tsx      # LessonPlayerScreen
│       ├── announcements/
│       │   └── page.tsx         # CourseAnnouncementsScreen
│       ├── qna/
│       │   └── page.tsx          # CourseQAScreen
│       ├── resources/
│       │   └── page.tsx          # CourseResourcesScreen
│       └── quizzes/
│           ├── page.tsx          # CourseQuizListScreen
│           └── [quizId]/
│               └── attempt/
│                   └── page.tsx  # QuizAttemptScreen
├── lessons/
│   └── [lessonId]/
│       ├── quizzes/
│       │   └── page.tsx          # LessonQuizzesScreen
│       └── assignments/
│           └── page.tsx          # LessonAssignmentsScreen
├── quizzes/
│   ├── [id]/
│   │   ├── page.tsx              # QuizDetailScreen
│   │   └── attempt/
│   │       └── page.tsx          # QuizAttemptScreen
│   └── [quizId]/
│       └── attempts/
│           └── [attemptId]/
│               └── page.tsx      # QuizAttemptPlayScreen
├── assignments/
│   ├── [id]/
│   │   └── page.tsx              # AssignmentDetailScreen
│   └── [assignmentId]/
│       └── submit/
│           └── page.tsx          # SubmitAssignmentScreen
├── submissions/
│   └── [id]/
│       └── page.tsx              # SubmissionDetailScreen
├── recommendations/
│   ├── page.tsx                  # RecommendationScreen
│   └── [id]/
│       └── feedback/
│           └── page.tsx          # RecommendationFeedbackScreen
├── reports/
│   ├── page.tsx                  # MyReportsScreen
│   ├── new/
│   │   └── page.tsx              # SubmitReportScreen
│   └── [id]/
│       └── page.tsx              # ReportDetailScreen
├── courses/
│   └── [courseId]/
│       ├── reviews/
│       │   ├── new/
│       │   │   └── page.tsx      # WriteCourseReviewScreen
│       │   └── [reviewId]/
│       │       └── edit/
│       │           └── page.tsx   # EditCourseReviewScreen
│       └── comments/
│           └── new/
│               └── page.tsx      # CreateCourseCommentScreen
├── lessons/
│   └── [lessonId]/
│       └── comments/
│           └── new/
│               └── page.tsx      # CreateLessonCommentScreen
└── comments/
    └── [id]/
        └── edit/
            └── page.tsx          # EditCommentScreen
```

---

## (creator) - Creator/Teacher Routes

```
(creator)/
├── layout.tsx                    # CreatorLayout + CreatorGuard
├── teachers/
│   ├── me/
│   │   └── page.tsx              # TeacherMeScreen
│   └── [id]/
│       ├── stats/
│       │   └── page.tsx          # TeacherStatsScreen (:id = teacherId)
│       └── revenue/
│           └── page.tsx          # TeacherRevenueScreen (:id = teacherId)
├── teacher/
│   └── courses/
│       ├── page.tsx              # TeacherCourseListScreen
│       ├── new/
│       │   └── page.tsx          # TeacherCourseCreateScreen
│       └── [id]/
│           ├── edit/
│           │   └── page.tsx      # TeacherCourseEditScreen
│           └── status/
│               └── page.tsx      # TeacherCourseOpenCloseScreen
├── courses/
│   └── [courseId]/
│       ├── enrollments/
│       │   └── page.tsx          # CourseEnrollmentsScreen
│       └── versions/
│           ├── page.tsx          # CourseVersionsScreen
│           ├── new/
│           │   └── page.tsx      # CreateVersionScreen
│           └── [versionId]/
│               ├── page.tsx      # VersionDetailScreen
│               ├── submit-approval/
│               │   └── page.tsx  # SubmitVersionApprovalScreen
│               ├── publish/
│               │   └── page.tsx  # PublishVersionScreen
│               └── chapters/
│                   └── page.tsx  # ChapterManageScreen
├── chapters/
│   └── [chapterId]/
│       └── lessons/
│           └── page.tsx          # LessonManageScreen
├── lessons/
│   └── [lessonId]/
│       ├── video/
│       │   └── page.tsx          # LessonVideoUploadFlowScreen
│       ├── resources/
│       │   └── page.tsx          # LessonResourcesManageScreen
│       ├── quizzes/
│       │   └── manage/
│       │       └── page.tsx      # QuizManageScreen
│       └── assignments/
│           └── manage/
│               └── page.tsx      # AssignmentManageScreen
├── submissions/
│   └── [id]/
│       ├── grade/
│       │   └── page.tsx          # GradeSubmissionScreen
│       └── feedback/
│           └── page.tsx          # FeedbackSubmissionScreen
└── files/
    └── [id]/
        └── page.tsx              # FileStorageScreen
```

---

## admin - Admin Routes

```
admin/
├── layout.tsx                    # AdminLayout + AdminGuard
├── page.tsx                      # AdminDashboardScreen (/admin)
├── users/
│   ├── page.tsx                  # AdminUsersScreen
│   ├── stats/
│   │   └── page.tsx              # AdminUserStatsScreen
│   └── export/
│       └── page.tsx              # AdminExportUsersScreen
├── audit-logs/
│   ├── page.tsx                  # AdminAuditLogsScreen
│   ├── search/
│   │   └── page.tsx              # AdminAuditLogsSearchScreen
│   └── export/
│       └── page.tsx              # AdminAuditLogsExportScreen
├── settings/
│   └── page.tsx                  # AdminSystemSettingsScreen
├── categories/
│   └── page.tsx                  # AdminCategoriesScreen
├── tags/
│   └── page.tsx                  # AdminTagsScreen
├── reports/
│   ├── page.tsx                  # AdminReportsAllScreen
│   └── revenue/
│       └── page.tsx              # AdminRevenueReportScreen
├── statistics/
│   └── page.tsx                  # AdminStatisticsScreen
└── courses/
    └── [courseId]/
        └── versions/
            └── [versionId]/
                └── review/
                    └── page.tsx  # AdminCourseVersionApprovalScreen
```

---

## Redirects (middleware.ts)

Old routes → New docs-standard routes:

- `/learner/catalog` → `/courses`
- `/learner/courses/:slug` → `/courses/:slug`
- `/learner/courses/:slug/learn` → `/learn/:slug`
- `/learner/dashboard` → `/my-learning`

---

## Guards Summary

| Route Group | Layout | Guard | Domain ID Required |
|-------------|--------|-------|-------------------|
| `(public)` | PublicLayout | none | ❌ |
| `(auth)` | PublicMinimalLayout | GuestGuard | ❌ |
| `(student)` | AuthenticatedLayout | StudentGuard | ✅ (studentId) |
| `(creator)` | CreatorLayout | CreatorGuard | ✅ (teacherId) |
| `admin` | AdminLayout | AdminGuard | ❌ |

---

**End of Route Tree**

