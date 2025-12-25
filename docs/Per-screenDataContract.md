Public (Guest/SEO)
1) HomeScreen (/)

Initial queries:

GET /courses?sort=trending&limit=...

GET /categories (hoặc GET /categories/tree nếu bạn hiển thị cây)

Fields needed (course card):
id, slug, title, thumbnailUrl, instructorName, ratingAvg, ratingCount, price, discountPrice

Subresources: (optional) banner/featured categories

Pagination: cursor/offset (tuỳ BE; nếu limit-based thì load-more)

Empty/error:

loading: skeleton list

empty: “No courses found”

error: retry button

2) CourseListScreen (/courses)

Initial queries:

GET /courses?page=&size=&sort= (default sort: newest/popular)

(optional) GET /categories/tree để filter

Fields needed (course card):
id, slug, title, thumbnailUrl, instructorName, ratingAvg, ratingCount, price, discountPrice

Subresources:

filters: category/level/rating/price

sort options

Pagination: page/size hoặc cursor/offset (theo BE)

Empty/error: skeleton → empty state → retry

3) CourseDetailScreen (/courses/:slug)

Initial queries:

GET /courses/:slug

(optional) GET /courses/:courseId/rating-summary (tóm tắt rating)

Fields needed (course landing):

header: id, slug, title, subtitle?, description, thumbnailUrl

instructor: teacherId, instructorName, instructorAvatar?

meta: category{name,slug}?, tags[]?, level?, language?, lastUpdated?

stats: ratingAvg, ratingCount, studentsCount?, totalLessons?, totalDuration?

pricing: price, discountPrice, currency?

Subresources:

curriculum preview (nếu public cho xem): chapters/lessons preview

preview reviews/comments (link qua screens riêng)

Pagination: N/A (detail)

Empty/error:

404: “Course not found”

error loading rating-summary: show “—” + retry section

4) CategoryTreeScreen (/categories)

Initial queries:

GET /categories/tree (hoặc GET /categories nếu flat list)

Fields needed:
id, name, slug, children[] (id,name,slug) (nếu tree)

Subresources: none

Pagination: none

Empty/error: skeleton → empty (“No categories”) → retry

5) CategoryDetailScreen (/categories/:slug)

Initial queries:

GET /categories/:slug

GET /courses?category=:slug&page=&size=&sort=

Fields needed:

category header: id, name, slug, description?

course card fields: id, slug, title, thumbnailUrl, instructorName, ratingAvg, ratingCount, price, discountPrice

Subresources:

breadcrumb / parent category (optional)

Pagination: page/size hoặc cursor/offset

Empty/error:

empty: “No courses in this category”

error: retry

6) TagListScreen (/tags)

Initial queries:

GET /tags?page=&size=&sort= (hoặc GET /tags nếu ít)

Fields needed (tag item):
id, name, slug, coursesCount?

Subresources: search tag (client-side nếu list nhỏ)

Pagination: page/size hoặc none

Empty/error: skeleton → empty → retry

7) TeacherPublicProfileScreen (/teachers/:id)

Initial queries:

GET /teachers/:id

GET /courses?teacherId=:id&page=&size=&sort=popular

Fields needed:

teacher header: id, name, avatarUrl, headline?, bio?, totalStudents?, totalCourses?, ratingAvg?

course cards: id, slug, title, thumbnailUrl, ratingAvg, ratingCount, price, discountPrice

Subresources:

social links (optional)

Pagination: courses list page/size hoặc cursor

Empty/error:

404 teacher not found

empty: “No courses by this instructor”

8) LessonDetailPublicScreen (/lessons/:id)

Initial queries:

GET /lessons/:id

Fields needed:
id, title, courseId, courseSlug?, chapterId?, duration?, description/content?, previewVideoUrl?
(public lesson thường là preview, tuỳ hệ thống)

Subresources:

resources preview (nếu cho xem): GET /lessons/:id/resources

Pagination: none

Empty/error: 404 lesson not found; error → retry

9) LessonCommentsPublicScreen (/lessons/:lessonId/comments)

Initial queries:

GET /lessons/:lessonId/comments?page=&size=&sort=latest

Fields needed (comment item):
id, authorName, authorAvatar?, content, createdAt, updatedAt?, likeCount?, replyCount?

Subresources:

nested replies (nếu BE support): GET /comments/:id/replies

Pagination: page/size (recommended)

Empty/error: empty “No comments yet” + retry

