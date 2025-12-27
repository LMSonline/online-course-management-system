docs/routes.md
0) Conventions chung
Route params

:slug dùng cho public SEO routes (courseSlug, categorySlug)

:id dùng cho entity ID nội bộ (lessonId, quizId, attemptId, submissionId…)

Query params chuẩn

List/search: ?q=&page=&size=&sort=

Cursor list (nếu backend dùng cursor): ?cursor=&limit=

Filter: ?status=&type=&range= (admin/teacher)

Redirect next

Khi cần login/role: redirect /login?next=<original_path_with_query>

Sau login: nếu có next → đi next, không có → /

Error pages

* → NotFoundScreen

403 → ForbiddenScreen (hoặc show inline 403 component trong layout)

1) Layouts
1.1 PublicLayout

Header: logo, search bar, categories link, login/register

Footer

Outlet

1.2 PublicMinimalLayout (auth pages)

Minimal header (Back to Home)

Outlet

1.3 AuthenticatedLayout (Student/User)

Top bar + user menu

Left nav (My learning / Wishlist / Notifications / Profile / Settings)

Outlet

1.4 CreatorLayout (Teacher/Instructor)

Left nav (Courses / Versions / Curriculum / Revenue / Stats)

Outlet

1.5 AdminLayout

Left nav (Dashboard / Users / Audit logs / Categories / Tags / Reports / Revenue / Statistics)

Outlet

2) Route guards
2.1 guestOnly

Cho /login, /register, /forgot-password, /reset-password

Nếu đã đăng nhập → redirect /

2.2 requireAuth

Cần accessToken hợp lệ (hoặc refresh ok) và AUTH_ME đã hydrate xong (accountId, role).

Nếu chưa đăng nhập → redirect /login?next=...

2.3 requireStudent

requireAuth + role includes USER/STUDENT + studentId != null (từ STUDENT_GET_ME).

Nếu studentId null: show error "Student profile missing" + retry STUDENT_GET_ME.

2.4 requireCreator

requireAuth + role includes CREATOR/TEACHER + teacherId != null (từ TEACHER_GET_ME).

Nếu teacherId null: redirect /teachers/me hoặc show "Complete teacher profile".

2.5 requireAdmin

requireAuth + role == ADMIN.

Nếu sai role → /403 hoặc redirect /.

2.6 enrolledGuard (optional, cho học)

