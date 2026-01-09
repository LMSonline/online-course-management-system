Public (Guest/SEO)
ScreenName	PrimaryResource	Type	Auth	OwnerService	EntryRoute
HomeScreen	course	list	public	dou	/
CourseListScreen	course	list	public	dou	/courses
CourseDetailScreen	course	detail	public	dou	/courses/:slug
CategoryTreeScreen	category	list	public	dou	/categories
CategoryDetailScreen	category	detail	public	dou	/categories/:slug
TagListScreen	tag	list	public	dou	/tags
TeacherPublicProfileScreen	teacher	detail	public	dou	/teachers/:id
LessonDetailPublicScreen	lesson	detail	public	dou	/lessons/:id
LessonCommentsPublicScreen	comment	list	public	dou	/lessons/:lessonId/comments
CourseCommentsPublicScreen	comment	list	public	dou	/courses/:courseId/comments
CourseReviewsPublicScreen	review	list	public	dou	/courses/:courseId/reviews
NotFoundScreen	n/a	detail	public	N/A	*

Nguồn: COURSE_GET_LIST, COURSE_GET_DETAIL, CATEGORY_GET_TREE, CATEGORY_GET_BY_SLUG, TAG_GET_LIST, TEACHER_GET_BY_ID, LESSON_GET_BY_ID, COMMENT_GET_*, REVIEW_GET_COURSE_LIST. 

ENDPOINT_TO_CONTRACT_MAP

Auth / Account
ScreenName	PrimaryResource	Type	Auth	OwnerService	EntryRoute
LoginScreen	auth	create	public	auth	/login
RegisterScreen	auth	create	public	auth	/register
AuthMeScreen	account	detail	user	auth	/me
ProfileScreen	account	detail	user	auth	/me/profile
ProfileEditScreen	account	update	user	auth	/me/profile/edit
UploadAvatarScreen	account	update	user	auth	/me/avatar

Nguồn: AUTH_LOGIN, AUTH_REGISTER, AUTH_ME, ACCOUNT_GET_PROFILE, ACCOUNT_UPDATE_PROFILE, ACCOUNT_UPLOAD_AVATAR. 

ENDPOINT_TO_CONTRACT_MAP

Student (Learning)
ScreenName	PrimaryResource	Type	Auth	OwnerService	EntryRoute
StudentMeScreen	student	detail	user	dou	/students/me
MyEnrollmentsScreen	enrollment	list	user	dou	/my-learning
EnrollmentDetailScreen	enrollment	detail	user	dou	/enrollments/:id
CourseLearningHomeScreen	course/enrollment	detail	user	dou	/learn/:courseId
CourseProgressOverviewScreen	progress	detail	user	dou	/learn/:courseId/progress
LessonPlayerScreen	lesson/progress	detail	user	dou	/learn/:courseId/lessons/:lessonId
MarkLessonViewedScreen	progress	update	user	dou	/learn/:courseId/lessons/:lessonId/viewed
MarkLessonCompletedScreen	progress	update	user	dou	/learn/:courseId/lessons/:lessonId/completed
RecommendationScreen	recommendation	detail	user	dou	/recommendations
RecommendationFeedbackScreen	recommendation	update	user	dou	/recommendations/:id/feedback
NotificationsScreen	notification	list	user	dou	/notifications
SubmitReportScreen	report	create	user	dou	/reports/new
MyReportsScreen	report	list	user	dou	/reports
ReportDetailScreen	report	detail	user	dou	/reports/:id

Nguồn: STUDENT_GET_ME, ENROLLMENT_CREATE, ENROLLMENT_GET_STUDENT_LIST, ENROLLMENT_GET_DETAIL, ENROLLMENT_CANCEL_ACTION, PROGRESS_GET_*, PROGRESS_MARK_*, RECOMMENDATION_GET, RECOMMENDATION_SUBMIT_FEEDBACK_ACTION, NOTIFICATION_*, REPORT_*. 

ENDPOINT_TO_CONTRACT_MAP

Reviews & Comments (Student actions)
ScreenName	PrimaryResource	Type	Auth	OwnerService	EntryRoute
WriteCourseReviewScreen	review	create	user	dou	/courses/:courseId/reviews/new
EditCourseReviewScreen	review	update	user	dou	/courses/:courseId/reviews/:reviewId/edit
CourseRatingSummaryScreen	review	detail	public	dou	/courses/:courseId/rating-summary
CreateCourseCommentScreen	comment	create	user	dou	/courses/:courseId/comments/new
CreateLessonCommentScreen	comment	create	user	dou	/lessons/:lessonId/comments/new
EditCommentScreen	comment	update	user	dou	/comments/:id/edit

Nguồn: REVIEW_CREATE/UPDATE/DELETE/GET_RATING_SUMMARY, COMMENT_CREATE_*, COMMENT_UPDATE/DELETE. 

ENDPOINT_TO_CONTRACT_MAP

Assessment (Quiz / Assignment) — Student view/do
ScreenName	PrimaryResource	Type	Auth	OwnerService	EntryRoute
LessonQuizzesScreen	quiz	list	user	dou	/lessons/:lessonId/quizzes
QuizDetailScreen	quiz	detail	user	dou	/quizzes/:id
QuizAttemptScreen	attempt	create	user	dou	/quizzes/:id/attempt
QuizAttemptPlayScreen	attempt	update	user	dou	/quizzes/:quizId/attempts/:attemptId
LessonAssignmentsScreen	assignment	list	user	dou	/lessons/:lessonId/assignments
AssignmentDetailScreen	assignment	detail	user	dou	/assignments/:id
SubmitAssignmentScreen	submission	create	user	dou	/assignments/:assignmentId/submit
SubmissionDetailScreen	submission	detail	user	dou	/submissions/:id