10) CourseCommentsPublicScreen (/courses/:courseId/comments)

Initial queries:

GET /courses/:courseId/comments?page=&size=&sort=latest

Fields needed (comment item):
id, authorName, authorAvatar?, content, createdAt, likeCount?, replyCount?

Subresources: replies (optional)

Pagination: page/size

Empty/error: empty + retry

11) CourseReviewsPublicScreen (/courses/:courseId/reviews)

Initial queries:

GET /courses/:courseId/reviews?page=&size=&sort=top

(optional) GET /courses/:courseId/rating-summary

Fields needed (review item):
id, userName, userAvatar?, rating, content, createdAt, updatedAt?

Subresources:

rating summary breakdown (optional)

Pagination: page/size

Empty/error: empty “No reviews yet” + retry

12) NotFoundScreen (*)

Initial queries: none

Fields needed: route path + suggestion links

Pagination: none

Empty/error: N/A

Auth (Guest → Logged-in)
1) LoginScreen (/login)

Initial queries: (none)

Fields needed (UI): email/username, password, rememberMe?

Subresources: (optional) GET /auth/me sau login để lấy role, studentId/teacherId

Pagination: none

Empty/error:

loading: disable submit + spinner

401: “Invalid credentials”

422: hiển thị lỗi từng field

500: toast “Server error” + retry

2) RegisterScreen (/register)

Initial queries: (none)

Fields needed (UI): fullName, email, password, confirmPassword, role? (student/teacher?)

Subresources: (optional) auto-login → POST /auth/login hoặc trả token ngay từ register

Pagination: none

Empty/error:

409: email existed

422: validation

success: redirect /login hoặc /

3) ForgotPasswordScreen (/forgot-password)

Initial queries: (none)

Fields needed (UI): email

Subresources: email sending status

Pagination: none

Empty/error:

200: show “Check your email”

404/422: email invalid/not found (tuỳ BE)

anti-spam: disable resend timer (client)

4) ResetPasswordScreen (/reset-password)

Initial queries: (optional) validate token: GET /auth/reset/validate?token=...

Fields needed (UI): token (from query), newPassword, confirmPassword

Subresources: none

Pagination: none

Empty/error:

400/401: invalid/expired token

422: password policy fail

success: redirect /login

Student (User)
1) MyLearningScreen (/my-learning)

Initial queries:

GET /students/me (để lấy studentId)

GET /students/{studentId}/enrollments?page=&size=&sort=updatedAt,desc

Fields needed (enrollment card):
enrollmentId, courseId, courseSlug, courseTitle, courseThumbnailUrl, status, enrolledAt, progressPercent?, lastLessonId?, lastAccessedAt?

Subresources: (optional) progress summary per course

Pagination: page/size (PageResponse)

Empty/error:

empty: “You haven’t enrolled in any courses”

401: redirect login

error: retry

2) LearningCourseHomeScreen (/learn/:courseSlug)

Initial queries:

GET /courses/:slug (basic course info)

curriculum tree: GET /courses/{courseId}/chapters (hoặc versioned curriculum nếu BE dùng version)

progress overview: GET /progress/courses/{courseId} (nếu có)

Fields needed:

course header: title, thumbnailUrl, teacherName

curriculum: chapters[{id,title, lessons[{id,title,duration,isPreview?}]}]

progress: completedLessonIds, progressPercent, resumeLessonId

Subresources: announcements count, qna count (optional)

Pagination: curriculum thường none; nếu lessons list lớn có thể page

Empty/error:

403: not enrolled → CTA enroll

curriculum empty: “No lessons yet”

error: retry

3) CoursePlayerScreen (/learn/:courseSlug/lecture/:lessonId)

Initial queries:

GET /lessons/:lessonId

GET /lessons/:lessonId/video/stream-url (nếu BE tách stream url)

GET /lessons/:lessonId/resources

GET /lessons/:lessonId/comments?page=&size=&sort=createdAt,desc

Fields needed:

player: lessonId, title, duration, streamUrl, contentHtml?

resources: id, name, type, url, size?

comments: id, authorName, authorAvatar?, content, createdAt

Subresources:

mark viewed/completed (interactive)

next/prev lesson (derive from curriculum cached from LearningCourseHomeScreen)

Pagination: comments page/size

Empty/error:

stream-url fail: show retry “Reload video”

403: not enrolled

empty comments: “No comments yet”

4) CourseAnnouncementsScreen (/learn/:courseSlug/announcements)

