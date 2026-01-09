Chỉ liệt kê element có hành vi + có API call (form/button/toggle/search/pagination/scroll/upload/retry).
Cột chuẩn: testId | actionKey | contractKey | Trigger | Endpoint | Notes

Public (Guest/SEO)
HomeScreen (/)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
lst_home_trending_scroll	course.list.loadMore	COURSE_GET_LIST	onScrollEnd / Load more	GET /courses?sort=trending&limit=...&cursor=?	nếu cursor-based
btn_home_retry_courses	course.list.retry	COURSE_GET_LIST	onClick	GET /courses?sort=trending&limit=...	retry khi lỗi
btn_home_retry_categories	category.list.retry	CATEGORY_GET_TREE (hoặc CATEGORY_GET_LIST)	onClick	GET /categories(/tree)	retry khi lỗi
CourseListScreen (/courses)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
txt_course_search	course.list.search	COURSE_GET_LIST	onChange (debounce)	GET /courses?q=...&page=&size=	chỉ dùng nếu BE hỗ trợ q
sel_course_sort	course.list.sort	COURSE_GET_LIST	onChange	GET /courses?sort=...&page=&size=	
sel_course_category	course.list.filterCategory	COURSE_GET_LIST	onChange	GET /courses?category=...&page=&size=	
btn_course_pagination_next	course.list.paginate	COURSE_GET_LIST	onClick	GET /courses?page=...&size=...	nếu page/size
btn_course_retry	course.list.retry	COURSE_GET_LIST	onClick	GET /courses?...	
CourseDetailScreen (/courses/:slug)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_course_retry_detail	course.detail.retry	COURSE_GET_DETAIL	onClick	GET /courses/:slug	
btn_course_retry_rating_summary	review.ratingSummary.retry	REVIEW_GET_RATING_SUMMARY	onClick	GET /courses/:courseId/rating-summary	nếu có summary
btn_course_open_reviews	review.list.open	REVIEW_GET_COURSE_LIST	onClick	GET /courses/:courseId/reviews?page=&size=	navigate + fetch
btn_course_open_comments	comment.course.list.open	COMMENT_GET_COURSE_LIST	onClick	GET /courses/:courseId/comments?page=&size=	navigate + fetch
btn_course_enroll	enrollment.create	ENROLLMENT_CREATE	onClick (confirm)	POST /courses/:courseId/enroll	nếu screen có CTA enroll
CategoryTreeScreen (/categories)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_categories_retry	category.tree.retry	CATEGORY_GET_TREE	onClick	GET /categories/tree	
btn_category_open_detail	category.openDetail	CATEGORY_GET_BY_SLUG	onClick	GET /categories/:slug	điều hướng sang CategoryDetail
CategoryDetailScreen (/categories/:slug)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_category_retry_detail	category.detail.retry	CATEGORY_GET_BY_SLUG	onClick	GET /categories/:slug	
btn_category_courses_paginate	course.list.paginate	COURSE_GET_LIST	onClick	GET /courses?category=:slug&page=&size=	
sel_category_sort	course.list.sort	COURSE_GET_LIST	onChange	GET /courses?category=:slug&sort=...	
TagListScreen (/tags)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
txt_tag_search	tag.list.search	TAG_GET_LIST	onChange (debounce)	GET /tags?q=...&page=&size=	nếu BE hỗ trợ
btn_tag_paginate	tag.list.paginate	TAG_GET_LIST	onClick	GET /tags?page=&size=	
btn_tag_retry	tag.list.retry	TAG_GET_LIST	onClick	GET /tags?...	
TeacherPublicProfileScreen (/teachers/:id)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_teacher_retry_profile	teacher.detail.retry	TEACHER_GET_BY_ID	onClick	GET /teachers/:id	
btn_teacher_courses_paginate	course.list.paginate	COURSE_GET_LIST	onClick	GET /courses?teacherId=:id&page=&size=	
sel_teacher_courses_sort	course.list.sort	COURSE_GET_LIST	onChange	GET /courses?teacherId=:id&sort=...	
LessonDetailPublicScreen (/lessons/:id)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_lesson_retry_detail	lesson.detail.retry	LESSON_GET_BY_ID	onClick	GET /lessons/:id	
btn_lesson_open_comments	comment.lesson.list.open	COMMENT_GET_LESSON_LIST	onClick	GET /lessons/:lessonId/comments?page=&size=	navigate + fetch
LessonCommentsPublicScreen (/lessons/:lessonId/comments)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_lesson_comments_paginate	comment.lesson.paginate	COMMENT_GET_LESSON_LIST	onClick	GET /lessons/:lessonId/comments?page=&size=	
sel_lesson_comments_sort	comment.lesson.sort	COMMENT_GET_LESSON_LIST	onChange	GET /lessons/:lessonId/comments?sort=...	
btn_lesson_comments_retry	comment.lesson.retry	COMMENT_GET_LESSON_LIST	onClick	GET /lessons/:lessonId/comments?...	
CourseCommentsPublicScreen (/courses/:courseId/comments)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_course_comments_paginate	comment.course.paginate	COMMENT_GET_COURSE_LIST	onClick	GET /courses/:courseId/comments?page=&size=	
btn_course_comments_retry	comment.course.retry	COMMENT_GET_COURSE_LIST	onClick	GET /courses/:courseId/comments?...	
CourseReviewsPublicScreen (/courses/:courseId/reviews)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_reviews_paginate	review.list.paginate	REVIEW_GET_COURSE_LIST	onClick	GET /courses/:courseId/reviews?page=&size=	
sel_reviews_sort	review.list.sort	REVIEW_GET_COURSE_LIST	onChange	GET /courses/:courseId/reviews?sort=...	
btn_rating_summary_reload	review.ratingSummary.reload	REVIEW_GET_RATING_SUMMARY	onClick	GET /courses/:courseId/rating-summary	optional
btn_reviews_retry	review.list.retry	REVIEW_GET_COURSE_LIST	onClick	GET /courses/:courseId/reviews?...	
NotFoundScreen (*)

