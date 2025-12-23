# Frontend Gap Analysis Report

**Generated:** 2025-01-XX  
**Frontend Framework:** Next.js App Router  
**Backend Contract:** `backend/API_CONTRACT.md`  
**Analysis Date:** 2025-01-XX

---

## A) FE Route Inventory

| Route | File Path | Client/Server | Notes |
|-------|-----------|---------------|-------|
| `/` | `src/app/(public)/page.tsx` | Server | Homepage |
| `/explore` | `src/app/(public)/explore/page.tsx` | Server | Explore page (uses mock components) |
| `/login` | `src/app/(public)/login/page.tsx` | Client | ✅ Uses `auth.service.ts` |
| `/signup` | `src/app/(public)/signup/page.tsx` | ? | Registration page |
| `/verify-email` | `src/app/(public)/verify-email/page.tsx` | ? | Email verification |
| `/forgot-password` | `src/app/(public)/forgot-password/page.tsx` | ? | Password reset request |
| `/reset-password` | `src/app/(public)/reset-password/page.tsx` | ? | Password reset form |
| `/terms` | `src/app/(public)/terms/page.tsx` | Server | Terms of service |
| `/privacy` | `src/app/(public)/privacy/page.tsx` | Server | Privacy policy |
| `/[username]/dashboard` | `src/app/[username]/dashboard/page.tsx` | Client | ✅ Unified dashboard (uses `auth.service.ts`, `getCurrentTeacher`) |
| `/learner/dashboard` | `src/app/learner/dashboard/page.tsx` | Server | 🟡 Uses `MOCK_COURSES`, `RECOMMENDED_COURSES` |
| `/learner/catalog` | `src/app/learner/catalog/page.tsx` | Client | 🟡 Uses `listCourses()` but still falls back to mock |
| `/learner/courses` | `src/app/learner/courses/page.tsx` | ? | My courses list |
| `/learner/courses/[slug]` | `src/app/learner/courses/[slug]/page.tsx` | Client | 🟡 Uses `getCourseBySlug()` but still falls back to mock |
| `/learner/courses/[slug]/learn` | `src/app/learner/courses/[slug]/learn/page.tsx` | Client | 🔴 Uses `MOCK_PLAYER_COURSE` only |
| `/learner/assignments` | `src/app/learner/assignments/page.tsx` | ? | Assignments list |
| `/learner/quiz/[id]` | `src/app/learner/quiz/[id]/page.tsx` | ? | Quiz page |
| `/instructor/dashboard` | `src/app/instructor/dashboard/page.tsx` | Client | 🟡 Uses `getInstructorDashboard()` but still falls back to mock |
| `/instructor/course_ins/[id]/manage` | `src/app/instructor/course_ins/[id]/manage/page.tsx` | ? | Course management |
| `/admin/dashboard` | `src/app/admin/dashboard/page.tsx` | ? | Admin dashboard |
| `/admin/manage/users` | `src/app/admin/manage/users/page.tsx` | ? | User management |
| `/admin/manage/reports` | `src/app/admin/manage/reports/page.tsx` | ? | Reports management |
| `/admin/manage/courses/approval` | `src/app/admin/manage/courses/approval/page.tsx` | ? | Course approval |

**Total Routes:** 23  
**Client Components:** 7  
**Server Components:** 5  
**Unknown:** 11

---

## B) API Endpoint Inventory

### Auth Endpoints (`/api/v1/auth`)

| Feature | Method | Path | Auth? | Notes |
|---------|--------|------|-------|-------|
| auth | POST | `/api/v1/auth/register` | ❌ | ✅ Implemented in `auth.service.ts` |
| auth | POST | `/api/v1/auth/login` | ❌ | ✅ Implemented in `auth.service.ts` |
| auth | POST | `/api/v1/auth/refresh` | ❌ | ⚠️ **MISMATCH**: FE uses `/refresh-token`, BE uses `/refresh` |
| auth | POST | `/api/v1/auth/logout` | ❌ | ✅ Implemented in `auth.service.ts` |
| auth | GET | `/api/v1/auth/verify-email` | ❌ | ✅ Implemented in `auth.service.ts` |
| auth | POST | `/api/v1/auth/resend-verification` | ❌ | ⚠️ **MISMATCH**: FE uses `/resend-verification-email`, BE uses `/resend-verification` |
| auth | POST | `/api/v1/auth/password/forgot` | ❌ | ⚠️ **MISMATCH**: FE uses `/forgot-password`, BE uses `/password/forgot` |
| auth | POST | `/api/v1/auth/password/reset` | ❌ | ⚠️ **MISMATCH**: FE uses `/reset-password`, BE uses `/password/reset` |
| auth | GET | `/api/v1/auth/me` | ✅ | ✅ Implemented in `auth.service.ts` |
| auth | PUT | `/api/v1/auth/password/change` | ✅ | ✅ Implemented in `auth.service.ts` |