Initial queries:

GET /notifications?scope=course&courseSlug=:slug&page=&size=&sort=createdAt,desc (hoặc endpoint course announcements riêng nếu có)

Fields needed (announcement item):
id, title, body, createdAt, isRead, authorName?

Subresources: mark read

Pagination: page/size

Empty/error: empty “No announcements” + retry

5) CourseQAScreen (/learn/:courseSlug/qna)

Initial queries:

questions list: GET /courses/{courseId}/questions?page=&size=&sort=latest

Fields needed:
question item: id, title, contentSnippet, createdAt, authorName, repliesCount, isResolved?

Subresources:
question detail + answers (nếu tách screen thì thêm)

Pagination: page/size

Empty/error: empty “No questions yet” + retry

6) CourseResourcesScreen (/learn/:courseSlug/resources)

Initial queries:

GET /courses/{courseId}/resources (hoặc gom từ từng lesson resources)

Fields needed:
resource item: id, name, type, downloadUrl, lessonId?, createdAt?

Subresources: download action (mở url)

Pagination: none hoặc page nếu nhiều

Empty/error: empty “No resources” + retry

7) CourseQuizListScreen (/learn/:courseSlug/quizzes)

Initial queries:

GET /courses/{courseId}/quizzes?page=&size= (hoặc quiz-by-lesson nếu chỉ gắn lesson)

Fields needed:
quiz row: id, title, timeLimit, totalQuestions, attemptsAllowed?, status (open/closed)

Subresources: start attempt (interactive)

Pagination: page/size hoặc none

Empty/error: empty “No quizzes” + retry

8) QuizAttemptScreen (/learn/:courseSlug/quizzes/:quizId/attempt)

Initial queries / actions:

start: POST /quizzes/:quizId/start → trả attemptId

load quiz: GET /quizzes/:quizId

load questions: GET /quizzes/:quizId/questions (nếu có)

Fields needed:

attempt: attemptId, startedAt, timeRemaining

question: id, text, type, options[]

Subresources:

submit answer: POST /attempts/:attemptId/answer

finish: POST /attempts/:attemptId/finish

Pagination: none (quiz flow)

Empty/error:

prevent double submit

network retry per question

time out state

9) QuizResultScreen (/learn/:courseSlug/quizzes/:quizId/attempts/:attemptId/result)

Initial queries:

GET /attempts/:attemptId (result detail)

GET /quizzes/:quizId (meta)

Fields needed:
score, maxScore, correctCount, totalQuestions, answersReview[] (question, userAnswer, correctAnswer, explanation?)

Subresources: retry quiz (if allowed)

Pagination: none

Empty/error: if attempt not found → 404

10) WriteReviewScreen (/courses/:slug/reviews/new)

Initial queries:

GET /courses/:slug (course title)

(optional) GET /courses/{courseId}/my-review (nếu BE có; không thì skip)

Fields needed:
rating (1..5), content

Subresources: none

Pagination: none

Empty/error:

403: must enroll

409: already reviewed

422: validation

11) WishlistScreen (/wishlist)

Initial queries:

GET /me/wishlist?page=&size= (nếu BE có wishlist; nếu BE chưa có thì screen này “planned”)

Fields needed: course card fields: id, slug, title, thumbnailUrl, instructorName, ratingAvg, ratingCount, price, discountPrice

Subresources: remove/add wishlist

Pagination: page/size

Empty/error: empty “No wishlist items” + retry

12) ProfileScreen (/me)

Initial queries:

GET /accounts/me (hoặc GET /accounts/profile)

Fields needed:
id, fullName, email, avatarUrl, bio?, role, createdAt

Subresources: none

Pagination: none

Empty/error: 401 redirect login

13) ProfileEditScreen (/me/edit)

Initial queries:

GET /accounts/me

Fields needed (form):
fullName, avatarUrl, bio?, phone?, socials?

Subresources: avatar upload (file upload flow)

Pagination: none

Empty/error:

422 validation

success toast + redirect /me

14) SettingsScreen (/settings)

Initial queries:

GET /accounts/me/settings (hoặc reuse profile nếu chung)

Fields needed:
language, emailNotifications, privacy?, theme? (tuỳ BE)

Subresources: update settings

Pagination: none

Empty/error: retry

15) NotificationsScreen (/notifications)

Initial queries:

GET /notifications?page=&size=&sort=createdAt,desc

