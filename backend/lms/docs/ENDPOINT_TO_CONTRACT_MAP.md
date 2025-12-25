# Endpoint to Contract Key Mapping

**Generated:** 2025-12-25  
**Purpose:** Maps backend API endpoints to frontend contract keys, React Query hooks, and domain groups for consistent frontend integration.

---

## Table of Contents

1. [Mapping Rules](#mapping-rules)
2. [Endpoint Mapping Table](#endpoint-mapping-table)

---

## Mapping Rules

### Contract Key Format

```
<DOMAIN>_<VERB>_<RESOURCE>[_ACTION|_LIST|_DETAIL|_SEARCH|_CREATE|_UPDATE|_DELETE]
```

**Examples:**
- `AUTH_LOGIN` - Authentication login
- `COURSE_GET_LIST` - Get list of courses
- `COURSE_GET_DETAIL` - Get course detail
- `COURSE_CREATE` - Create course
- `ENROLLMENT_CANCEL_ACTION` - Cancel enrollment action

### React Query Hook Naming

**Query Hooks (GET):**
- Pattern: `use<Resource>` or `use<Resource>List` or `use<Resource>Detail`
- Examples: `useCourse`, `useCourses`, `useCategoryTree`

**Mutation Hooks (POST/PUT/DELETE):**
- Pattern: `use<Action><Resource>`
- Examples: `useCreateCourse`, `useUpdateProfile`, `useDeleteReview`

### Domain Groups

Domains are derived from controller package names:
- `AUTH` - Authentication (`auth`)
- `ACCOUNT` - Account management (`auth`)
- `STUDENT` - Student operations (`user`)
- `TEACHER` - Teacher operations (`user`)
- `COURSE` - Course management (`course`)
- `CATEGORY` - Category management (`course`)
- `ENROLLMENT` - Enrollment management (`learning`)
- `PROGRESS` - Progress tracking (`learning`)
- `REVIEW` - Course reviews (`course`)
- `RECOMMENDATION` - Recommendations (`recommendation`)
- `COMMENT` - Comments (`community`)
- `NOTIFICATION` - Notifications (`community.notification`)
- `QUIZ` - Quizzes/Assessments (`assessment`)
- `QUESTION` - Questions (`assessment`)
- `ASSIGNMENT` - Assignments (`assignment`)
- `SUBMISSION` - Submissions (`assignment`)
- `CHAPTER` - Course chapters (`course.content`)
- `LESSON` - Lessons (`course.content`)
- `RESOURCE` - Lesson resources (`course.content`)
- `FILE` - File storage (`course.content`)
- `TAG` - Course tags (`course`)
- `VERSION` - Course versions (`course`)
- `ADMIN` - Admin operations (`admin`)
- `REPORT` - Violation reports (`community`)

---

## Endpoint Mapping Table

| Method | Path | Domain | Contract Key | Suggested Hook | Auth/Roles | Pagination | Code Reference |
|--------|------|--------|--------------|----------------|------------|------------|----------------|
| POST | `/api/v1/auth/register` | AUTH | `AUTH_REGISTER` | `useRegister` | Public | N | `AuthController.registerAccount()` |
| POST | `/api/v1/auth/login` | AUTH | `AUTH_LOGIN` | `useLogin` | Public | N | `AuthController.login()` |
| POST | `/api/v1/auth/refresh` | AUTH | `AUTH_REFRESH` | `useRefreshToken` | Public | N | `AuthController.refreshAccessToken()` |
| POST | `/api/v1/auth/logout` | AUTH | `AUTH_LOGOUT` | `useLogout` | Public | N | `AuthController.logout()` |
| GET | `/api/v1/auth/me` | AUTH | `AUTH_ME` | `useCurrentUser` | Required | N | `AuthController.getCurrentUserInfo()` |
| GET | `/api/v1/accounts/me` | ACCOUNT | `ACCOUNT_GET_PROFILE` | `useProfile` | Required | N | `AccountController.getProfile()` |
| PUT | `/api/v1/accounts/me` | ACCOUNT | `ACCOUNT_UPDATE_PROFILE` | `useUpdateProfile` | Required | N | `AccountController.updateProfile()` |
| POST | `/api/v1/accounts/me/avatar` | ACCOUNT | `ACCOUNT_UPLOAD_AVATAR` | `useUploadAvatar` | Required | N | `AccountController.uploadAvatar()` |
| GET | `/api/v1/students/me` | STUDENT | `STUDENT_GET_ME` | `useCurrentStudent` | Required | N | `StudentController.getCurrentStudent()` |
| GET | `/api/v1/students/{id}` | STUDENT | `STUDENT_GET_BY_ID` | `useStudent` | Required | N | `StudentController.getStudentById()` |
| GET | `/api/v1/students/{id}/courses` | STUDENT | `STUDENT_GET_COURSES` | `useStudentCourses` | Required | Y | `StudentController.getStudentCourses()` |
| GET | `/api/v1/teachers/me` | TEACHER | `TEACHER_GET_ME` | `useCurrentTeacher` | Required | N | `TeacherController.getCurrentTeacher()` |
| GET | `/api/v1/teachers/{id}` | TEACHER | `TEACHER_GET_BY_ID` | `useTeacher` | Required | N | `TeacherController.getTeacherById()` |
| GET | `/api/v1/teachers/{id}/courses` | TEACHER | `TEACHER_GET_COURSES` | `useTeacherCourses` | Required | Y | `TeacherController.getTeacherCourses()` |
| GET | `/api/v1/teachers/{id}/stats` | TEACHER | `TEACHER_GET_STATS` | `useTeacherStats` | Required | N | `TeacherController.getTeacherStats()` |
| GET | `/api/v1/teachers/{id}/revenue` | TEACHER | `TEACHER_GET_REVENUE` | `useTeacherRevenue` | Required | N | `TeacherController.getTeacherRevenue()` |
| POST | `/api/v1/teacher/courses` | COURSE | `COURSE_CREATE` | `useCreateCourse` | Teacher | N | `CourseController.createNewCourse()` |
| GET | `/api/v1/courses/{slug}` | COURSE | `COURSE_GET_DETAIL` | `useCourse` | Public | N | `CourseController.getCourseBySlug()` |
| GET | `/api/v1/courses` | COURSE | `COURSE_GET_LIST` | `useCourses` | Public | Y | `CourseController.getCoursesActive()` |
| PUT | `/api/v1/teacher/courses/{id}` | COURSE | `COURSE_UPDATE` | `useUpdateCourse` | Teacher | N | `CourseController.updateCourse()` |
| DELETE | `/api/v1/teacher/courses/{id}` | COURSE | `COURSE_DELETE` | `useDeleteCourse` | Teacher | N | `CourseController.deleteCourse()` |
| PATCH | `/api/v1/teacher/courses/{id}/close` | COURSE | `COURSE_CLOSE_ACTION` | `useCloseCourse` | Teacher | N | `CourseController.closeCourse()` |
| PATCH | `/api/v1/teacher/courses/{id}/open` | COURSE | `COURSE_OPEN_ACTION` | `useOpenCourse` | Teacher | N | `CourseController.openCourse()` |
| GET | `/api/v1/categories/tree` | CATEGORY | `CATEGORY_GET_TREE` | `useCategoryTree` | Public | N | `CategoryController.getCategoryTree()` |
| GET | `/api/v1/categories/slug/{slug}` | CATEGORY | `CATEGORY_GET_BY_SLUG` | `useCategoryBySlug` | Public | N | `CategoryController.getCategoryBySlug()` |
| GET | `/api/v1/categories/{id}` | CATEGORY | `CATEGORY_GET_BY_ID` | `useCategory` | Public | N | `CategoryController.getCategoryById()` |
| POST | `/api/v1/admin/categories` | CATEGORY | `CATEGORY_CREATE` | `useCreateCategory` | Admin | N | `CategoryController.createCategory()` |
| PUT | `/api/v1/admin/categories/{id}` | CATEGORY | `CATEGORY_UPDATE` | `useUpdateCategory` | Admin | N | `CategoryController.updateCategory()` |
| DELETE | `/api/v1/admin/categories/{id}` | CATEGORY | `CATEGORY_DELETE` | `useDeleteCategory` | Admin | N | `CategoryController.deleteCategory()` |
| POST | `/api/v1/courses/{courseId}/enroll` | ENROLLMENT | `ENROLLMENT_CREATE` | `useEnrollCourse` | Student | N | `EnrollmentController.enrollCourse()` |
| GET | `/api/v1/students/{studentId}/enrollments` | ENROLLMENT | `ENROLLMENT_GET_STUDENT_LIST` | `useStudentEnrollments` | Student | Y | `EnrollmentController.getStudentEnrollments()` |
| GET | `/api/v1/courses/{courseId}/enrollments` | ENROLLMENT | `ENROLLMENT_GET_COURSE_LIST` | `useCourseEnrollments` | Teacher | Y | `EnrollmentController.getCourseEnrollments()` |
| GET | `/api/v1/enrollments/{id}` | ENROLLMENT | `ENROLLMENT_GET_DETAIL` | `useEnrollment` | Required | N | `EnrollmentController.getEnrollmentDetail()` |
| POST | `/api/v1/enrollments/{id}/cancel` | ENROLLMENT | `ENROLLMENT_CANCEL_ACTION` | `useCancelEnrollment` | Student | N | `EnrollmentController.cancelEnrollment()` |
| GET | `/api/v1/students/{studentId}/progress` | PROGRESS | `PROGRESS_GET_STUDENT_OVERVIEW` | `useStudentProgress` | Student | N | `ProgressController.getStudentProgress()` |
| GET | `/api/v1/students/{studentId}/courses/{courseId}/progress` | PROGRESS | `PROGRESS_GET_COURSE` | `useCourseProgress` | Student | N | `ProgressController.getStudentCourseProgress()` |
| POST | `/api/v1/lessons/{lessonId}/mark-viewed` | PROGRESS | `PROGRESS_MARK_VIEWED_ACTION` | `useMarkLessonViewed` | Student | N | `ProgressController.markLessonAsViewed()` |
| POST | `/api/v1/lessons/{lessonId}/mark-completed` | PROGRESS | `PROGRESS_MARK_COMPLETED_ACTION` | `useMarkLessonCompleted` | Student | N | `ProgressController.markLessonAsCompleted()` |
| POST | `/api/v1/courses/{courseId}/reviews` | REVIEW | `REVIEW_CREATE` | `useCreateReview` | Student | N | `CourseReviewController.createNewReview()` |
| GET | `/api/v1/courses/{courseId}/reviews` | REVIEW | `REVIEW_GET_COURSE_LIST` | `useCourseReviews` | Public | Y | `CourseReviewController.getCourseReviews()` |
| PUT | `/api/v1/courses/{courseId}/reviews/{reviewId}` | REVIEW | `REVIEW_UPDATE` | `useUpdateReview` | Student | N | `CourseReviewController.updateReview()` |
| DELETE | `/api/v1/courses/{courseId}/reviews/{reviewId}` | REVIEW | `REVIEW_DELETE` | `useDeleteReview` | Student | N | `CourseReviewController.deleteReview()` |
| GET | `/api/v1/courses/{courseId}/rating-summary` | REVIEW | `REVIEW_GET_RATING_SUMMARY` | `useRatingSummary` | Public | N | `CourseReviewController.getRatingSummary()` |
| GET | `/api/v1/students/{studentId}/recommendations` | RECOMMENDATION | `RECOMMENDATION_GET` | `useRecommendations` | Required | N | `RecommendationController.getRecommendations()` |
| POST | `/api/v1/recommendations/{id}/feedback` | RECOMMENDATION | `RECOMMENDATION_SUBMIT_FEEDBACK_ACTION` | `useSubmitRecommendationFeedback` | Required | N | `RecommendationController.giveFeedback()` |
| POST | `/api/v1/courses/{courseId}/comments` | COMMENT | `COMMENT_CREATE_COURSE` | `useCreateCourseComment` | Required | N | `CommentController.createCourseComment()` |
| POST | `/api/v1/lessons/{lessonId}/comments` | COMMENT | `COMMENT_CREATE_LESSON` | `useCreateLessonComment` | Required | N | `CommentController.createLessonComment()` |
| GET | `/api/v1/courses/{courseId}/comments` | COMMENT | `COMMENT_GET_COURSE_LIST` | `useCourseComments` | Public | N | `CommentController.getCourseComments()` |
| GET | `/api/v1/lessons/{lessonId}/comments` | COMMENT | `COMMENT_GET_LESSON_LIST` | `useLessonComments` | Public | N | `CommentController.getLessonComments()` |
| PUT | `/api/v1/comments/{id}` | COMMENT | `COMMENT_UPDATE` | `useUpdateComment` | Required | N | `CommentController.update()` |
| DELETE | `/api/v1/comments/{id}` | COMMENT | `COMMENT_DELETE` | `useDeleteComment` | Required | N | `CommentController.delete()` |
| GET | `/api/v1/notifications` | NOTIFICATION | `NOTIFICATION_GET_LIST` | `useNotifications` | Required | Y | `NotificationController.getNotifications()` |
| GET | `/api/v1/notifications/count-unread` | NOTIFICATION | `NOTIFICATION_GET_UNREAD_COUNT` | `useUnreadNotificationCount` | Required | N | `NotificationController.getUnreadCount()` |
| POST | `/api/v1/notifications/{id}/mark-read` | NOTIFICATION | `NOTIFICATION_MARK_READ_ACTION` | `useMarkNotificationRead` | Required | N | `NotificationController.markAsRead()` |
| POST | `/api/v1/notifications/mark-all-read` | NOTIFICATION | `NOTIFICATION_MARK_ALL_READ_ACTION` | `useMarkAllNotificationsRead` | Required | N | `NotificationController.markAllAsRead()` |
| DELETE | `/api/v1/notifications/{id}` | NOTIFICATION | `NOTIFICATION_DELETE` | `useDeleteNotification` | Required | N | `NotificationController.deleteNotification()` |
| POST | `/api/v1/lessons/{lessonId}/quizzes` | QUIZ | `QUIZ_CREATE` | `useCreateQuiz` | Teacher/Admin | N | `QuizController.createQuiz()` |
| GET | `/api/v1/lessons/{lessonId}/quizzes` | QUIZ | `QUIZ_GET_BY_LESSON` | `useQuizzesByLesson` | Public | N | `QuizController.getAllQuizzes()` |
| GET | `/api/v1/quizzes/{id}` | QUIZ | `QUIZ_GET_BY_ID` | `useQuiz` | Public | N | `QuizController.getQuiz()` |
| PUT | `/api/v1/quizzes/{id}` | QUIZ | `QUIZ_UPDATE` | `useUpdateQuiz` | Teacher/Admin | N | `QuizController.updateQuiz()` |
| DELETE | `/api/v1/quizzes/{id}` | QUIZ | `QUIZ_DELETE` | `useDeleteQuiz` | Teacher/Admin | N | `QuizController.deleteQuiz()` |
| POST | `/api/v1/quizzes/{id}/start` | QUIZ | `QUIZ_START_ACTION` | `useStartQuiz` | Required | N | `QuizAttemptController.startQuiz()` |
| POST | `/api/v1/quizzes/{quizId}/attempts/{attemptId}/submit-answer` | QUIZ | `QUIZ_SUBMIT_ANSWER_ACTION` | `useSubmitQuizAnswer` | Required | N | `QuizAttemptController.submitAnswer()` |
| POST | `/api/v1/quizzes/{quizId}/attempts/{attemptId}/finish` | QUIZ | `QUIZ_FINISH_ACTION` | `useFinishQuiz` | Required | N | `QuizAttemptController.finishQuiz()` |
| POST | `/api/v1/lessons/{lessonId}/assignments` | ASSIGNMENT | `ASSIGNMENT_CREATE` | `useCreateAssignment` | Teacher | N | `AssignmentController.createAssignment()` |
| GET | `/api/v1/lessons/{lessonId}/assignments` | ASSIGNMENT | `ASSIGNMENT_GET_BY_LESSON` | `useAssignmentsByLesson` | Required | N | `AssignmentController.getAssignmentsByLesson()` |
| GET | `/api/v1/assignments/{id}` | ASSIGNMENT | `ASSIGNMENT_GET_BY_ID` | `useAssignment` | Required | N | `AssignmentController.getAssignmentById()` |
| PUT | `/api/v1/assignments/{id}` | ASSIGNMENT | `ASSIGNMENT_UPDATE` | `useUpdateAssignment` | Teacher | N | `AssignmentController.updateAssignment()` |
| DELETE | `/api/v1/assignments/{id}` | ASSIGNMENT | `ASSIGNMENT_DELETE` | `useDeleteAssignment` | Teacher | N | `AssignmentController.deleteAssignment()` |
| POST | `/api/v1/assignments/{assignmentId}/submit` | SUBMISSION | `SUBMISSION_CREATE` | `useSubmitAssignment` | Required | N | `SubmissionController.submitAssignment()` |
| GET | `/api/v1/assignments/{assignmentId}/submissions` | SUBMISSION | `SUBMISSION_GET_BY_ASSIGNMENT` | `useSubmissionsByAssignment` | Required | N | `SubmissionController.getSubmissionsByAssignment()` |
| GET | `/api/v1/submissions/{id}` | SUBMISSION | `SUBMISSION_GET_BY_ID` | `useSubmission` | Required | N | `SubmissionController.getSubmissionById()` |
| POST | `/api/v1/submissions/{id}/grade` | SUBMISSION | `SUBMISSION_GRADE_ACTION` | `useGradeSubmission` | Teacher | N | `SubmissionController.gradeSubmission()` |
| POST | `/api/v1/submissions/{id}/feedback` | SUBMISSION | `SUBMISSION_FEEDBACK_ACTION` | `useFeedbackSubmission` | Teacher | N | `SubmissionController.feedbackSubmission()` |
| POST | `/api/v1/courses/{courseId}/versions/{versionId}/chapters` | CHAPTER | `CHAPTER_CREATE` | `useCreateChapter` | Teacher | N | `ChapterController.createNewChapter()` |
| GET | `/api/v1/courses/{courseId}/versions/{versionId}/chapters` | CHAPTER | `CHAPTER_GET_LIST` | `useChapters` | Public | N | `ChapterController.getListChapters()` |
| GET | `/api/v1/courses/{courseId}/versions/{versionId}/chapters/{chapterId}` | CHAPTER | `CHAPTER_GET_DETAIL` | `useChapter` | Public | N | `ChapterController.getDetailChapter()` |
| PUT | `/api/v1/courses/{courseId}/versions/{versionId}/chapters/{chapterId}` | CHAPTER | `CHAPTER_UPDATE` | `useUpdateChapter` | Teacher | N | `ChapterController.updateChapter()` |
| DELETE | `/api/v1/courses/{courseId}/versions/{versionId}/chapters/{chapterId}` | CHAPTER | `CHAPTER_DELETE` | `useDeleteChapter` | Teacher | N | `ChapterController.deleteChapter()` |
| POST | `/api/v1/courses/{courseId}/versions/{versionId}/chapters/reorder` | CHAPTER | `CHAPTER_REORDER_ACTION` | `useReorderChapters` | Teacher | N | `ChapterController.reorderChapters()` |
| POST | `/api/v1/chapters/{chapterId}/lessons` | LESSON | `LESSON_CREATE` | `useCreateLesson` | Teacher | N | `LessonController.createLesson()` |
| GET | `/api/v1/chapters/{chapterId}/lessons` | LESSON | `LESSON_GET_BY_CHAPTER` | `useLessonsByChapter` | Public | N | `LessonController.getLessonsByChapter()` |
| GET | `/api/v1/lessons/{id}` | LESSON | `LESSON_GET_BY_ID` | `useLesson` | Public | N | `LessonController.getLessonById()` |
| PUT | `/api/v1/lessons/{id}` | LESSON | `LESSON_UPDATE` | `useUpdateLesson` | Teacher | N | `LessonController.updateLesson()` |
| DELETE | `/api/v1/lessons/{id}` | LESSON | `LESSON_DELETE` | `useDeleteLesson` | Teacher | N | `LessonController.deleteLesson()` |
| GET | `/api/v1/lessons/{lessonId}/video/upload-url` | LESSON | `LESSON_GET_VIDEO_UPLOAD_URL` | `useLessonVideoUploadUrl` | Teacher | N | `LessonController.requestUploadUrl()` |
| POST | `/api/v1/lessons/{lessonId}/video/upload-complete` | LESSON | `LESSON_VIDEO_UPLOAD_COMPLETE_ACTION` | `useCompleteVideoUpload` | Teacher | N | `LessonController.uploadComplete()` |
| GET | `/api/v1/lessons/{lessonId}/video/stream-url` | LESSON | `LESSON_GET_VIDEO_STREAM_URL` | `useLessonVideoStreamUrl` | Public | N | `LessonController.getVideoStreamingUrl()` |
| POST | `/api/v1/lessons/{lessonId}/resources` | RESOURCE | `RESOURCE_CREATE_LINK` | `useCreateLessonResource` | Teacher | N | `LessonResourceController.addLinkResource()` |
| POST | `/api/v1/lessons/{lessonId}/resources/file` | RESOURCE | `RESOURCE_CREATE_FILE` | `useUploadLessonResourceFile` | Teacher | N | `LessonResourceController.addFileResource()` |
| GET | `/api/v1/lessons/{lessonId}/resources` | RESOURCE | `RESOURCE_GET_BY_LESSON` | `useLessonResources` | Public | N | `LessonResourceController.getLessonResources()` |
| GET | `/api/v1/lessons/{lessonId}/resources/{resourceId}` | RESOURCE | `RESOURCE_GET_BY_ID` | `useLessonResource` | Public | N | `LessonResourceController.getResourceById()` |
| PUT | `/api/v1/lessons/{lessonId}/resources/{resourceId}` | RESOURCE | `RESOURCE_UPDATE` | `useUpdateLessonResource` | Teacher | N | `LessonResourceController.updateResource()` |
| DELETE | `/api/v1/lessons/{lessonId}/resources/{resourceId}` | RESOURCE | `RESOURCE_DELETE` | `useDeleteLessonResource` | Teacher | N | `LessonResourceController.deleteResource()` |
| POST | `/api/v1/files/upload` | FILE | `FILE_UPLOAD` | `useUploadFile` | Required | N | `FileStorageController.uploadFile()` |
| GET | `/api/v1/files/{id}` | FILE | `FILE_GET_BY_ID` | `useFileStorage` | Required | N | `FileStorageController.getFileStorage()` |
| GET | `/api/v1/files/{id}/download` | FILE | `FILE_GET_DOWNLOAD_URL` | `useFileDownloadUrl` | Required | N | `FileStorageController.getDownloadUrl()` |
| DELETE | `/api/v1/files/{id}` | FILE | `FILE_DELETE` | `useDeleteFile` | Required | N | `FileStorageController.deleteFile()` |
| POST | `/api/v1/admin/tags` | TAG | `TAG_CREATE` | `useCreateTag` | Admin | N | `TagController.createTag()` |
| GET | `/api/v1/tags` | TAG | `TAG_GET_LIST` | `useTags` | Public | Y | `TagController.getTags()` |
| PUT | `/api/v1/admin/tags/{id}` | TAG | `TAG_UPDATE` | `useUpdateTag` | Admin | N | `TagController.updateTag()` |
| DELETE | `/api/v1/admin/tags/{id}` | TAG | `TAG_DELETE` | `useDeleteTag` | Admin | N | `TagController.deleteTag()` |
| POST | `/api/v1/courses/{courseId}/versions` | VERSION | `VERSION_CREATE` | `useCreateCourseVersion` | Teacher | N | `CourseVersionController.createCourseVersion()` |
| GET | `/api/v1/courses/{courseId}/versions` | VERSION | `VERSION_GET_LIST` | `useCourseVersions` | Teacher | N | `CourseVersionController.getCourseVersions()` |
| GET | `/api/v1/courses/{courseId}/versions/{versionId}` | VERSION | `VERSION_GET_DETAIL` | `useCourseVersion` | Teacher | N | `CourseVersionController.getCourseVersionById()` |
| POST | `/api/v1/courses/{courseId}/versions/{versionId}/submit-approval` | VERSION | `VERSION_SUBMIT_APPROVAL_ACTION` | `useSubmitVersionApproval` | Teacher | N | `CourseVersionController.submitApproval()` |
| POST | `/api/v1/courses/{courseId}/versions/{versionId}/approve` | VERSION | `VERSION_APPROVE_ACTION` | `useApproveCourseVersion` | Admin | N | `CourseVersionController.approveCourseVersion()` |
| POST | `/api/v1/courses/{courseId}/versions/{versionId}/reject` | VERSION | `VERSION_REJECT_ACTION` | `useRejectCourseVersion` | Admin | N | `CourseVersionController.rejectCourseVersion()` |
| POST | `/api/v1/courses/{courseId}/versions/{versionId}/publish` | VERSION | `VERSION_PUBLISH_ACTION` | `usePublishCourseVersion` | Teacher | N | `CourseVersionController.publishCourseVersion()` |
| GET | `/api/v1/admin/users` | ADMIN | `ADMIN_GET_USERS` | `useAdminUsers` | Admin | Y | `UserManagementController.getAllUsers()` |
| GET | `/api/v1/admin/users/stats` | ADMIN | `ADMIN_GET_USER_STATS` | `useAdminUserStats` | Admin | N | `UserManagementController.getUserStats()` |
| POST | `/api/v1/admin/users/export` | ADMIN | `ADMIN_EXPORT_USERS_ACTION` | `useExportUsers` | Admin | N | `UserManagementController.exportUsers()` |
| GET | `/api/v1/admin/dashboard` | ADMIN | `ADMIN_GET_DASHBOARD` | `useAdminDashboard` | Admin | N | `DashboardController.dashboard()` |
| GET | `/api/v1/admin/statistics` | ADMIN | `ADMIN_GET_STATISTICS` | `useAdminStatistics` | Admin | N | `DashboardController.statistics()` |
| GET | `/api/v1/admin/reports/revenue` | ADMIN | `ADMIN_GET_REVENUE_REPORT` | `useRevenueReport` | Admin | N | `DashboardController.revenueReport()` |
| GET | `/api/v1/admin/audit-logs` | ADMIN | `ADMIN_GET_AUDIT_LOGS` | `useAuditLogs` | Admin | Y | `AuditLogController.getAll()` |
| GET | `/api/v1/admin/audit-logs/search` | ADMIN | `ADMIN_SEARCH_AUDIT_LOGS` | `useSearchAuditLogs` | Admin | Y | `AuditLogController.search()` |
| GET | `/api/v1/admin/audit-logs/export` | ADMIN | `ADMIN_EXPORT_AUDIT_LOGS_ACTION` | `useExportAuditLogs` | Admin | N | `AuditLogController.export()` |
| GET | `/api/v1/admin/settings` | ADMIN | `ADMIN_GET_SETTINGS` | `useSystemSettings` | Admin | N | `SystemSettingController.getAll()` |
| POST | `/api/v1/admin/settings` | ADMIN | `ADMIN_CREATE_SETTING` | `useCreateSystemSetting` | Admin | N | `SystemSettingController.create()` |
| PUT | `/api/v1/admin/settings/{id}` | ADMIN | `ADMIN_UPDATE_SETTING` | `useUpdateSystemSetting` | Admin | N | `SystemSettingController.update()` |
| DELETE | `/api/v1/admin/settings/{id}` | ADMIN | `ADMIN_DELETE_SETTING` | `useDeleteSystemSetting` | Admin | N | `SystemSettingController.delete()` |
| POST | `/api/v1/reports` | REPORT | `REPORT_CREATE` | `useCreateViolationReport` | Required | N | `ViolationReportController.create()` |
| GET | `/api/v1/reports` | REPORT | `REPORT_GET_MY_LIST` | `useMyViolationReports` | Required | Y | `ViolationReportController.getMyReports()` |
| GET | `/api/v1/admin/reports` | REPORT | `REPORT_GET_ALL_LIST` | `useAllViolationReports` | Admin | Y | `ViolationReportController.getAll()` |
| GET | `/api/v1/reports/{id}` | REPORT | `REPORT_GET_DETAIL` | `useViolationReport` | Required | N | `ViolationReportController.getDetail()` |

---

## Notes

1. **Contract Keys** are used for:
   - API endpoint constants
   - Error code mappings
   - Feature flags
   - Cache keys

2. **Hook Naming** follows React Query conventions:
   - Query hooks: `use<Resource>` for single, `use<Resource>List` for lists
   - Mutation hooks: `use<Action><Resource>` (e.g., `useCreateCourse`, `useUpdateProfile`)

3. **Domain Groups** organize endpoints by feature area for frontend code structure.

4. **Pagination** endpoints return `PageResponse<T>` with `items`, `page`, `size`, `totalItems`, `totalPages`, `hasNext`, `hasPrevious`.

5. **Auth/Roles**:
   - `Public` - No authentication required
   - `Required` - Authentication required (any role)
   - `Student` - Requires STUDENT role
   - `Teacher` - Requires TEACHER role
   - `Admin` - Requires ADMIN role
   - `Teacher/Admin` - Requires TEACHER or ADMIN role

---

**Last Updated:** 2025-12-25  
**Maintained By:** Backend Team