### Profile Endpoints (`/api/v1/accounts`)

| Feature | Method | Path | Auth? | Notes |
|---------|--------|------|-------|-------|
| profile | GET | `/api/v1/accounts/me` | ✅ | ❌ **MISSING**: No service method |
| profile | PUT | `/api/v1/accounts/me` | ✅ | ❌ **MISSING**: No service method |
| profile | POST | `/api/v1/accounts/me/avatar` | ✅ | ❌ **MISSING**: No service method |

### Course/Explore Endpoints (`/api/v1/courses`)

| Feature | Method | Path | Auth? | Notes |
|---------|--------|------|-------|-------|
| courses/explore | GET | `/api/v1/courses` | ❌ | 🟡 **PARTIAL**: `listCourses()` exists but uses mock fallback |
| courses/explore | GET | `/api/v1/courses/{slug}` | ❌ | 🟡 **PARTIAL**: `getCourseBySlug()` exists but uses mock fallback |
| courses/explore | GET | `/api/v1/categories/tree` | ❌ | ❌ **MISSING**: No service method |
| courses/explore | GET | `/api/v1/categories/{id}` | ❌ | ❌ **MISSING**: No service method |
| courses/explore | GET | `/api/v1/categories/slug/{slug}` | ❌ | ❌ **MISSING**: No service method |
| courses/explore | GET | `/api/v1/tags` | ❌ | ❌ **MISSING**: No service method |
| courses/explore | GET | `/api/v1/courses/{courseId}/reviews` | ❌ | ❌ **MISSING**: No service method |
| courses/explore | GET | `/api/v1/courses/{courseId}/rating-summary` | ❌ | ❌ **MISSING**: No service method |
| courses/explore | POST | `/api/v1/courses/{courseId}/reviews` | ✅ | ❌ **MISSING**: No service method |
| courses/explore | GET | `/api/v1/chapters/{chapterId}/lessons` | ❌ | ❌ **MISSING**: No service method |
| courses/explore | GET | `/api/v1/lessons/{id}` | ❌ | ❌ **MISSING**: No service method |
| courses/explore | GET | `/api/v1/lessons/{lessonId}/video/stream-url` | ❌ | ❌ **MISSING**: No service method |

### Learning/My-Courses Endpoints

| Feature | Method | Path | Auth? | Notes |
|---------|--------|------|-------|-------|
| learner/learning | GET | `/api/v1/students/{id}/courses` | ✅ | ❌ **MISSING**: No service method |
| learner/learning | GET | `/api/v1/students/{id}/progress` | ✅ | ❌ **MISSING**: No service method |
| learner/learning | GET | `/api/v1/students/{id}/certificates` | ✅ | ❌ **MISSING**: No service method |
| learner/learning | POST | `/api/v1/enrollments` | ✅ | ⛔ **BLOCKED**: Backend controller is empty |
| learner/learning | POST | `/api/v1/progress/lessons/{lessonId}/complete` | ✅ | ⛔ **BLOCKED**: Backend controller is empty |

### Instructor Endpoints (`/api/v1/teachers`)

| Feature | Method | Path | Auth? | Notes |
|---------|--------|------|-------|-------|
| instructor | GET | `/api/v1/teachers/me` | ✅ | ✅ Implemented (via `getCurrentTeacher()` in `teacher.services.ts`) |
| instructor | GET | `/api/v1/teachers/{id}/stats` | ✅ | 🟡 **PARTIAL**: Referenced in `instructor.service.ts` but not implemented |
| instructor | GET | `/api/v1/teachers/{id}/revenue` | ✅ | 🟡 **PARTIAL**: Referenced in `instructor.service.ts` but not implemented |
| instructor | GET | `/api/v1/teachers/{id}/courses` | ✅ | 🟡 **PARTIAL**: Referenced in `instructor.service.ts` but not implemented |