Fields needed:
id, title, body, type, createdAt, isRead, linkTo?

Subresources: mark read, mark all read

Pagination: page/size

Empty/error: empty “No notifications” + retry

Reviews & Comments (Student actions)
1) WriteCourseReviewScreen (/courses/:courseId/reviews/new)

Initial queries:

GET /courses/:courseId (để hiển thị title/thumbnail)

(optional) REVIEW_GET_RATING_SUMMARY → GET /courses/:courseId/rating-summary (hiển thị summary để user tham khảo)

Fields needed (UI):

course header: courseId, title, thumbnailUrl

form: rating (1..5), content

Subresources: none

Pagination: none

Empty/error:

403: chưa enroll → CTA enroll

409: đã review rồi → redirect/edit

422: validation errors (inline)

2) EditCourseReviewScreen (/courses/:courseId/reviews/:reviewId/edit)

Initial queries:

GET /courses/:courseId (header)

(recommended) GET /courses/:courseId/reviews?page=&size= rồi locate reviewId

(optional) REVIEW_GET_RATING_SUMMARY

Fields needed (UI):

review current: reviewId, rating, content, updatedAt

form fields: rating, content

Subresources: delete review

Pagination: nếu lấy từ list: page/size

Empty/error:

404 review not found

403 no permission (không phải review của mình)

3) CourseRatingSummaryScreen (/courses/:courseId/rating-summary) (public)

Initial queries:

REVIEW_GET_RATING_SUMMARY → GET /courses/:courseId/rating-summary

Fields needed (UI):
courseId, ratingAvg, ratingCount, breakdown{5..1}, recentTrends?

Subresources: link sang review list screen

Pagination: none

Empty/error:

404 course not found

error: show fallback + retry

4) CreateCourseCommentScreen (/courses/:courseId/comments/new)

Initial queries:

GET /courses/:courseId (header)

(optional) COMMENT_GET_COURSE_LIST để show context (latest few)

Fields needed (UI):

header: courseTitle

form: content (text), parentId? (nếu reply)

Subresources: mention/user tagging (optional)

Pagination: comments context: page/size

Empty/error:

403: không enrolled (nếu BE chặn)

422: validation

5) CreateLessonCommentScreen (/lessons/:lessonId/comments/new)

Initial queries:

LESSON_GET_BY_ID → GET /lessons/:lessonId (header)

(optional) COMMENT_GET_LESSON_LIST (context)

Fields needed (UI):

lesson header: lessonTitle

form: content, parentId?

Subresources: none

Pagination: comments context: page/size

Empty/error:

403 not enrolled

422 validation

6) EditCommentScreen (/comments/:id/edit)

Initial queries:

(recommended) GET /comments/:id (nếu BE có; nếu không có endpoint thì lấy từ list screen rồi navigate)

Fields needed (UI):
commentId, content, updatedAt (+ context: belongsToCourse/lesson)

Subresources: delete comment

Pagination: none

Empty/error:

404 not found

403 not owner

Assessment (Quiz / Assignment) — Student view/do
1) LessonQuizzesScreen (/lessons/:lessonId/quizzes)

Initial queries:

QUIZ_GET_BY_LESSON → GET /lessons/:lessonId/quizzes

Fields needed (UI):
quiz row: id, title, totalQuestions, timeLimit, attemptsAllowed?, status(open/closed), dueAt?

Subresources: start quiz attempt

Pagination: usually none (per lesson), nếu nhiều: page/size

Empty/error: empty “No quizzes” + retry

2) QuizDetailScreen (/quizzes/:id)

Initial queries:

QUIZ_GET_BY_ID → GET /quizzes/:id

Fields needed (UI):
quiz meta: id, title, description?, timeLimit, totalQuestions, passingScore?, attemptsAllowed, instructions?

Subresources: start attempt button

Pagination: none

Empty/error: 404 quiz not found; 403 not enrolled

3) QuizAttemptScreen (/quizzes/:id/attempt)

Initial queries / actions:

QUIZ_START_ACTION → POST /quizzes/:id/start → returns attemptId (+ first question maybe)

load questions (depends on BE design):

either embedded in start response, or

fetched via QUIZ_GET_BY_ID if it includes questions

Fields needed (UI):

attempt: attemptId, startedAt, timeRemaining

question: questionId, text, type, options[]

Subresources: submit answer + finish

Pagination: none

Empty/error:

prevent double-start

network retry for submit

