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

5) Layout variants
5.1 PublicLayout (default)

Áp cho toàn bộ route public/SEO:

Header:

Logo → /

SearchBar (submit) → /search?q=...

Categories link → /categories

Tags link → /tags

AuthStatus:

guest: Login /login, Register /register

logged-in: Avatar menu (Profile /me/profile, My learning /my-learning, Teacher /teacher/courses nếu creator, Admin /admin nếu admin, Logout)

Footer

<Outlet />

Rule: PublicLayout vẫn có thể render khi user đã login (để xem course public), nhưng CTA sẽ chuyển sang flow auth/enroll.

5.2 PublicMinimalLayout (auth pages)

Áp cho: /login, /register, /forgot-password, /reset-password

Minimal header:

Back to Home → /

(optional) Logo

Không render SearchBar/Categories/Tags (tránh user rẽ nhánh khi đang auth)

<Outlet />

5.3 AuthenticatedLayout (Student/User)

Áp cho route guard: requireStudent và một số route requireAuth (account settings/profile).

Top bar: user menu + notifications shortcut + logout

Left nav (student):

My Learning → /my-learning

Wishlist → /wishlist

Notifications → /notifications

Profile → /me/profile

Settings → /settings

<Outlet />

Note: Route /me (AuthMeScreen) và /me/profile* dùng requireAuth (account-level).
Các route học tập/enrollment/review/comment dùng requireStudent (cần studentId).

5.4 CreatorLayout (Teacher/Instructor)

Áp cho guard: requireCreator

Left nav (creator):

Teacher Me → /teachers/me

Stats → /teachers/:id/stats (id = teacherId)

Revenue → /teachers/:id/revenue (id = teacherId)

Courses → /teacher/courses

Contextual nav (trong course manage):

Versions → /courses/:courseId/versions

Enrollments → /courses/:courseId/enrollments

Curriculum → /courses/:courseId/versions/:versionId/chapters

<Outlet />

Critical: :id trong stats/revenue = teacherId, không dùng accountId.

5.5 AdminLayout

Áp cho guard: requireAdmin

Left nav:

Dashboard → /admin

Users → /admin/users

Audit logs → /admin/audit-logs

Categories → /admin/categories

Tags → /admin/tags

Reports → /admin/reports

Revenue → /admin/reports/revenue

Statistics → /admin/statistics

<Outlet />

6) Route-level data prefetch (để nối API “ngon”)
6.1 Global bootstrap / hydrate (bắt buộc vì accountId ≠ studentId ≠ teacherId)

Chạy một lần khi app mount (hoặc sau login):

AUTH_ME → lấy accountId, role

Nếu role có student: STUDENT_GET_ME → lấy studentId

Nếu role có creator: TEACHER_GET_ME → lấy teacherId

Chỉ sau khi hydrate xong studentId/teacherId mới bật prefetch cho các route requireStudent/requireCreator.

6.2 Prefetch rules (React Query / SWR)

Prefetch theo route + contractKey (không invent endpoint).

Public routes: prefetch luôn (không cần token).

Protected routes: prefetch sau khi requireStudent/requireCreator/requireAdmin pass.

Pagination list: prefetch page 1 hoặc cursor đầu.