### Community Endpoints (`/api/v1`)

| Feature | Method | Path | Auth? | Notes |
|---------|--------|------|-------|-------|
| community | GET | `/api/v1/courses/{courseId}/comments` | ❌ | ❌ **MISSING**: No service method |
| community | POST | `/api/v1/courses/{courseId}/comments` | ✅ | ❌ **MISSING**: No service method |
| community | GET | `/api/v1/lessons/{lessonId}/comments` | ❌ | ❌ **MISSING**: No service method |
| community | POST | `/api/v1/lessons/{lessonId}/comments` | ✅ | ❌ **MISSING**: No service method |
| community | GET | `/api/v1/comments/{id}/replies` | ❌ | ❌ **MISSING**: No service method |
| community | POST | `/api/v1/comments/{id}/reply` | ✅ | ❌ **MISSING**: No service method |
| notifications | GET | `/api/v1/notifications` | ✅ | ❌ **MISSING**: No service method |
| notifications | GET | `/api/v1/notifications/count-unread` | ✅ | ❌ **MISSING**: No service method |
| notifications | POST | `/api/v1/notifications/{id}/mark-read` | ✅ | ❌ **MISSING**: No service method |

### Payment Endpoints

| Feature | Method | Path | Auth? | Notes |
|---------|--------|------|-------|-------|
| payment | POST | `/api/v1/payments/checkout` | ✅ | ⛔ **BLOCKED**: Backend controller is empty |
| payment | GET | `/api/v1/payments` | ✅ | ⛔ **BLOCKED**: Backend controller is empty |
| payment | GET | `/api/v1/payments/{id}` | ✅ | ⛔ **BLOCKED**: Backend controller is empty |

### Recommendation Endpoints

| Feature | Method | Path | Auth? | Notes |
|---------|--------|------|-------|-------|
| recommendation | GET | `/students/{studentId}/recommendations` | ❌ | ❌ **MISSING**: No service method (note: no `/api/v1` prefix) |
| recommendation | POST | `/recommendations/{id}/feedback` | ✅ | ❌ **MISSING**: No service method |

---

## C) Gap Matrix

### EXPLORE Module

| Screen | Expected Route | Needed Endpoints | FE Status | Evidence Paths | Suggested Implementation Files |
|--------|----------------|------------------|-----------|----------------|-------------------------------|
| **Explore Home** | `/explore` | `GET /api/v1/categories/tree`, `GET /api/v1/courses` | 🟡 UI exists, uses mock | `src/app/(public)/explore/page.tsx` - uses mock components | `src/features/courses/services/courses.service.ts` - add `getCategoryTree()` |
| **Category Page** | `/categories/[slug]` | `GET /api/v1/categories/slug/{slug}`, `GET /api/v1/courses?category={id}` | 🔴 Missing route | N/A | `src/app/(public)/categories/[slug]/page.tsx` (new), `src/features/courses/services/courses.service.ts` - add `getCategoryBySlug()` |
| **Course Catalog** | `/learner/catalog` | `GET /api/v1/courses` | 🟡 Partial: service exists but uses mock | `src/app/learner/catalog/page.tsx` - calls `listCourses()` but falls back to mock | `src/features/courses/services/courses.service.ts` - implement real API call in `listCourses()` |
| **Course Detail** | `/learner/courses/[slug]` | `GET /api/v1/courses/{slug}`, `GET /api/v1/courses/{courseId}/reviews`, `GET /api/v1/courses/{courseId}/rating-summary` | 🟡 Partial: service exists but uses mock, missing reviews | `src/app/learner/courses/[slug]/page.tsx` - calls `getCourseBySlug()` but falls back to mock | `src/features/courses/services/courses.service.ts` - implement real API calls, add `getCourseReviews()`, `getRatingSummary()` |
| **Search Results** | `/search?q=...` | `GET /api/v1/courses?search={q}` | 🔴 Missing route | N/A | `src/app/(public)/search/page.tsx` (new), use existing `listCourses()` with search param |

### MY LEARNING Module