4) QuizAttemptPlayScreen (/quizzes/:quizId/attempts/:attemptId)

Initial queries:

GET /attempts/:attemptId (nếu BE có; nếu không có thì state lấy từ start response)

QUIZ_GET_BY_ID (meta)

Actions:

QUIZ_SUBMIT_ANSWER_ACTION → POST /attempts/:attemptId/answer

QUIZ_FINISH_ACTION → POST /attempts/:attemptId/finish

Fields needed (UI):
current question, selected option, timer, progress currentIndex/total

Pagination: none

Empty/error: reconnect/resume, time out

5) LessonAssignmentsScreen (/lessons/:lessonId/assignments)

Initial queries:

ASSIGNMENT_GET_BY_LESSON → GET /lessons/:lessonId/assignments

Fields needed (UI):
assignment row: id, title, dueAt, maxScore, status(submitted/not), createdAt

Subresources: open assignment detail

Pagination: none (per lesson), nếu nhiều thì page

Empty/error: empty “No assignments” + retry

6) AssignmentDetailScreen (/assignments/:id)

Initial queries:

ASSIGNMENT_GET_BY_ID → GET /assignments/:id

Fields needed (UI):
id, title, description, dueAt, maxScore, allowedFileTypes?, instructions, attachments?

Subresources: create submission

Pagination: none

Empty/error: 404 assignment not found; 403 not enrolled

7) SubmitAssignmentScreen (/assignments/:assignmentId/submit)

Initial queries:

ASSIGNMENT_GET_BY_ID (để hiển thị đề bài + deadline)

Actions:

SUBMISSION_CREATE → POST /assignments/:assignmentId/submissions

(optional file) FILE_UPLOAD → POST /files/upload trước, rồi gửi fileId/fileUrl vào submission

Fields needed (UI):
form: textAnswer?, file?, note?

Subresources: upload progress bar

Pagination: none

Empty/error:

413 file too large

422 invalid file/type

409 already submitted (tuỳ rule)

8) SubmissionDetailScreen (/submissions/:id)

Initial queries:

SUBMISSION_GET_BY_ID → GET /submissions/:id

Fields needed (UI):
id, assignmentId, studentId, submittedAt, content/textAnswer?, fileUrl?, status, score?, feedback?, gradedAt?

Subresources: download file, view feedback

Pagination: none

Empty/error: 404 submission not found; 403 not owner

Teacher/Instructor (Create/Manage content)
1) TeacherMeScreen (/teachers/me)

Initial queries: TEACHER_GET_ME → GET /teachers/me

Fields needed (UI): id, name, email?, avatarUrl, bio?, headline?, createdAt

Subresources: quick links (courses/stats/revenue)

Pagination: none

Empty/error: 401/403 redirect; error → retry

2) TeacherStatsScreen (/teachers/:id/stats)

Initial queries: TEACHER_GET_STATS → GET /teachers/:id/stats

Fields needed (UI): totalCourses, totalStudents, avgRating, totalReviews, completionRate?, activeEnrollments?

Subresources: time range filter (7d/30d/all)

Pagination: none

Empty/error: show “No data yet” + retry

3) TeacherRevenueScreen (/teachers/:id/revenue)

Initial queries: TEACHER_GET_REVENUE → GET /teachers/:id/revenue?range=

Fields needed (UI): totalRevenue, revenueByCourse[], revenueByMonth[], currency

Subresources: export CSV (optional)

Pagination: none

Empty/error: empty charts + retry

4) TeacherCourseListScreen (/teacher/courses)

Initial queries: COURSE_GET_TEACHER_LIST → GET /teacher/courses?page=&size=&sort=updatedAt,desc

Fields needed (UI):
course row: id, title, thumbnailUrl, status(draft/open/closed), updatedAt, studentsCount?, ratingAvg?

Subresources: actions per row: edit/open/close/delete

Pagination: page/size (PageResponse)

Empty/error: empty “No courses yet” + CTA create

5) TeacherCourseCreateScreen (/teacher/courses/new)

Initial queries: CATEGORY_GET_TREE (chọn category), TAG_GET_LIST (select tags)

Fields needed (UI): form: title, description, categoryId, tagIds[], level?, language?, price?

Subresources: thumbnail upload (nếu có FILE_UPLOAD)

Pagination: tags/categories: none hoặc page

Empty/error: 422 validation inline; success redirect edit

6) TeacherCourseEditScreen (/teacher/courses/:id/edit)