Nguồn: QUIZ_GET_BY_LESSON, QUIZ_GET_BY_ID, QUIZ_START_ACTION, QUIZ_SUBMIT_ANSWER_ACTION, QUIZ_FINISH_ACTION, ASSIGNMENT_GET_BY_LESSON, ASSIGNMENT_GET_BY_ID, SUBMISSION_CREATE, SUBMISSION_GET_BY_ID. 

ENDPOINT_TO_CONTRACT_MAP

Teacher/Instructor (Create/Manage content)
ScreenName	PrimaryResource	Type	Auth	OwnerService	EntryRoute
TeacherMeScreen	teacher	detail	creator	dou	/teachers/me
TeacherStatsScreen	teacher	detail	creator	dou	/teachers/:id/stats
TeacherRevenueScreen	teacher	detail	creator	dou	/teachers/:id/revenue
TeacherCourseListScreen	course	list	creator	dou	/teacher/courses
TeacherCourseCreateScreen	course	create	creator	dou	/teacher/courses/new
TeacherCourseEditScreen	course	update	creator	dou	/teacher/courses/:id/edit
TeacherCourseOpenCloseScreen	course	update	creator	dou	/teacher/courses/:id/status
CourseEnrollmentsScreen	enrollment	list	creator	dou	/courses/:courseId/enrollments
CourseVersionsScreen	version	list	creator	dou	/courses/:courseId/versions
VersionDetailScreen	version	detail	creator	dou	/courses/:courseId/versions/:versionId
CreateVersionScreen	version	create	creator	dou	/courses/:courseId/versions/new
SubmitVersionApprovalScreen	version	update	creator	dou	/courses/:courseId/versions/:versionId/submit-approval
PublishVersionScreen	version	update	creator	dou	/courses/:courseId/versions/:versionId/publish
ChapterManageScreen	chapter	update	creator	dou	/courses/:courseId/versions/:versionId/chapters
LessonManageScreen	lesson	update	creator	dou	/chapters/:chapterId/lessons
LessonVideoUploadFlowScreen	lesson	update	creator	dou	/lessons/:lessonId/video
LessonResourcesManageScreen	resource	update	creator	dou	/lessons/:lessonId/resources
QuizManageScreen	quiz	update	creator	dou	/lessons/:lessonId/quizzes/manage
AssignmentManageScreen	assignment	update	creator	dou	/lessons/:lessonId/assignments/manage
GradeSubmissionScreen	submission	update	creator	dou	/submissions/:id/grade
FeedbackSubmissionScreen	submission	update	creator	dou	/submissions/:id/feedback
FileStorageScreen	file	detail	creator	dou	/files/:id

Nguồn: TEACHER_GET_ME/STATS/REVENUE, COURSE_CREATE/UPDATE/DELETE/OPEN/CLOSE, ENROLLMENT_GET_COURSE_LIST, VERSION_*, CHAPTER_*, LESSON_*, LESSON_GET_VIDEO_UPLOAD_URL, LESSON_VIDEO_UPLOAD_COMPLETE_ACTION, RESOURCE_*, QUIZ_CREATE/UPDATE/DELETE, ASSIGNMENT_CREATE/UPDATE/DELETE, SUBMISSION_GRADE_ACTION/FEEDBACK_ACTION, FILE_*. 

ENDPOINT_TO_CONTRACT_MAP

Admin
ScreenName	PrimaryResource	Type	Auth	OwnerService	EntryRoute
AdminDashboardScreen	admin	detail	admin	dou	/admin
AdminUsersScreen	admin/user	list	admin	dou	/admin/users
AdminUserStatsScreen	admin/user	detail	admin	dou	/admin/users/stats
AdminExportUsersScreen	admin/user	create	admin	dou	/admin/users/export
AdminAuditLogsScreen	admin/audit	list	admin	dou	/admin/audit-logs
AdminAuditLogsSearchScreen	admin/audit	list	admin	dou	/admin/audit-logs/search
AdminAuditLogsExportScreen	admin/audit	create	admin	dou	/admin/audit-logs/export
AdminSystemSettingsScreen	admin/settings	list	admin	dou	/admin/settings
AdminCategoriesScreen	category	list	admin	dou	/admin/categories
AdminTagsScreen	tag	list	admin	dou	/admin/tags
AdminReportsAllScreen	report	list	admin	dou	/admin/reports
AdminCourseVersionApprovalScreen	version	update	admin	dou	/admin/courses/:courseId/versions/:versionId/review
AdminRevenueReportScreen	admin/report	detail	admin	dou	/admin/reports/revenue
AdminStatisticsScreen	admin	detail	admin	dou	/admin/statistics

Nguồn: ADMIN_*, CATEGORY_CREATE/UPDATE/DELETE, TAG_CREATE/UPDATE/DELETE, REPORT_GET_ALL_LIST, VERSION_APPROVE_ACTION, VERSION_REJECT_ACTION, ADMIN_GET_REVENUE_REPORT. 

ENDPOINT_TO_CONTRACT_MAP