| Screen | Expected Route | Needed Endpoints | FE Status | Evidence Paths | Suggested Implementation Files |
|--------|----------------|------------------|-----------|----------------|-------------------------------|
| **My Courses** | `/learner/courses` | `GET /api/v1/students/{id}/courses` | 🔴 UI exists but uses mock | `src/app/learner/dashboard/page.tsx` - uses `MOCK_COURSES` | `src/features/learner/services/learner.service.ts` (new), `src/app/learner/courses/page.tsx` - wire to service |
| **Learning Player** | `/learner/courses/[slug]/learn` | `GET /api/v1/courses/{slug}`, `GET /api/v1/chapters/{chapterId}/lessons`, `GET /api/v1/lessons/{id}`, `GET /api/v1/lessons/{lessonId}/video/stream-url` | 🔴 Uses mock only | `src/app/learner/courses/[slug]/learn/page.tsx` - uses `MOCK_PLAYER_COURSE` | `src/features/courses/services/courses.service.ts` - add lesson/chapter methods, `src/features/learner/services/learner.service.ts` - add progress tracking |
| **Progress Tracking** | Embedded in player | `POST /api/v1/progress/lessons/{lessonId}/complete` | ⛔ Blocked by backend | N/A | Wait for backend, then `src/features/learner/services/learner.service.ts` - add `markLessonComplete()` |
| **Certificates** | `/learner/certificates` | `GET /api/v1/students/{id}/certificates` | 🔴 Missing route | N/A | `src/app/learner/certificates/page.tsx` (new), `src/features/learner/services/learner.service.ts` - add `getCertificates()` |
| **Enroll in Course** | Button on course detail | `POST /api/v1/enrollments` | ⛔ Blocked by backend | N/A | Wait for backend, then `src/features/learner/services/learner.service.ts` - add `enrollInCourse()` |

### PROFILE Module

| Screen | Expected Route | Needed Endpoints | FE Status | Evidence Paths | Suggested Implementation Files |
|--------|----------------|------------------|-----------|----------------|-------------------------------|
| **Profile View/Edit** | `/profile` or `/[username]/profile` | `GET /api/v1/accounts/me`, `PUT /api/v1/accounts/me` | 🔴 Missing route | N/A | `src/app/[username]/profile/page.tsx` (new), `src/features/profile/services/profile.service.ts` (new) |
| **Avatar Upload** | Embedded in profile | `POST /api/v1/accounts/me/avatar` | 🔴 Missing | N/A | `src/features/profile/services/profile.service.ts` - add `uploadAvatar()` |

### COMMUNITY Module

| Screen | Expected Route | Needed Endpoints | FE Status | Evidence Paths | Suggested Implementation Files |
|--------|----------------|------------------|-----------|----------------|-------------------------------|
| **Course Discussion** | Embedded in course detail | `GET /api/v1/courses/{courseId}/comments`, `POST /api/v1/courses/{courseId}/comments` | 🔴 Missing | `src/app/learner/courses/[slug]/page.tsx` - no comments section | `src/features/community/services/community.service.ts` (new), add comments section to course detail page |
| **Lesson Discussion** | Embedded in player | `GET /api/v1/lessons/{lessonId}/comments`, `POST /api/v1/lessons/{lessonId}/comments` | 🔴 Missing | `src/app/learner/courses/[slug]/learn/page.tsx` - no comments | `src/features/community/services/community.service.ts` - add lesson comments |
| **Replies Thread** | Modal/sidebar | `GET /api/v1/comments/{id}/replies`, `POST /api/v1/comments/{id}/reply` | 🔴 Missing | N/A | `src/features/community/services/community.service.ts` - add reply methods |
| **Notifications Inbox** | `/notifications` | `GET /api/v1/notifications`, `GET /api/v1/notifications/count-unread`, `POST /api/v1/notifications/{id}/mark-read` | 🔴 Missing route | N/A | `src/app/notifications/page.tsx` (new), `src/features/community/services/community.service.ts` - add notification methods |

### PAYMENT Module