Initial queries:

COURSE_GET_DETAIL → GET /courses/:id

CATEGORY_GET_TREE, TAG_GET_LIST

Fields needed (UI): editable fields: title, description, categoryId, tagIds, thumbnailUrl, status

Subresources: versions list link, curriculum link

Pagination: none

Empty/error: 404 course not found; 403 not owner

7) TeacherCourseOpenCloseScreen (/teacher/courses/:id/status)

Initial queries: COURSE_GET_DETAIL

Actions: COURSE_OPEN_ACTION / COURSE_CLOSE_ACTION

Fields needed (UI): current status, confirmation modal text

Pagination: none

Empty/error: 409 invalid transition; show message

8) CourseEnrollmentsScreen (/courses/:courseId/enrollments)

Initial queries: ENROLLMENT_GET_COURSE_LIST → GET /courses/:courseId/enrollments?page=&size=&sort=createdAt,desc

Fields needed (UI): enrollment row: enrollmentId, studentId, studentName, enrolledAt, status, progressPercent?

Subresources: search student (optional), export (optional)

Pagination: page/size

Empty/error: empty “No students enrolled” + retry

Versioning / Publishing Flow (Udemy publish-like)
9) CourseVersionsScreen (/courses/:courseId/versions)

Initial queries: VERSION_GET_LIST → GET /courses/:courseId/versions?page=&size=&sort=createdAt,desc

Fields needed (UI): version row: versionId, status(draft/submitted/approved/rejected/published), createdAt, updatedAt, notes?

Subresources: create version, submit approval, publish

Pagination: page/size

Empty/error: empty “No versions yet” + CTA create

10) VersionDetailScreen (/courses/:courseId/versions/:versionId)

Initial queries: VERSION_GET_DETAIL → GET /courses/:courseId/versions/:versionId

Fields needed (UI): versionId, status, changelog?, createdAt, updatedAt, reviewerNote?

Subresources: chapters/lessons manage link

Pagination: none

Empty/error: 404 version not found; 403 not owner

11) CreateVersionScreen (/courses/:courseId/versions/new)

Initial queries: COURSE_GET_DETAIL (header)

Actions: VERSION_CREATE → POST /courses/:courseId/versions

Fields needed (UI): notes/changelog?, baseFromPublished?

Pagination: none

Empty/error: 409 cannot create version (if pending); show message

12) SubmitVersionApprovalScreen (/courses/:courseId/versions/:versionId/submit-approval)

Initial queries: VERSION_GET_DETAIL

Actions: VERSION_SUBMIT_FOR_APPROVAL_ACTION

Fields needed (UI): status + confirm, optional message to admin

Pagination: none

Empty/error: 409 invalid transition; show message

13) PublishVersionScreen (/courses/:courseId/versions/:versionId/publish)

Initial queries: VERSION_GET_DETAIL

Actions: VERSION_PUBLISH_ACTION

Fields needed (UI): publish checklist summary, confirm

Pagination: none

Empty/error: 409 invalid transition; 403 not approved yet

Curriculum Authoring
14) ChapterManageScreen (/courses/:courseId/versions/:versionId/chapters)

Initial queries:

CHAPTER_GET_BY_VERSION → GET /versions/:versionId/chapters (hoặc by course+version)

(optional) VERSION_GET_DETAIL

Fields needed (UI): chapter list: chapterId, title, orderIndex, lessonsCount

Subresources: create/update/delete/reorder chapters

Pagination: usually none

Empty/error: empty “No chapters yet” + CTA add

15) LessonManageScreen (/chapters/:chapterId/lessons)

Initial queries: LESSON_GET_BY_CHAPTER → GET /chapters/:chapterId/lessons

Fields needed (UI): lesson row: lessonId, title, orderIndex, duration?, hasVideo?, isFreePreview?

Subresources: create/update/delete/reorder lessons; open video upload; open resources manage; open quiz/assignment manage

Pagination: usually none

Empty/error: empty “No lessons yet” + CTA add

Video Upload Flow (creator)
16) LessonVideoUploadFlowScreen (/lessons/:lessonId/video)

Initial queries:

LESSON_GET_BY_ID

LESSON_GET_VIDEO_UPLOAD_URL → GET /lessons/:lessonId/video/upload-url

Actions:

upload to storage (PUT to signedUrl)

LESSON_VIDEO_UPLOAD_COMPLETE_ACTION → POST /lessons/:lessonId/video/upload-complete