Không có API call.

Auth (Guest → Logged-in)
LoginScreen (/login)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
frm_login_submit	auth.login	AUTH_LOGIN	onSubmit	POST /auth/login	
btn_login_retry	auth.login.retry	AUTH_LOGIN	onClick	POST /auth/login	khi lỗi mạng
sys_after_login_fetch_me	auth.me	AUTH_ME	afterSuccess(login)	GET /auth/me	thường chạy tự động
RegisterScreen (/register)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
frm_register_submit	auth.register	AUTH_REGISTER	onSubmit	POST /auth/register	
btn_register_retry	auth.register.retry	AUTH_REGISTER	onClick	POST /auth/register	
ForgotPasswordScreen (/forgot-password)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
frm_forgot_submit	auth.forgotPassword	AUTH_FORGOT_PASSWORD	onSubmit	POST /auth/forgot-password	nếu BE có
btn_forgot_resend	auth.forgotPassword.resend	AUTH_FORGOT_PASSWORD	onClick	POST /auth/forgot-password	cooldown client
ResetPasswordScreen (/reset-password)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
sys_reset_validate_token	auth.reset.validate	AUTH_RESET_VALIDATE	onScreenOpen	GET /auth/reset/validate?token=...	nếu BE có
frm_reset_submit	auth.resetPassword	AUTH_RESET_PASSWORD	onSubmit	POST /auth/reset-password	nếu BE có
Student (User)
MyLearningScreen (/my-learning)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
sys_fetch_student_me	student.me	STUDENT_GET_ME	onScreenOpen	GET /students/me	
btn_my_learning_paginate	enrollment.list.paginate	ENROLLMENT_GET_STUDENT_LIST	onClick	GET /students/{studentId}/enrollments?page=&size=	
btn_enrollment_cancel	enrollment.cancel	ENROLLMENT_CANCEL_ACTION	onClick (confirm)	POST /enrollments/:id/cancel	
btn_enrollment_open	enrollment.open	ENROLLMENT_GET_DETAIL	onClick	GET /enrollments/:id	optional
LearningCourseHomeScreen (/learn/:courseSlug)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_learn_retry_course	course.detail.retry	COURSE_GET_DETAIL	onClick	GET /courses/:slug	
btn_learn_retry_curriculum	chapter.list.retry	CHAPTER_GET_BY_COURSE (hoặc CHAPTER_GET_BY_VERSION)	onClick	GET /courses/:courseId/chapters	tùy BE
btn_learn_open_lesson	lesson.open	LESSON_GET_BY_ID	onClick	GET /lessons/:lessonId	navigate + fetch
btn_learn_enroll	enrollment.create	ENROLLMENT_CREATE	onClick (confirm)	POST /courses/:courseId/enroll	khi 403 not enrolled
CoursePlayerScreen (/learn/:courseSlug/lecture/:lessonId)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_player_reload_lesson	lesson.detail.reload	LESSON_GET_BY_ID	onClick	GET /lessons/:lessonId	
btn_player_reload_stream	lesson.streamUrl.reload	LESSON_GET_VIDEO_STREAM_URL	onClick	GET /lessons/:lessonId/video/stream-url	
btn_mark_viewed	progress.markViewed	PROGRESS_MARK_VIEWED_ACTION	onVideoStart / afterNSeconds	POST /lessons/:lessonId/mark-viewed	
btn_mark_completed	progress.markCompleted	PROGRESS_MARK_COMPLETED_ACTION	onVideoEnded / onClick	POST /lessons/:lessonId/mark-completed	
lst_comments_paginate	comment.lesson.paginate	COMMENT_GET_LESSON_LIST	onScrollEnd / onPage	GET /lessons/:lessonId/comments?page=&size=	
frm_comment_submit	comment.lesson.create	COMMENT_CREATE_LESSON	onSubmit	POST /lessons/:lessonId/comments	
CourseAnnouncementsScreen (/learn/:courseSlug/announcements)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_announcements_paginate	notification.list.paginate	NOTIFICATION_GET_LIST	onClick	GET /notifications?scope=course&courseSlug=...&page=&size=	
btn_announcement_mark_read	notification.markRead	NOTIFICATION_MARK_READ_ACTION	onClick	POST /notifications/:id/read	
btn_announcements_mark_all_read	notification.markAllRead	NOTIFICATION_MARK_ALL_READ_ACTION	onClick	POST /notifications/read-all	
CourseQAScreen (/learn/:courseSlug/qna)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
txt_qna_search	question.list.search	QUESTION_GET_LIST (hoặc QUESTION_GET_BY_COURSE)	onChange (debounce)	GET /courses/:courseId/questions?q=...&page=&size=	nếu BE hỗ trợ
btn_qna_paginate	question.list.paginate	QUESTION_GET_LIST	onClick	GET /courses/:courseId/questions?page=&size=	
frm_qna_create	question.create	QUESTION_CREATE	onSubmit	POST /courses/:courseId/questions	nếu BE có
CourseResourcesScreen (/learn/:courseSlug/resources)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_resources_retry	resource.list.retry	RESOURCE_GET_BY_COURSE (hoặc RESOURCE_GET_BY_LESSON)	onClick	GET /courses/:courseId/resources	tùy BE
btn_resource_download	file.download	FILE_GET_BY_ID (hoặc direct url)	onClick	GET /files/:id	nếu cần resolve url
CourseQuizListScreen (/learn/:courseSlug/quizzes)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_quizlist_paginate	quiz.list.paginate	QUIZ_GET_LIST (hoặc QUIZ_GET_BY_COURSE)	onClick	GET /courses/:courseId/quizzes?page=&size=	tùy BE
btn_quiz_start	quiz.start	QUIZ_START_ACTION	onClick	POST /quizzes/:quizId/start	
QuizAttemptScreen (/learn/:courseSlug/quizzes/:quizId/attempt)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_attempt_start	quiz.start	QUIZ_START_ACTION	onScreenOpen / onClick	POST /quizzes/:quizId/start	
btn_attempt_submit_answer	quiz.submitAnswer	QUIZ_SUBMIT_ANSWER_ACTION	onClick	POST /attempts/:attemptId/answer	per question
btn_attempt_finish	quiz.finish	QUIZ_FINISH_ACTION	onClick (confirm)	POST /attempts/:attemptId/finish	
QuizResultScreen (/learn/:courseSlug/quizzes/:quizId/attempts/:attemptId/result)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_result_retry	attempt.detail.retry	ATTEMPT_GET_BY_ID	onClick	GET /attempts/:attemptId	nếu BE có
btn_result_retry_quiz	quiz.detail.retry	QUIZ_GET_BY_ID	onClick	GET /quizzes/:quizId	
WriteReviewScreen (/courses/:slug/reviews/new)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
frm_review_submit	review.create	REVIEW_CREATE	onSubmit	POST /courses/:courseId/reviews	
btn_review_cancel	nav.back	N/A	onClick	(no API)	
WishlistScreen (/wishlist)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_wishlist_paginate	wishlist.list.paginate	WISHLIST_GET_LIST	onClick	GET /me/wishlist?page=&size=	nếu BE có
btn_wishlist_remove	wishlist.remove	WISHLIST_REMOVE_ACTION	onClick	DELETE /me/wishlist/:courseId	nếu BE có
ProfileScreen (/me)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_profile_retry	account.me.retry	ACCOUNT_GET_PROFILE	onClick	GET /accounts/me	
btn_profile_edit_open	nav.toEdit	N/A	onClick	(no API)	
ProfileEditScreen (/me/edit)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
frm_profile_update	account.updateProfile	ACCOUNT_UPDATE_PROFILE	onSubmit	PUT /accounts/me	
btn_avatar_upload	account.uploadAvatar	ACCOUNT_UPLOAD_AVATAR	onFileSelect	POST /accounts/me/avatar (or /files/upload)	tùy BE
btn_profile_save_retry	account.updateProfile.retry	ACCOUNT_UPDATE_PROFILE	onClick	PUT /accounts/me	
SettingsScreen (/settings)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
tgl_email_notifications	account.settings.update	ACCOUNT_UPDATE_SETTINGS	onToggle	PUT /accounts/me/settings	nếu BE có
sel_language	account.settings.update	ACCOUNT_UPDATE_SETTINGS	onChange	PUT /accounts/me/settings	
NotificationsScreen (/notifications)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_notifications_paginate	notification.list.paginate	NOTIFICATION_GET_LIST	onClick	GET /notifications?page=&size=	
btn_notification_mark_read	notification.markRead	NOTIFICATION_MARK_READ_ACTION	onClick	POST /notifications/:id/read	
btn_notifications_mark_all_read	notification.markAllRead	NOTIFICATION_MARK_ALL_READ_ACTION	onClick	POST /notifications/read-all	
Reviews & Comments (Student actions)
WriteCourseReviewScreen (/courses/:courseId/reviews/new)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
frm_course_review_submit	review.create	REVIEW_CREATE	onSubmit	POST /courses/:courseId/reviews	
btn_course_review_retry	review.create.retry	REVIEW_CREATE	onClick	POST /courses/:courseId/reviews	
EditCourseReviewScreen (/courses/:courseId/reviews/:reviewId/edit)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
frm_course_review_update	review.update	REVIEW_UPDATE	onSubmit	PUT /reviews/:reviewId (or /courses/:courseId/reviews/:reviewId)	theo BE
btn_course_review_delete	review.delete	REVIEW_DELETE	onClick (confirm)	DELETE /reviews/:reviewId	
btn_course_review_retry	review.update.retry	REVIEW_UPDATE	onClick	PUT ...	
CourseRatingSummaryScreen (/courses/:courseId/rating-summary)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_rating_summary_retry	review.ratingSummary.retry	REVIEW_GET_RATING_SUMMARY	onClick	GET /courses/:courseId/rating-summary	
CreateCourseCommentScreen (/courses/:courseId/comments/new)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
frm_course_comment_submit	comment.course.create	COMMENT_CREATE_COURSE	onSubmit	POST /courses/:courseId/comments	
btn_course_comment_retry	comment.course.create.retry	COMMENT_CREATE_COURSE	onClick	POST /courses/:courseId/comments	
CreateLessonCommentScreen (/lessons/:lessonId/comments/new)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
frm_lesson_comment_submit	comment.lesson.create	COMMENT_CREATE_LESSON	onSubmit	POST /lessons/:lessonId/comments	
btn_lesson_comment_retry	comment.lesson.create.retry	COMMENT_CREATE_LESSON	onClick	POST /lessons/:lessonId/comments	
EditCommentScreen (/comments/:id/edit)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
frm_comment_update	comment.update	COMMENT_UPDATE	onSubmit	PUT /comments/:id	
btn_comment_delete	comment.delete	COMMENT_DELETE	onClick (confirm)	DELETE /comments/:id	
Assessment (Quiz / Assignment) — Student view/do
LessonQuizzesScreen (/lessons/:lessonId/quizzes)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_lesson_quizzes_retry	quiz.list.retry	QUIZ_GET_BY_LESSON	onClick	GET /lessons/:lessonId/quizzes	
btn_quiz_open_detail	quiz.openDetail	QUIZ_GET_BY_ID	onClick	GET /quizzes/:id	
btn_quiz_start	quiz.start	QUIZ_START_ACTION	onClick	POST /quizzes/:id/start	
QuizDetailScreen (/quizzes/:id)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_quiz_retry	quiz.detail.retry	QUIZ_GET_BY_ID	onClick	GET /quizzes/:id	
btn_quiz_start	quiz.start	QUIZ_START_ACTION	onClick	POST /quizzes/:id/start	
QuizAttemptScreen (/quizzes/:id/attempt)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_attempt_submit_answer	quiz.submitAnswer	QUIZ_SUBMIT_ANSWER_ACTION	onClick	POST /attempts/:attemptId/answer	
btn_attempt_finish	quiz.finish	QUIZ_FINISH_ACTION	onClick (confirm)	POST /attempts/:attemptId/finish	
QuizAttemptPlayScreen (/quizzes/:quizId/attempts/:attemptId)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_attempt_submit_answer	quiz.submitAnswer	QUIZ_SUBMIT_ANSWER_ACTION	onClick	POST /attempts/:attemptId/answer	
btn_attempt_finish	quiz.finish	QUIZ_FINISH_ACTION	onClick	POST /attempts/:attemptId/finish	
btn_attempt_resume_retry	attempt.resume.retry	ATTEMPT_GET_BY_ID	onClick	GET /attempts/:attemptId	nếu BE có
LessonAssignmentsScreen (/lessons/:lessonId/assignments)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_assignments_retry	assignment.list.retry	ASSIGNMENT_GET_BY_LESSON	onClick	GET /lessons/:lessonId/assignments	
btn_assignment_open	assignment.openDetail	ASSIGNMENT_GET_BY_ID	onClick	GET /assignments/:id	
AssignmentDetailScreen (/assignments/:id)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_assignment_retry	assignment.detail.retry	ASSIGNMENT_GET_BY_ID	onClick	GET /assignments/:id	
btn_assignment_submit_open	submission.openCreate	SUBMISSION_CREATE	onClick	POST /assignments/:assignmentId/submissions	dẫn tới form submit
SubmitAssignmentScreen (/assignments/:assignmentId/submit)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
inp_submission_file	file.upload	FILE_UPLOAD	onFileSelect	POST /files/upload	upload trước
frm_submission_submit	submission.create	SUBMISSION_CREATE	onSubmit	POST /assignments/:assignmentId/submissions	kèm fileId/url
btn_submission_retry	submission.create.retry	SUBMISSION_CREATE	onClick	POST /assignments/:assignmentId/submissions	
SubmissionDetailScreen (/submissions/:id)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_submission_retry	submission.detail.retry	SUBMISSION_GET_BY_ID	onClick	GET /submissions/:id	
btn_submission_download_file	file.download	FILE_GET_BY_ID (hoặc direct url)	onClick	GET /files/:fileId	nếu cần resolve
Teacher/Instructor (Create/Manage content)
TeacherMeScreen (/teachers/me)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_teacher_me_retry	teacher.me.retry	TEACHER_GET_ME	onClick	GET /teachers/me	
TeacherStatsScreen (/teachers/:id/stats)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
sel_stats_range	teacher.stats.filterRange	TEACHER_GET_STATS	onChange	GET /teachers/:id/stats?range=...	
btn_teacher_stats_retry	teacher.stats.retry	TEACHER_GET_STATS	onClick	GET /teachers/:id/stats?...	
TeacherRevenueScreen (/teachers/:id/revenue)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
sel_revenue_range	teacher.revenue.filterRange	TEACHER_GET_REVENUE	onChange	GET /teachers/:id/revenue?range=...	
btn_teacher_revenue_retry	teacher.revenue.retry	TEACHER_GET_REVENUE	onClick	GET /teachers/:id/revenue?...	
TeacherCourseListScreen (/teacher/courses)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_teacher_courses_paginate	course.teacher.list.paginate	COURSE_GET_TEACHER_LIST	onClick	GET /teacher/courses?page=&size=	
txt_teacher_courses_search	course.teacher.list.search	COURSE_GET_TEACHER_LIST	onChange (debounce)	GET /teacher/courses?q=...	nếu BE hỗ trợ
btn_course_open_edit	course.openEdit	COURSE_GET_DETAIL	onClick	GET /courses/:id	route edit
btn_course_open	course.open	COURSE_OPEN_ACTION	onClick (confirm)	POST /teacher/courses/:id/open	
btn_course_close	course.close	COURSE_CLOSE_ACTION	onClick (confirm)	POST /teacher/courses/:id/close	
btn_course_delete	course.delete	COURSE_DELETE	onClick (confirm)	DELETE /teacher/courses/:id	
TeacherCourseCreateScreen (/teacher/courses/new)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
inp_course_thumbnail	file.upload	FILE_UPLOAD	onFileSelect	POST /files/upload	nếu dùng upload
frm_course_create_submit	course.create	COURSE_CREATE	onSubmit	POST /teacher/courses	
btn_course_create_retry	course.create.retry	COURSE_CREATE	onClick	POST /teacher/courses	
TeacherCourseEditScreen (/teacher/courses/:id/edit)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
inp_course_thumbnail	file.upload	FILE_UPLOAD	onFileSelect	POST /files/upload	
frm_course_update_submit	course.update	COURSE_UPDATE	onSubmit	PUT /teacher/courses/:id	
btn_course_update_retry	course.update.retry	COURSE_UPDATE	onClick	PUT /teacher/courses/:id	
TeacherCourseOpenCloseScreen (/teacher/courses/:id/status)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_course_open	course.open	COURSE_OPEN_ACTION	onClick (confirm)	POST /teacher/courses/:id/open	
btn_course_close	course.close	COURSE_CLOSE_ACTION	onClick (confirm)	POST /teacher/courses/:id/close	
CourseEnrollmentsScreen (/courses/:courseId/enrollments)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_enrollments_paginate	enrollment.course.list.paginate	ENROLLMENT_GET_COURSE_LIST	onClick	GET /courses/:courseId/enrollments?page=&size=	
txt_enrollments_search	enrollment.course.list.search	ENROLLMENT_GET_COURSE_LIST	onChange (debounce)	GET /courses/:courseId/enrollments?q=...	nếu BE hỗ trợ
btn_enrollments_retry	enrollment.course.list.retry	ENROLLMENT_GET_COURSE_LIST	onClick	GET /courses/:courseId/enrollments?...	
CourseVersionsScreen (/courses/:courseId/versions)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_versions_paginate	version.list.paginate	VERSION_GET_LIST	onClick	GET /courses/:courseId/versions?page=&size=	
btn_version_create_open	version.openCreate	VERSION_CREATE	onClick	POST /courses/:courseId/versions	navigate + create
btn_versions_retry	version.list.retry	VERSION_GET_LIST	onClick	GET /courses/:courseId/versions?...	
VersionDetailScreen (/courses/:courseId/versions/:versionId)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_version_retry	version.detail.retry	VERSION_GET_DETAIL	onClick	GET /courses/:courseId/versions/:versionId	
btn_version_submit_approval	version.submitApproval	VERSION_SUBMIT_FOR_APPROVAL_ACTION	onClick (confirm)	POST /courses/:courseId/versions/:versionId/submit-approval	
btn_version_publish	version.publish	VERSION_PUBLISH_ACTION	onClick (confirm)	POST /courses/:courseId/versions/:versionId/publish	
CreateVersionScreen (/courses/:courseId/versions/new)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
frm_version_create_submit	version.create	VERSION_CREATE	onSubmit	POST /courses/:courseId/versions	
SubmitVersionApprovalScreen (/courses/:courseId/versions/:versionId/submit-approval)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_submit_approval_confirm	version.submitApproval	VERSION_SUBMIT_FOR_APPROVAL_ACTION	onClick	POST /courses/:courseId/versions/:versionId/submit-approval	
PublishVersionScreen (/courses/:courseId/versions/:versionId/publish)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_publish_confirm	version.publish	VERSION_PUBLISH_ACTION	onClick	POST /courses/:courseId/versions/:versionId/publish	
ChapterManageScreen (/courses/:courseId/versions/:versionId/chapters)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_chapter_add	chapter.create	CHAPTER_CREATE	onClick (submit modal)	POST /versions/:versionId/chapters	
btn_chapter_edit	chapter.update	CHAPTER_UPDATE	onSubmit	PUT /chapters/:chapterId	
btn_chapter_delete	chapter.delete	CHAPTER_DELETE	onClick (confirm)	DELETE /chapters/:chapterId	
dnd_chapter_reorder	chapter.reorder	CHAPTER_REORDER_ACTION	onDragEnd	POST /versions/:versionId/chapters/reorder	nếu BE có
btn_chapters_retry	chapter.list.retry	CHAPTER_GET_BY_VERSION	onClick	GET /versions/:versionId/chapters	
LessonManageScreen (/chapters/:chapterId/lessons)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_lesson_add	lesson.create	LESSON_CREATE	onClick (submit modal)	POST /chapters/:chapterId/lessons	
btn_lesson_edit	lesson.update	LESSON_UPDATE	onSubmit	PUT /lessons/:lessonId	
btn_lesson_delete	lesson.delete	LESSON_DELETE	onClick (confirm)	DELETE /lessons/:lessonId	
dnd_lesson_reorder	lesson.reorder	LESSON_REORDER_ACTION	onDragEnd	POST /chapters/:chapterId/lessons/reorder	nếu BE có
btn_lessons_retry	lesson.list.retry	LESSON_GET_BY_CHAPTER	onClick	GET /chapters/:chapterId/lessons	
LessonVideoUploadFlowScreen (/lessons/:lessonId/video)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_get_upload_url	lesson.video.getUploadUrl	LESSON_GET_VIDEO_UPLOAD_URL	onClick	GET /lessons/:lessonId/video/upload-url	lấy signedUrl
inp_video_file	lesson.video.selectFile	N/A	onFileSelect	(no BE)	chọn file local
sys_put_signed_url	lesson.video.uploadToStorage	N/A	onUploadStart	PUT <signedUrl>	gọi storage, không phải BE
btn_upload_complete	lesson.video.uploadComplete	LESSON_VIDEO_UPLOAD_COMPLETE_ACTION	onClick / afterUploadSuccess	POST /lessons/:lessonId/video/upload-complete	
LessonResourcesManageScreen (/lessons/:lessonId/resources)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
inp_resource_file	file.upload	FILE_UPLOAD	onFileSelect	POST /files/upload	nếu attach file
btn_resource_add	resource.create	RESOURCE_CREATE	onSubmit	POST /lessons/:lessonId/resources	
btn_resource_edit	resource.update	RESOURCE_UPDATE	onSubmit	PUT /resources/:id	
btn_resource_delete	resource.delete	RESOURCE_DELETE	onClick (confirm)	DELETE /resources/:id	
btn_resources_retry	resource.list.retry	RESOURCE_GET_BY_LESSON	onClick	GET /lessons/:lessonId/resources	
QuizManageScreen (/lessons/:lessonId/quizzes/manage)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_quiz_create	quiz.create	QUIZ_CREATE	onSubmit	POST /lessons/:lessonId/quizzes	
btn_quiz_edit	quiz.update	QUIZ_UPDATE	onSubmit	PUT /quizzes/:id	
btn_quiz_delete	quiz.delete	QUIZ_DELETE	onClick (confirm)	DELETE /quizzes/:id	
btn_quiz_list_retry	quiz.list.retry	QUIZ_GET_BY_LESSON	onClick	GET /lessons/:lessonId/quizzes	
AssignmentManageScreen (/lessons/:lessonId/assignments/manage)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_assignment_create	assignment.create	ASSIGNMENT_CREATE	onSubmit	POST /lessons/:lessonId/assignments	
btn_assignment_edit	assignment.update	ASSIGNMENT_UPDATE	onSubmit	PUT /assignments/:id	
btn_assignment_delete	assignment.delete	ASSIGNMENT_DELETE	onClick (confirm)	DELETE /assignments/:id	
btn_assignments_retry	assignment.list.retry	ASSIGNMENT_GET_BY_LESSON	onClick	GET /lessons/:lessonId/assignments	
GradeSubmissionScreen (/submissions/:id/grade)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
frm_grade_submit	submission.grade	SUBMISSION_GRADE_ACTION	onSubmit	POST /submissions/:id/grade	
btn_grade_retry	submission.grade.retry	SUBMISSION_GRADE_ACTION	onClick	POST /submissions/:id/grade	
btn_grade_load_submission	submission.detail.load	SUBMISSION_GET_BY_ID	onScreenOpen	GET /submissions/:id	
FeedbackSubmissionScreen (/submissions/:id/feedback)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
frm_feedback_submit	submission.feedback	SUBMISSION_FEEDBACK_ACTION	onSubmit	POST /submissions/:id/feedback	
btn_feedback_retry	submission.feedback.retry	SUBMISSION_FEEDBACK_ACTION	onClick	POST /submissions/:id/feedback	
inp_feedback_attachment	file.upload	FILE_UPLOAD	onFileSelect	POST /files/upload	optional
FileStorageScreen (/files/:id)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_file_retry	file.detail.retry	FILE_GET_BY_ID	onClick	GET /files/:id	
btn_file_delete	file.delete	FILE_DELETE	onClick (confirm)	DELETE /files/:id	nếu BE có
btn_file_download	file.download	FILE_GET_BY_ID (or direct)	onClick	GET /files/:id	lấy url rồi mở
Admin
AdminDashboardScreen (/admin)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
sel_admin_range	admin.dashboard.filterRange	ADMIN_GET_STATISTICS	onChange	GET /admin/statistics?range=...	
btn_admin_reload_revenue	admin.revenue.reload	ADMIN_GET_REVENUE_REPORT	onClick	GET /admin/reports/revenue?range=...	
AdminUsersScreen (/admin/users)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
txt_admin_users_search	admin.users.search	ADMIN_GET_USERS_LIST	onChange (debounce)	GET /admin/users?q=...&page=&size=	
sel_admin_users_role	admin.users.filterRole	ADMIN_GET_USERS_LIST	onChange	GET /admin/users?role=...	
sel_admin_users_status	admin.users.filterStatus	ADMIN_GET_USERS_LIST	onChange	GET /admin/users?status=...	
btn_admin_users_paginate	admin.users.paginate	ADMIN_GET_USERS_LIST	onClick	GET /admin/users?page=&size=	
btn_admin_users_export_open	admin.users.export.open	ADMIN_EXPORT_USERS_ACTION	onClick	POST /admin/users/export	navigate/export
AdminUserStatsScreen (/admin/users/stats)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
sel_admin_user_stats_range	admin.userStats.filterRange	ADMIN_GET_USER_STATS	onChange	GET /admin/users/stats?range=...	
btn_admin_user_stats_retry	admin.userStats.retry	ADMIN_GET_USER_STATS	onClick	GET /admin/users/stats?...	
AdminExportUsersScreen (/admin/users/export)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
frm_export_users_submit	admin.users.export	ADMIN_EXPORT_USERS_ACTION	onSubmit	POST /admin/users/export	
btn_export_users_retry	admin.users.export.retry	ADMIN_EXPORT_USERS_ACTION	onClick	POST /admin/users/export	
AdminAuditLogsScreen (/admin/audit-logs)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_audit_logs_paginate	admin.audit.paginate	ADMIN_GET_AUDIT_LOGS_LIST	onClick	GET /admin/audit-logs?page=&size=	
btn_audit_logs_retry	admin.audit.retry	ADMIN_GET_AUDIT_LOGS_LIST	onClick	GET /admin/audit-logs?...	
AdminAuditLogsSearchScreen (/admin/audit-logs/search)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
frm_audit_search_submit	admin.audit.search	ADMIN_SEARCH_AUDIT_LOGS	onSubmit	GET /admin/audit-logs/search?...	
btn_audit_search_reset	admin.audit.search.reset	N/A	onClick	(no API)	reset filters
btn_audit_search_paginate	admin.audit.search.paginate	ADMIN_SEARCH_AUDIT_LOGS	onClick	GET /admin/audit-logs/search?page=&size=&...	
AdminAuditLogsExportScreen (/admin/audit-logs/export)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
frm_audit_export_submit	admin.audit.export	ADMIN_EXPORT_AUDIT_LOGS_ACTION	onSubmit	POST /admin/audit-logs/export	
btn_audit_export_retry	admin.audit.export.retry	ADMIN_EXPORT_AUDIT_LOGS_ACTION	onClick	POST /admin/audit-logs/export	
AdminSystemSettingsScreen (/admin/settings)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_settings_reload	admin.settings.reload	ADMIN_GET_SYSTEM_SETTINGS	onClick	GET /admin/settings	
frm_setting_update	admin.settings.update	ADMIN_UPDATE_SYSTEM_SETTINGS	onSubmit / onBlur	PUT /admin/settings	nếu BE có
AdminCategoriesScreen (/admin/categories)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_category_create	category.create	CATEGORY_CREATE	onSubmit	POST /categories	
btn_category_edit	category.update	CATEGORY_UPDATE	onSubmit	PUT /categories/:id	
btn_category_delete	category.delete	CATEGORY_DELETE	onClick (confirm)	DELETE /categories/:id	
dnd_category_reorder	category.reorder	CATEGORY_REORDER_ACTION	onDragEnd	POST /categories/reorder	nếu BE có
btn_categories_reload	category.tree.reload	CATEGORY_GET_TREE	onClick	GET /categories/tree	
AdminTagsScreen (/admin/tags)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
txt_admin_tags_search	tag.list.search	TAG_GET_LIST	onChange (debounce)	GET /tags?q=...&page=&size=	
btn_tag_create	tag.create	TAG_CREATE	onSubmit	POST /tags	
btn_tag_edit	tag.update	TAG_UPDATE	onSubmit	PUT /tags/:id	
btn_tag_delete	tag.delete	TAG_DELETE	onClick (confirm)	DELETE /tags/:id	
btn_tags_paginate	tag.list.paginate	TAG_GET_LIST	onClick	GET /tags?page=&size=	
AdminReportsAllScreen (/admin/reports)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
sel_reports_status	report.list.filterStatus	REPORT_GET_ALL_LIST	onChange	GET /admin/reports?status=...&page=&size=	
sel_reports_type	report.list.filterType	REPORT_GET_ALL_LIST	onChange	GET /admin/reports?type=...&page=&size=	
btn_reports_paginate	report.list.paginate	REPORT_GET_ALL_LIST	onClick	GET /admin/reports?page=&size=	
btn_reports_retry	report.list.retry	REPORT_GET_ALL_LIST	onClick	GET /admin/reports?...	
AdminCourseVersionApprovalScreen (/admin/courses/:courseId/versions/:versionId/review)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
btn_admin_version_approve	version.approve	VERSION_APPROVE_ACTION	onClick (confirm)	POST /admin/courses/:courseId/versions/:versionId/approve	
btn_admin_version_reject	version.reject	VERSION_REJECT_ACTION	onClick (confirm)	POST /admin/courses/:courseId/versions/:versionId/reject	kèm reason
frm_admin_version_reject_reason	version.reject.reason	VERSION_REJECT_ACTION	onSubmit	POST .../reject	
btn_admin_version_reload	version.detail.reload	VERSION_GET_DETAIL	onClick	GET /courses/:courseId/versions/:versionId	
AdminRevenueReportScreen (/admin/reports/revenue)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
sel_revenue_range	admin.revenue.filterRange	ADMIN_GET_REVENUE_REPORT	onChange	GET /admin/reports/revenue?range=...	
btn_revenue_retry	admin.revenue.retry	ADMIN_GET_REVENUE_REPORT	onClick	GET /admin/reports/revenue?...	
btn_revenue_export	admin.revenue.export	ADMIN_EXPORT_REVENUE_ACTION	onClick	POST /admin/reports/revenue/export	
AdminStatisticsScreen (/admin/statistics)
testId	actionKey	contractKey	Trigger	Endpoint	Notes
sel_admin_stats_range	admin.statistics.filterRange	ADMIN_GET_STATISTICS	onChange	GET /admin/statistics?range=...	
btn_admin_stats_retry	admin.statistics.retry	ADMIN_GET_STATISTICS	onClick	GET /admin/statistics?...	