| Screen | Expected Route | Needed Endpoints | FE Status | Evidence Paths | Suggested Implementation Files |
|--------|----------------|------------------|-----------|----------------|-------------------------------|
| **Checkout** | `/checkout?courseId=...` | `POST /api/v1/payments/checkout` | ⛔ Blocked by backend | N/A | Wait for backend, then `src/app/checkout/page.tsx` (new), `src/features/payment/services/payment.service.ts` (new) |
| **Payment History** | `/payments` or `/orders` | `GET /api/v1/payments` | ⛔ Blocked by backend | N/A | Wait for backend, then `src/app/payments/page.tsx` (new) |

### RECOMMENDATION Module

| Screen | Expected Route | Needed Endpoints | FE Status | Evidence Paths | Suggested Implementation Files |
|--------|----------------|------------------|-----------|----------------|-------------------------------|
| **Recommendations Widget** | Embedded in dashboard | `GET /students/{studentId}/recommendations` | 🔴 Missing | `src/app/learner/dashboard/page.tsx` - uses `RECOMMENDED_COURSES` mock | `src/features/recommendation/services/recommendation.service.ts` (new), wire to dashboard |

---

## D) Next Implementation Plan

### Top 10 Most Valuable Missing Screens

#### 1. **Profile View/Edit** (PROFILE Module) - Priority: HIGH
**Why:** Core user experience, needed for account management.

**Files to Create/Edit:**
- `src/features/profile/services/profile.service.ts` (NEW)
  ```typescript
  export async function getProfile() {
    const res = await apiClient.get<ApiResponse<AccountProfileResponse>>("/api/v1/accounts/me");
    return res.data.data;
  }
  export async function updateProfile(payload: UpdateProfileRequest) {
    const res = await apiClient.put<AccountProfileResponse>("/api/v1/accounts/me", payload);
    return res.data;
  }
  export async function uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiClient.post<UploadAvatarResponse>("/api/v1/accounts/me/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  }
  ```
- `src/features/profile/hooks/useProfile.ts` (NEW)
- `src/app/[username]/profile/page.tsx` (NEW)

**Backend Status:** ✅ Ready

---

#### 2. **Course Reviews & Rating** (EXPLORE Module) - Priority: HIGH
**Why:** Essential for course discovery and trust building.

**Files to Create/Edit:**
- `src/features/courses/services/courses.service.ts` (EDIT)
  ```typescript
  export async function getCourseReviews(courseId: number, page = 0, size = 10) {
    const res = await apiClient.get<PageResponse<CourseReviewResponse>>(
      `/api/v1/courses/${courseId}/reviews`,
      { params: { page, size } }
    );
    return res.data;
  }
  export async function getCourseRatingSummary(courseId: number) {
    const res = await apiClient.get<RatingSummaryResponse>(
      `/api/v1/courses/${courseId}/rating-summary`
    );
    return res.data;
  }
  export async function createCourseReview(courseId: number, payload: { rating: number; comment: string }) {
    const res = await apiClient.post<CourseReviewResponse>(
      `/api/v1/courses/${courseId}/reviews`,
      payload
    );
    return res.data;
  }
  ```
- `src/app/learner/courses/[slug]/page.tsx` (EDIT) - Add reviews section

**Backend Status:** ✅ Ready

---

#### 3. **My Courses List** (MY LEARNING Module) - Priority: HIGH
**Why:** Core learning experience, students need to see enrolled courses.

**Files to Create/Edit:**
- `src/features/learner/services/learner.service.ts` (NEW)
  ```typescript
  export async function getStudentCourses(studentId: number, page = 0, size = 10) {
    const res = await apiClient.get<PageResponse<StudentCourseResponse>>(
      `/api/v1/students/${studentId}/courses`,
      { params: { page, size } }
    );
    return res.data;
  }
  ```
- `src/features/learner/hooks/useMyCourses.ts` (NEW)
- `src/app/learner/courses/page.tsx` (EDIT) - Wire to service
- `src/app/learner/dashboard/page.tsx` (EDIT) - Replace `MOCK_COURSES` with service call

**Backend Status:** ✅ Ready

---

#### 4. **Category Tree & Category Pages** (EXPLORE Module) - Priority: MEDIUM
**Why:** Improves course discovery and navigation.

**Files to Create/Edit:**
- `src/features/courses/services/courses.service.ts` (EDIT)
  ```typescript
  export async function getCategoryTree() {
    const res = await apiClient.get<CategoryResponseDto[]>("/api/v1/categories/tree");
    return res.data;
  }
  export async function getCategoryBySlug(slug: string) {
    const res = await apiClient.get<CategoryResponseDto>(`/api/v1/categories/slug/${slug}`);
    return res.data;
  }
  ```