Fields needed (UI): lessonTitle, upload signedUrl, expiresAt?, uploadProgress, processingStatus?

Subresources: retry/resume upload

Pagination: none

Empty/error: signedUrl expired; upload fail; complete action fail → show retry

Lesson Resources (creator)
17) LessonResourcesManageScreen (/lessons/:lessonId/resources)

Initial queries: RESOURCE_GET_BY_LESSON → GET /lessons/:lessonId/resources

Actions: RESOURCE_CREATE/UPDATE/DELETE

Fields needed (UI): resource item: id, name, type, url/fileId, createdAt

Subresources: FILE_UPLOAD for attachments

Pagination: none (thường)

Empty/error: empty “No resources” + CTA add

Quiz Manage (creator)
18) QuizManageScreen (/lessons/:lessonId/quizzes/manage)

Initial queries: QUIZ_GET_BY_LESSON

Actions: QUIZ_CREATE/UPDATE/DELETE

Fields needed (UI): quiz: id, title, timeLimit, totalQuestions, status

Subresources: question editor (nếu có QUESTION endpoints)

Pagination: none

Empty/error: empty → CTA create quiz

Assignment Manage (creator)
19) AssignmentManageScreen (/lessons/:lessonId/assignments/manage)

Initial queries: ASSIGNMENT_GET_BY_LESSON

Actions: ASSIGNMENT_CREATE/UPDATE/DELETE

Fields needed (UI): assignment: id, title, dueAt, maxScore, instructions

Subresources: view submissions list (nếu có endpoint list)

Pagination: none

Empty/error: empty → CTA create assignment

Submission grading (creator)
20) GradeSubmissionScreen (/submissions/:id/grade)

Initial queries: SUBMISSION_GET_BY_ID

Actions: SUBMISSION_GRADE_ACTION → POST /submissions/:id/grade

Fields needed (UI): submissionId, studentName, content/text/fileUrl, currentScore?, maxScore, gradeInput

Subresources: feedback action screen

Pagination: none

Empty/error: 409 already graded? (tuỳ rule)

21) FeedbackSubmissionScreen (/submissions/:id/feedback)

Initial queries: SUBMISSION_GET_BY_ID

Actions: SUBMISSION_FEEDBACK_ACTION → POST /submissions/:id/feedback

Fields needed (UI): feedbackText, attachments?

Subresources: file upload (optional)

Pagination: none

Empty/error: 422 validation; success toast

File (creator)
22) FileStorageScreen (/files/:id)

Initial queries: FILE_GET_BY_ID → GET /files/:id

Fields needed (UI): id, fileName, fileType, size, url, uploadedAt, ownerId

Subresources: delete file FILE_DELETE (nếu có)

Pagination: none

Empty/error: 404 file not found; retry

Admin
1) AdminDashboardScreen (/admin)

Initial queries:

ADMIN_GET_DASHBOARD (nếu có) → GET /admin/dashboard

hoặc ghép từ: ADMIN_GET_STATISTICS + ADMIN_GET_REVENUE_REPORT + counts (users/courses/reports)

Fields needed (UI):
cards: totalUsers, totalCourses, totalEnrollments, totalReportsOpen, revenueMTD, activeUsers
charts: revenueByMonth[], newUsersByMonth[]

Subresources: quick links to users/audit/reports

Pagination: none

Empty/error: empty charts + retry

2) AdminUsersScreen (/admin/users)

Initial queries: ADMIN_GET_USERS_LIST → GET /admin/users?page=&size=&sort=createdAt,desc&q=

Fields needed (UI):
user row: id, fullName, email, role, status(active/blocked), createdAt, lastLoginAt?

Subresources:

filter: role/status

actions: block/unblock/update role (nếu có ADMIN action endpoints)

Pagination: page/size (PageResponse)

Empty/error: empty “No users” + retry

3) AdminUserStatsScreen (/admin/users/stats)

Initial queries: ADMIN_GET_USER_STATS → GET /admin/users/stats?range=

Fields needed (UI):
totalUsers, newUsers, activeUsers, retention?, usersByRole[], usersByDay[]

Subresources: range selector (7d/30d/90d)

Pagination: none

Empty/error: retry

4) AdminExportUsersScreen (/admin/users/export)

Initial queries: none

Actions: ADMIN_EXPORT_USERS_ACTION → POST /admin/users/export (hoặc GET download)