6.3 Prefetch map (theo routes hiện tại)
Public
Route	Prefetch contracts	Notes
/	COURSE_GET_LIST(trending) + CATEGORY_GET_TREE	Home load nhanh
/search?q=	COURSE_GET_LIST(q)	debounce query
/categories	CATEGORY_GET_TREE	
/categories/:slug	CATEGORY_GET_BY_SLUG + COURSE_GET_LIST(category=:slug)	
/courses	COURSE_GET_LIST(page=1)	list browse
/courses/:slug	COURSE_GET_DETAIL(slug) + REVIEW_GET_RATING_SUMMARY	CTA enroll/login
/courses/:slug/reviews	REVIEW_GET_COURSE_LIST(courseId) + (optional) REVIEW_GET_RATING_SUMMARY	
/tags	TAG_GET_LIST(page=1)	
/teachers/:id	TEACHER_GET_BY_ID(id)	id=teacherId
/lessons/:id	LESSON_GET_BY_ID(id)	preview
/lessons/:lessonId/comments	COMMENT_GET_LESSON_LIST(page=1)	
/courses/:courseId/comments	COMMENT_GET_COURSE_LIST(page=1)	
Auth pages (minimal)
Route	Prefetch contracts	Notes
/login	(none)	submit → AUTH_LOGIN
/register	(none)	submit → AUTH_REGISTER
/forgot-password	(none)	submit → AUTH_FORGOT_PASSWORD (nếu có)
/reset-password	AUTH_RESET_VALIDATE (optional)	validate token nếu BE hỗ trợ
Student (requireStudent)
Route	Prefetch contracts	Notes
/students/me	STUDENT_GET_ME	thường hydrate đã có
/my-learning	STUDENT_GET_ME + ENROLLMENT_GET_STUDENT_LIST(studentId,page=1)	studentId bắt buộc
/enrollments/:id	ENROLLMENT_GET_DETAIL	
/notifications	NOTIFICATION_GET_LIST(page=1)	
/learn/:courseSlug	COURSE_GET_DETAIL(slug) + curriculum (CHAPTER_GET_*) + progress overview (PROGRESS_*)	nếu có
/learn/:courseSlug/progress	progress overview contracts	
/learn/:courseSlug/lessons/:lessonId	LESSON_GET_BY_ID + LESSON_GET_VIDEO_STREAM_URL + RESOURCE_GET_BY_LESSON + COMMENT_GET_LESSON_LIST(page=1)	
/learn/:courseSlug/quizzes	quiz list contracts (QUIZ_GET_*)	
/learn/:courseSlug/quizzes/:quizId/attempt	QUIZ_START_ACTION (on enter)	start attempt
/lessons/:lessonId/quizzes	QUIZ_GET_BY_LESSON	
/quizzes/:id	QUIZ_GET_BY_ID	
/quizzes/:quizId/attempts/:attemptId	attempt detail (nếu có)	resume/play
/lessons/:lessonId/assignments	ASSIGNMENT_GET_BY_LESSON	
/assignments/:id	ASSIGNMENT_GET_BY_ID	
/assignments/:assignmentId/submit	ASSIGNMENT_GET_BY_ID	upload file on demand
/submissions/:id	SUBMISSION_GET_BY_ID	
/courses/:courseId/reviews/new	(optional) REVIEW_GET_RATING_SUMMARY	submit: REVIEW_CREATE
/courses/:courseId/comments/new	(optional) COURSE_GET_DETAIL	submit: COMMENT_CREATE_COURSE
/lessons/:lessonId/comments/new	(optional) LESSON_GET_BY_ID	submit: COMMENT_CREATE_LESSON
/comments/:id/edit	comment detail (nếu có)	submit: COMMENT_UPDATE
Creator (requireCreator)
Route	Prefetch contracts	Notes
/teachers/me	TEACHER_GET_ME	hydrate teacherId
/teachers/:id/stats	TEACHER_GET_STATS(id=teacherId)	id=teacherId
/teachers/:id/revenue	TEACHER_GET_REVENUE(id=teacherId)	id=teacherId
/teacher/courses	COURSE_GET_TEACHER_LIST(page=1)	
/teacher/courses/:id/edit	COURSE_GET_DETAIL(id)	
/courses/:courseId/versions	VERSION_GET_LIST(page=1)	
/courses/:courseId/versions/:versionId/chapters	CHAPTER_GET_BY_VERSION (+ lesson counts nếu có)	
/lessons/:lessonId/video	LESSON_GET_BY_ID	upload-url chỉ gọi khi chọn file: LESSON_GET_VIDEO_UPLOAD_URL
Admin (requireAdmin)
Route	Prefetch contracts	Notes
/admin	ADMIN_GET_STATISTICS + ADMIN_GET_REVENUE_REPORT	
/admin/users	ADMIN_GET_USERS_LIST(page=1)	
/admin/audit-logs	ADMIN_GET_AUDIT_LOGS_LIST(page=1)	
/admin/categories	CATEGORY_GET_TREE	
/admin/tags	TAG_GET_LIST(page=1)	
/admin/reports	REPORT_GET_ALL_LIST(page=1)	
/admin/reports/revenue	ADMIN_GET_REVENUE_REPORT	
/admin/statistics	ADMIN_GET_STATISTICS	
/admin/courses/:courseId/versions/:versionId/review	VERSION_GET_DETAIL (+ curriculum snapshot optional)	approve/reject on demand