- `src/app/(public)/categories/[slug]/page.tsx` (NEW)
- `src/app/(public)/explore/page.tsx` (EDIT) - Use real category tree

**Backend Status:** ✅ Ready

---

#### 5. **Learning Player with Real Content** (MY LEARNING Module) - Priority: HIGH
**Why:** Core learning experience, currently uses mock only.

**Files to Create/Edit:**
- `src/features/courses/services/courses.service.ts` (EDIT)
  ```typescript
  export async function getChapters(courseId: number, versionId: number) {
    const res = await apiClient.get<ChapterDto[]>(
      `/api/v1/courses/${courseId}/versions/${versionId}/chapters`
    );
    return res.data;
  }
  export async function getLessonsByChapter(chapterId: number) {
    const res = await apiClient.get<LessonDTO[]>(`/api/v1/chapters/${chapterId}/lessons`);
    return res.data;
  }
  export async function getLessonById(lessonId: number) {
    const res = await apiClient.get<LessonDTO>(`/api/v1/lessons/${lessonId}`);
    return res.data;
  }
  export async function getVideoStreamUrl(lessonId: number) {
    const res = await apiClient.get<{ streamUrl: string }>(`/api/v1/lessons/${lessonId}/video/stream-url`);
    return res.data.streamUrl;
  }
  ```
- `src/app/learner/courses/[slug]/learn/page.tsx` (EDIT) - Replace mock with real API calls

**Backend Status:** ✅ Ready (but need to get `versionId` from course detail)

---

#### 6. **Notifications Inbox** (COMMUNITY Module) - Priority: MEDIUM
**Why:** Important for user engagement and communication.

**Files to Create/Edit:**
- `src/features/community/services/community.service.ts` (NEW)
  ```typescript
  export async function getNotifications(page = 0, size = 10) {
    const res = await apiClient.get<PageResponse<NotificationResponse>>("/api/v1/notifications", {
      params: { page, size },
    });
    return res.data;
  }
  export async function getUnreadNotificationCount() {
    const res = await apiClient.get<{ count: number }>("/api/v1/notifications/count-unread");
    return res.data.count;
  }
  export async function markNotificationRead(id: number) {
    await apiClient.post(`/api/v1/notifications/${id}/mark-read`);
  }
  ```
- `src/app/notifications/page.tsx` (NEW)
- `src/core/components/shared/NotificationBell.tsx` (NEW) - Add to navbar

**Backend Status:** ✅ Ready

---

#### 7. **Course Comments/Discussion** (COMMUNITY Module) - Priority: MEDIUM
**Why:** Enhances learning experience and community engagement.

**Files to Create/Edit:**
- `src/features/community/services/community.service.ts` (EDIT)
  ```typescript
  export async function getCourseComments(courseId: number) {
    const res = await apiClient.get<CommentResponse[]>(`/api/v1/courses/${courseId}/comments`);
    return res.data;
  }
  export async function createCourseComment(courseId: number, content: string) {
    const res = await apiClient.post<CommentResponse>(
      `/api/v1/courses/${courseId}/comments`,
      { content }
    );
    return res.data;
  }
  export async function getCommentReplies(commentId: number) {
    const res = await apiClient.get<CommentResponse[]>(`/api/v1/comments/${commentId}/replies`);
    return res.data;
  }
  export async function replyToComment(commentId: number, content: string) {
    const res = await apiClient.post<CommentResponse>(
      `/api/v1/comments/${commentId}/reply`,
      { content }
    );
    return res.data;
  }
  ```
- `src/app/learner/courses/[slug]/page.tsx` (EDIT) - Add comments section

**Backend Status:** ✅ Ready

---

#### 8. **Certificates List** (MY LEARNING Module) - Priority: LOW
**Why:** Nice-to-have for showcasing achievements.

**Files to Create/Edit:**
- `src/features/learner/services/learner.service.ts` (EDIT)
  ```typescript
  export async function getStudentCertificates(studentId: number, page = 0, size = 10) {
    const res = await apiClient.get<PageResponse<StudentCertificateResponse>>(
      `/api/v1/students/${studentId}/certificates`,
      { params: { page, size } }
    );
    return res.data;
  }
  ```