Với /learn/:courseSlug/**

Nếu backend trả 403/404 khi chưa enroll: FE show CTA enroll hoặc redirect course landing.

3) Route table
3.1 Public (Guest/SEO)
Path	Screen	Layout	Guard	Notes
/	HomeScreen	PublicLayout	none	trending/featured
/search	SearchResultsScreen	PublicLayout	none	?q=&sort=&page=
/categories	CategoryTreeScreen	PublicLayout	none	tree/list
/categories/:slug	CategoryDetailScreen	PublicLayout	none	courses in category
/courses	CourseListScreen	PublicLayout	none	browse all
/courses/:slug	CourseDetailScreen	PublicLayout	none	CTA enroll/login
/courses/:slug/reviews	CourseReviewsPublicScreen	PublicLayout	none	reviews list
/courses/:courseId/rating-summary	CourseRatingSummaryScreen	PublicLayout	none	(optional public route)
/tags	TagListScreen	PublicLayout	none	tag list
/teachers/:id	TeacherPublicProfileScreen	PublicLayout	none	:id = teacherId (NOT accountId)
/lessons/:id	LessonDetailPublicScreen	PublicLayout	none	preview only
/lessons/:lessonId/comments	LessonCommentsPublicScreen	PublicLayout	none	
/courses/:courseId/comments	CourseCommentsPublicScreen	PublicLayout	none	
/login	LoginScreen	PublicMinimalLayout	guestOnly	
/register	RegisterScreen	PublicMinimalLayout	guestOnly	
/forgot-password	ForgotPasswordScreen	PublicMinimalLayout	guestOnly	
/reset-password	ResetPasswordScreen	PublicMinimalLayout	guestOnly	needs token
/403	ForbiddenScreen	PublicLayout	none	
*	NotFoundScreen	PublicLayout	none	
3.2 Student/User (Authenticated)
Path	Screen	Layout	Guard	Notes
/students/me	StudentMeScreen	AuthenticatedLayout	requireStudent	student profile
/my-learning	MyEnrollmentsScreen	AuthenticatedLayout	requireStudent	enrollments list
/enrollments/:id	EnrollmentDetailScreen	AuthenticatedLayout	requireStudent	enrollment detail
/wishlist	WishlistScreen	AuthenticatedLayout	requireStudent	if backend has wishlist
/notifications	NotificationsScreen	AuthenticatedLayout	requireStudent	global notifications
/me	AuthMeScreen	AuthenticatedLayout	requireAuth	account profile (AUTH_ME)
/me/profile	ProfileScreen	AuthenticatedLayout	requireAuth	account profile
/me/profile/edit	ProfileEditScreen	AuthenticatedLayout	requireAuth	
/me/avatar	UploadAvatarScreen	AuthenticatedLayout	requireAuth	
/settings	SettingsScreen	AuthenticatedLayout	requireAuth	
/learn/:courseSlug	CourseLearningHomeScreen	AuthenticatedLayout	requireStudent	+ enrolledGuard optional
/learn/:courseSlug/progress	CourseProgressOverviewScreen	AuthenticatedLayout	requireStudent	progress overview
/learn/:courseSlug/lessons/:lessonId	LessonPlayerScreen	AuthenticatedLayout	requireStudent	+ enrolledGuard
/learn/:courseSlug/announcements	CourseAnnouncementsScreen	AuthenticatedLayout	requireStudent	
/learn/:courseSlug/qna	CourseQAScreen	AuthenticatedLayout	requireStudent	
/learn/:courseSlug/resources	CourseResourcesScreen	AuthenticatedLayout	requireStudent	
/learn/:courseSlug/quizzes	CourseQuizListScreen	AuthenticatedLayout	requireStudent	
/learn/:courseSlug/quizzes/:quizId/attempt	QuizAttemptScreen	AuthenticatedLayout	requireStudent	start attempt
/lessons/:lessonId/quizzes	LessonQuizzesScreen	AuthenticatedLayout	requireStudent	quizzes for lesson
/quizzes/:id	QuizDetailScreen	AuthenticatedLayout	requireStudent	quiz detail
/quizzes/:id/attempt	QuizAttemptScreen	AuthenticatedLayout	requireStudent	start attempt
/quizzes/:quizId/attempts/:attemptId	QuizAttemptPlayScreen	AuthenticatedLayout	requireStudent	play attempt
/lessons/:lessonId/assignments	LessonAssignmentsScreen	AuthenticatedLayout	requireStudent	assignments for lesson
/assignments/:id	AssignmentDetailScreen	AuthenticatedLayout	requireStudent	assignment detail
/assignments/:assignmentId/submit	SubmitAssignmentScreen	AuthenticatedLayout	requireStudent	submit assignment
/submissions/:id	SubmissionDetailScreen	AuthenticatedLayout	requireStudent	submission detail
/recommendations	RecommendationScreen	AuthenticatedLayout	requireStudent	recommendations
/recommendations/:id/feedback	RecommendationFeedbackScreen	AuthenticatedLayout	requireStudent	feedback
/reports	MyReportsScreen	AuthenticatedLayout	requireStudent	my reports
/reports/new	SubmitReportScreen	AuthenticatedLayout	requireStudent	create report
/reports/:id	ReportDetailScreen	AuthenticatedLayout	requireStudent	report detail
/courses/:courseId/reviews/new	WriteCourseReviewScreen	AuthenticatedLayout	requireStudent	require enroll (rule)
/courses/:courseId/reviews/:reviewId/edit	EditCourseReviewScreen	AuthenticatedLayout	requireStudent	
/courses/:courseId/comments/new	CreateCourseCommentScreen	AuthenticatedLayout	requireStudent	
/lessons/:lessonId/comments/new	CreateLessonCommentScreen	AuthenticatedLayout	requireStudent	
/comments/:id/edit	EditCommentScreen	AuthenticatedLayout	requireStudent	
3.3 Teacher/Creator (Instructor)
Path	Screen	Layout	Guard	Notes
/teachers/me	TeacherMeScreen	CreatorLayout	requireCreator	
/teachers/:id/stats	TeacherStatsScreen	CreatorLayout	requireCreator	:id = teacherId (NOT accountId), use teacherId from TEACHER_GET_ME
/teachers/:id/revenue	TeacherRevenueScreen	CreatorLayout	requireCreator	:id = teacherId (NOT accountId), use teacherId from TEACHER_GET_ME
/teacher/courses	TeacherCourseListScreen	CreatorLayout	requireCreator	
/teacher/courses/new	TeacherCourseCreateScreen	CreatorLayout	requireCreator	
/teacher/courses/:id/edit	TeacherCourseEditScreen	CreatorLayout	requireCreator	
/teacher/courses/:id/status	TeacherCourseOpenCloseScreen	CreatorLayout	requireCreator	
/courses/:courseId/enrollments	CourseEnrollmentsScreen	CreatorLayout	requireCreator	
/courses/:courseId/versions	CourseVersionsScreen	CreatorLayout	requireCreator	
/courses/:courseId/versions/new	CreateVersionScreen	CreatorLayout	requireCreator	
/courses/:courseId/versions/:versionId	VersionDetailScreen	CreatorLayout	requireCreator	
/courses/:courseId/versions/:versionId/submit-approval	SubmitVersionApprovalScreen	CreatorLayout	requireCreator	
/courses/:courseId/versions/:versionId/publish	PublishVersionScreen	CreatorLayout	requireCreator	
/courses/:courseId/versions/:versionId/chapters	ChapterManageScreen	CreatorLayout	requireCreator	
/chapters/:chapterId/lessons	LessonManageScreen	CreatorLayout	requireCreator	
/lessons/:lessonId/video	LessonVideoUploadFlowScreen	CreatorLayout	requireCreator	
/lessons/:lessonId/resources	LessonResourcesManageScreen	CreatorLayout	requireCreator	
/lessons/:lessonId/quizzes/manage	QuizManageScreen	CreatorLayout	requireCreator	
/lessons/:lessonId/assignments/manage	AssignmentManageScreen	CreatorLayout	requireCreator	
/submissions/:id/grade	GradeSubmissionScreen	CreatorLayout	requireCreator	
/submissions/:id/feedback	FeedbackSubmissionScreen	CreatorLayout	requireCreator	
/files/:id	FileStorageScreen	CreatorLayout	requireCreator	
3.4 Admin
Path	Screen	Layout	Guard	Notes
/admin	AdminDashboardScreen	AdminLayout	requireAdmin	
/admin/users	AdminUsersScreen	AdminLayout	requireAdmin	
/admin/users/stats	AdminUserStatsScreen	AdminLayout	requireAdmin	
/admin/users/export	AdminExportUsersScreen	AdminLayout	requireAdmin	
/admin/audit-logs	AdminAuditLogsScreen	AdminLayout	requireAdmin	
/admin/audit-logs/search	AdminAuditLogsSearchScreen	AdminLayout	requireAdmin	
/admin/audit-logs/export	AdminAuditLogsExportScreen	AdminLayout	requireAdmin	
/admin/settings	AdminSystemSettingsScreen	AdminLayout	requireAdmin	
/admin/categories	AdminCategoriesScreen	AdminLayout	requireAdmin	
/admin/tags	AdminTagsScreen	AdminLayout	requireAdmin	
/admin/reports	AdminReportsAllScreen	AdminLayout	requireAdmin	
/admin/reports/revenue	AdminRevenueReportScreen	AdminLayout	requireAdmin	
/admin/statistics	AdminStatisticsScreen	AdminLayout	requireAdmin	
/admin/courses/:courseId/versions/:versionId/review	AdminCourseVersionApprovalScreen	AdminLayout	requireAdmin	
4) Navigation map (ai bấm gì đi đâu)
4.1 Public header

Logo → /

Search submit → /search?q=...

Categories → /categories

Login → /login

Register → /register

4.2 Course CTA (public → auth)

CTA "Enroll / Start learning"

guest → /login?next=/learn/:courseSlug

logged-in user → call enroll → /learn/:courseSlug

4.2.1 After login redirect

Nếu có next → đi next, không có → redirect theo role:
- USER → /my-learning
- CREATOR → /teacher/courses
- ADMIN → /admin

Lưu ý: Sau login phải hydrate profile (AUTH_ME → STUDENT_GET_ME/TEACHER_GET_ME) để có studentId/teacherId trước khi navigate.

4.3 Student sidebar (AuthenticatedLayout)

My Learning → /my-learning

Wishlist → /wishlist

Notifications → /notifications

Profile → /me

Settings → /settings

4.4 Learning navigation (within /learn/:courseSlug/*)

Home → /learn/:courseSlug

Lecture → /learn/:courseSlug/lecture/:lessonId

Announcements → /learn/:courseSlug/announcements

Q&A → /learn/:courseSlug/qna

Resources → /learn/:courseSlug/resources

Quizzes → /learn/:courseSlug/quizzes

4.5 Creator sidebar (CreatorLayout)

My teacher profile → /teachers/me

Stats → /teachers/:id/stats (dùng teacherId từ TEACHER_GET_ME, KHÔNG dùng accountId)

Revenue → /teachers/:id/revenue (dùng teacherId từ TEACHER_GET_ME, KHÔNG dùng accountId)

Courses → /teacher/courses

Within course manage:

Versions → /courses/:courseId/versions

Enrollments → /courses/:courseId/enrollments

Curriculum (chapters) → /courses/:courseId/versions/:versionId/chapters

Lessons → /chapters/:chapterId/lessons

Upload video → /lessons/:lessonId/video

Resources → /lessons/:lessonId/resources

Quiz manage → /lessons/:lessonId/quizzes/manage

Assignment manage → /lessons/:lessonId/assignments/manage

4.6 Admin sidebar (AdminLayout)

Dashboard → /admin

Users → /admin/users

Audit logs → /admin/audit-logs / /admin/audit-logs/search

Categories → /admin/categories

Tags → /admin/tags

Reports → /admin/reports

Revenue → /admin/reports/revenue

Statistics → /admin/statistics

5) Route-level prefetch (để FE "mượt")
Public

/: prefetch trending courses + category tree

/search: prefetch courses list with q

/categories: prefetch category tree

/categories/:slug: prefetch category detail + courses by category

/courses/:slug: prefetch course detail + rating summary

/courses/:slug/reviews: prefetch review list + rating summary

/tags: prefetch tags list

Student

/students/me: prefetch STUDENT_GET_ME

/my-learning: prefetch STUDENT_GET_ME + enrollments (dùng studentId từ STUDENT_GET_ME)

/learn/:courseSlug: prefetch course detail + curriculum + progress overview

/learn/:courseSlug/progress: prefetch progress overview

/learn/:courseSlug/lessons/:lessonId: prefetch lesson detail + stream-url + resources + first page comments

/notifications: prefetch notifications list

/quizzes/:id: prefetch quiz detail

/assignments/:id: prefetch assignment detail

/submissions/:id: prefetch submission detail

Creator

/teachers/me: prefetch TEACHER_GET_ME

/teachers/:id/stats: prefetch teacher stats (dùng teacherId từ TEACHER_GET_ME)

/teachers/:id/revenue: prefetch teacher revenue (dùng teacherId từ TEACHER_GET_ME)

/teacher/courses: prefetch teacher course list

/courses/:courseId/versions: prefetch versions

/courses/:courseId/versions/:versionId/chapters: prefetch chapters + lessons counts

/lessons/:lessonId/video: prefetch lesson detail then request upload url when user selects file

Admin

/admin: prefetch statistics + revenue report

/admin/users: prefetch users list

/admin/audit-logs: prefetch logs list

/admin/categories: prefetch category tree

/admin/tags: prefetch tags list

/admin/reports: prefetch reports list

5.1 Hydrate profile after login/app boot

Sau login hoặc app boot: AUTH_ME → STUDENT_GET_ME (nếu role USER) hoặc TEACHER_GET_ME (nếu role CREATOR) để hydrate studentId/teacherId.

6) Guards implementation notes (React Router example)

RequireAuth: check accessToken hợp lệ; call AUTH_ME để hydrate accountId + role. Nếu chưa có → redirect /login?next=...

RequireStudent: requireAuth + kiểm tra role includes USER/STUDENT + studentId != null (từ STUDENT_GET_ME). Nếu studentId null → show error + retry STUDENT_GET_ME.

RequireCreator: requireAuth + kiểm tra role includes CREATOR/TEACHER + teacherId != null (từ TEACHER_GET_ME). Nếu teacherId null → redirect /teachers/me hoặc show "Complete teacher profile".

RequireAdmin: requireAuth + kiểm tra role == ADMIN. Nếu sai → /403 hoặc redirect /.

Lưu ý: Tuyệt đối không dùng accountId thay cho studentId/teacherId khi construct routes với :id (ví dụ: /teachers/:id/stats phải dùng teacherId, không dùng accountId).

If API returns 401 mid-session → refresh token flow (client) rồi retry request; nếu refresh fail → logout + redirect /login?next=....

---

## Change Log

- **Updated Guards section (2.2-2.5)**: Added requireStudent, requireCreator, requireAdmin with domain ID checks (studentId/teacherId from profile endpoints, not accountId).
- **Added missing Public routes**: TagListScreen (/tags), fixed screen names (CategoryTreeScreen, CourseDetailScreen, CourseReviewsPublicScreen).
- **Added missing Student routes**: StudentMeScreen (/students/me), EnrollmentDetailScreen, CourseProgressOverviewScreen, LessonPlayerScreen (updated path), LessonQuizzesScreen, QuizDetailScreen, QuizAttemptPlayScreen, LessonAssignmentsScreen, AssignmentDetailScreen, SubmitAssignmentScreen, SubmissionDetailScreen, RecommendationScreen, RecommendationFeedbackScreen, MyReportsScreen, SubmitReportScreen, ReportDetailScreen, AuthMeScreen, ProfileScreen (/me/profile), ProfileEditScreen (/me/profile/edit), UploadAvatarScreen (/me/avatar).
- **Updated Student routes guards**: Changed from requireAuth to requireStudent for all student-specific routes.
- **Updated Teacher routes guards**: Changed from requireRole(creator) to requireCreator, added explicit notes that :id = teacherId (NOT accountId) for stats/revenue routes.
- **Updated Admin routes guards**: Changed from requireRole(admin) to requireAdmin.
- **Updated Navigation map (4.2.1)**: Added after-login redirect logic by role (USER→/my-learning, CREATOR→/teacher/courses, ADMIN→/admin) and note about profile hydration.
- **Updated Navigation map (4.5)**: Added explicit note to use teacherId from TEACHER_GET_ME (not accountId) for stats/revenue routes.
- **Updated Prefetch section (5)**: Added missing routes, added section 5.1 about profile hydration after login/app boot (AUTH_ME → STUDENT_GET_ME/TEACHER_GET_ME).
- **Updated Guards implementation notes (6)**: Clarified requireStudent, requireCreator, requireAdmin logic, added critical note about never using accountId in place of studentId/teacherId for route construction.