Fields needed (UI):
export form: format(csv/xlsx), filters role/status/dateRange

Subresources: download file + progress

Pagination: none

Empty/error: export fail toast + retry

5) AdminAuditLogsScreen (/admin/audit-logs)

Initial queries: ADMIN_GET_AUDIT_LOGS_LIST → GET /admin/audit-logs?page=&size=&sort=createdAt,desc

Fields needed (UI):
log row: id, actorId, actorEmail?, action, entityType, entityId, createdAt, ip?, userAgent?

Subresources: open log detail (nếu có)

Pagination: page/size

Empty/error: empty “No logs” + retry

6) AdminAuditLogsSearchScreen (/admin/audit-logs/search)

Initial queries: (none on mount, or prefill from query params)

ADMIN_SEARCH_AUDIT_LOGS → GET /admin/audit-logs/search?actor=&action=&entity=&from=&to=&page=&size=

Fields needed (UI):
filters: actorEmail/id, action, entityType, dateRange
results: same fields as audit log row

Subresources: export from search (optional)

Pagination: page/size

Empty/error: empty “No matching logs” + retry

7) AdminAuditLogsExportScreen (/admin/audit-logs/export)

Initial queries: none

Actions: ADMIN_EXPORT_AUDIT_LOGS_ACTION → POST /admin/audit-logs/export (with filters)

Fields needed (UI): filter form + format, dateRange, actor, action

Subresources: download

Pagination: none

Empty/error: export fail + retry

8) AdminSystemSettingsScreen (/admin/settings)

Initial queries: ADMIN_GET_SYSTEM_SETTINGS → GET /admin/settings

Fields needed (UI):
settings list: [ {key, value, type, description?, updatedAt} ]

Subresources: update setting (nếu có endpoint update)

Pagination: none

Empty/error: retry

9) AdminCategoriesScreen (/admin/categories)

Initial queries:

CATEGORY_GET_TREE → GET /categories/tree (quản trị thường dùng tree)

Fields needed (UI):
category node: id, name, slug, parentId?, children[]

Subresources: CRUD: CATEGORY_CREATE/UPDATE/DELETE

Pagination: none

Empty/error: empty “No categories” + CTA create

10) AdminTagsScreen (/admin/tags)

Initial queries: TAG_GET_LIST → GET /tags?page=&size=&q=

Fields needed (UI):
tag row: id, name, slug, coursesCount?, createdAt

Subresources: CRUD: TAG_CREATE/UPDATE/DELETE

Pagination: page/size (nếu BE trả page)

Empty/error: empty “No tags” + CTA create

11) AdminReportsAllScreen (/admin/reports)

Initial queries: REPORT_GET_ALL_LIST → GET /admin/reports?page=&size=&status=&type=&sort=createdAt,desc

Fields needed (UI):
report row: id, reporterId, type, contentSnippet, status(open/in_progress/closed), createdAt

Subresources: open report detail (nếu có), change status (nếu có endpoint)

Pagination: page/size

Empty/error: empty “No reports” + retry

12) AdminCourseVersionApprovalScreen (/admin/courses/:courseId/versions/:versionId/review)

Initial queries:

VERSION_GET_DETAIL → GET /courses/:courseId/versions/:versionId (để admin xem nội dung)

(optional) curriculum snapshot: CHAPTER_GET_BY_VERSION + lessons list

Actions:

VERSION_APPROVE_ACTION → POST /admin/courses/:courseId/versions/:versionId/approve

VERSION_REJECT_ACTION → POST /admin/courses/:courseId/versions/:versionId/reject

Fields needed (UI):
version header: versionId, status, submittedAt, teacherName
review input: adminNote/reason

Pagination: none

Empty/error: 409 invalid transition; error toast + retry

13) AdminRevenueReportScreen (/admin/reports/revenue)

Initial queries: ADMIN_GET_REVENUE_REPORT → GET /admin/reports/revenue?range=&groupBy=month

Fields needed (UI):
totalRevenue, revenueByMonth[], topCoursesByRevenue[], currency

Subresources: export (optional)

Pagination: none

Empty/error: empty charts + retry

14) AdminStatisticsScreen (/admin/statistics)

Initial queries: ADMIN_GET_STATISTICS → GET /admin/statistics?range=

Fields needed (UI):
usersCount, coursesCount, enrollmentsCount, activeTeachersCount, activeStudentsCount, completionRate?

Subresources: range selector

Pagination: none

Empty/error: retry