- `src/app/learner/certificates/page.tsx` (NEW)

**Backend Status:** ✅ Ready

---

#### 9. **Student Progress Dashboard** (MY LEARNING Module) - Priority: MEDIUM
**Why:** Helps students track their learning journey.

**Files to Create/Edit:**
- `src/features/learner/services/learner.service.ts` (EDIT)
  ```typescript
  export async function getStudentProgress(studentId: number) {
    const res = await apiClient.get<StudentProgressResponse>(
      `/api/v1/students/${studentId}/progress`
    );
    return res.data;
  }
  ```
- `src/app/learner/dashboard/page.tsx` (EDIT) - Add progress stats section

**Backend Status:** ✅ Ready

---

#### 10. **Recommendations Widget** (RECOMMENDATION Module) - Priority: LOW
**Why:** Enhances discovery but not critical.

**Files to Create/Edit:**
- `src/features/recommendation/services/recommendation.service.ts` (NEW)
  ```typescript
  export async function getRecommendations(studentId: number) {
    // Note: No /api/v1 prefix
    const res = await apiClient.get<ApiResponse<Recommendation[]>>(
      `/students/${studentId}/recommendations`
    );
    return res.data.data;
  }
  ```
- `src/app/learner/dashboard/page.tsx` (EDIT) - Replace `RECOMMENDED_COURSES` mock

**Backend Status:** ✅ Ready (but uses root path `/` instead of `/api/v1`)

---

### Critical Fixes Needed

#### 1. **Auth Endpoint Mismatches** - Priority: CRITICAL
**Issue:** Frontend uses wrong endpoint paths for several auth operations.

**Files to Fix:**
- `src/features/auth/services/auth.service.ts`
  - Line 98: Change `/refresh-token` → `/refresh`
  - Line 124: Change `/resend-verification-email` → `/resend-verification`
  - Line 135: Change `/forgot-password` → `/password/forgot`
  - Line 146: Change `/reset-password` → `/password/reset`
- `src/services/core/auth-refresh.ts`
  - Line 11: Change `/refresh-token` → `/refresh`

**Backend Status:** ✅ Ready

---

#### 2. **Instructor Service Implementation** - Priority: MEDIUM
**Issue:** `instructor.service.ts` has TODOs but no real API calls.

**Files to Fix:**
- `src/features/instructor/services/instructor.service.ts`
  - Implement `getTeacherStats()`, `getTeacherRevenue()`, `getTeacherCourses()`
  - Update `getInstructorDashboard()` to call real endpoints

**Backend Status:** ✅ Ready

---

#### 3. **Courses Service Real API Calls** - Priority: HIGH
**Issue:** `courses.service.ts` has TODOs and falls back to mock.

**Files to Fix:**
- `src/features/courses/services/courses.service.ts`
  - Implement real API call in `listCourses()` (remove mock fallback)
  - Implement real API call in `getCourseBySlug()` (remove mock fallback)

**Backend Status:** ✅ Ready

---

### Backend Blockers

1. **Payment Endpoints** - `PaymentController` is empty
   - **Impact:** Cannot implement checkout or payment history
   - **Workaround:** Hide payment features or use mock for now

2. **Enrollment Endpoint** - `EnrollmentController` is empty
   - **Impact:** Cannot enroll students in courses
   - **Workaround:** Use mock enrollment or wait for backend

3. **Progress Tracking** - `ProgressController` is empty
   - **Impact:** Cannot mark lessons as complete
   - **Workaround:** Track progress locally or wait for backend

---

## Summary Statistics

- **Total Routes:** 23
- **Routes with Real API:** 3 (13%)
- **Routes with Mock/Partial:** 4 (17%)
- **Missing Routes:** 16 (70%)

- **Total Backend Endpoints:** ~80
- **Endpoints with FE Service:** 12 (15%)
- **Endpoints Missing Service:** 68 (85%)
- **Endpoints Blocked by Backend:** 5 (6%)

- **Critical Fixes:** 3 (auth endpoint mismatches)
- **High Priority Screens:** 5
- **Medium Priority Screens:** 3
- **Low Priority Screens:** 2

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-XX

