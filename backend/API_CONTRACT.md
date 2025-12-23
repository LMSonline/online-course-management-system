# Backend API Contract Documentation

**Generated:** 2025-01-XX  
**Framework:** Spring Boot 3.x  
**Base URL:** `http://localhost:8080`  
**API Prefix:** `/api/v1`  
**Auth Strategy:** JWT Bearer Token (HTTP Authorization header)  
**Swagger UI:** `http://localhost:8080/swagger-ui.html`

---

## A) Backend Overview

### Framework & Entry Point
- **Framework:** Spring Boot 3.x (Java)
- **Entry Point:** `vn.uit.lms.LmsApplication`
- **Main Route Prefix:** `/api/v1`
- **Auth Strategy:** JWT Bearer Token Authentication
  - Access token in `Authorization: Bearer <token>` header
  - Refresh token endpoint: `POST /api/v1/auth/refresh`
  - Token expiry: Access token (86400s = 24h), Refresh token (100000s ≈ 27.8h)
- **OpenAPI/Swagger:** Configured at `/swagger-ui.html` with JWT Bearer auth support

### Key Controllers Location
- Controllers: `backend/lms/src/main/java/vn/uit/lms/controller/`
- DTOs: `backend/lms/src/main/java/vn/uit/lms/shared/dto/`
- Services: `backend/lms/src/main/java/vn/uit/lms/service/`

---

## B) Endpoint Map

### 1. AUTHENTICATION (`/api/v1/auth`)

| Method | Path | Auth | Role | Request Body/Params | Response Shape | Source File |
|--------|------|------|------|-------------------|-----------------|-------------|
| POST | `/api/v1/auth/register` | ❌ | - | `RegisterRequest`: `{email, username, password, role}` | `RegisterResponse`: `{id, username, email, role, status}` | `AuthController.java:67` |
| POST | `/api/v1/auth/login` | ❌ | - | `ReqLoginDTO`: `{login, password}` | `ResLoginDTO`: `{accessToken, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt, user: {id, username, email, role, fullName, avatarUrl, langKey}}` | `AuthController.java:117` |
| POST | `/api/v1/auth/refresh` | ❌ | - | `ReqRefreshTokenDTO`: `{refreshToken, deviceInfo?, ipAddress?}` | `ResLoginDTO` (same as login) | `AuthController.java:146` |
| POST | `/api/v1/auth/logout` | ❌ | - | `ReqRefreshTokenDTO`: `{refreshToken}` | `204 No Content` | `AuthController.java:170` |
| GET | `/api/v1/auth/verify-email` | ❌ | - | Query: `token` | `200 OK` | `AuthController.java:95` |
| POST | `/api/v1/auth/resend-verification` | ❌ | - | `ResendVerifyEmailRequest`: `{email}` | `200 OK` | `AuthController.java:268` |
| POST | `/api/v1/auth/password/forgot` | ❌ | - | `ForgotPasswordDTO`: `{email}` | `200 OK` | `AuthController.java:189` |
| POST | `/api/v1/auth/password/reset` | ❌ | - | Query: `token`, Body: `ResetPasswordDTO`: `{newPassword}` | `200 OK` | `AuthController.java:211` |
| GET | `/api/v1/auth/me` | ✅ | Any | - | `MeResponse`: `{accountId, username, email, fullName, status, avatarUrl, role, birthday?, bio?, gender?, lastLoginAt}` | `AuthController.java:234` |
| PUT | `/api/v1/auth/password/change` | ✅ | Any | `ChangePasswordDTO`: `{oldPassword, newPassword}` | `200 OK` | `AuthController.java:252` |

---

### 2. PROFILE (`/api/v1/accounts`)

| Method | Path | Auth | Role | Request Body/Params | Response Shape | Source File |
|--------|------|------|------|-------------------|-----------------|-------------|
| GET | `/api/v1/accounts/me` | ✅ | Any | - | `ApiResponse<AccountProfileResponse>` | `AccountController.java:56` |
| PUT | `/api/v1/accounts/me` | ✅ | Any | `UpdateProfileRequest`: `{fullName?, bio?, birthday?, gender?}` | `AccountProfileResponse` | `AccountController.java:88` |
| POST | `/api/v1/accounts/me/avatar` | ✅ | Any | `MultipartFile` (JPG/PNG/WEBP) | `UploadAvatarResponse`: `{avatarUrl}` | `AccountController.java:69` |

---

### 3. EXPLORE / COURSES (`/api/v1/courses`)

| Method | Path | Auth | Role | Request Body/Params | Response Shape | Source File |
|--------|------|------|------|-------------------|-----------------|-------------|
| GET | `/api/v1/courses` | ❌ | - | Query: `page`, `size`, `sort`, `filter` (Spring Filter spec) | `PageResponse<CourseResponse>` | `CourseController.java:54` |
| GET | `/api/v1/courses/{slug}` | ❌ | - | Path: `slug` | `CourseDetailResponse`: `{id, title, shortDescription, difficulty, thumbnailUrl, slug, canonicalUrl, metaTitle, metaDescription, seoKeywords, indexed, isClosed, category: {id, name, code, description}, teacherId, PublicVersionId, tags[]}` | `CourseController.java:46` |
| POST | `/api/v1/teacher/courses` | ✅ | TEACHER | `CourseRequest` | `CourseDetailResponse` | `CourseController.java:37` |
| PUT | `/api/v1/teacher/courses/{id}` | ✅ | TEACHER | Path: `id`, Body: `CourseUpdateRequest` | `CourseDetailResponse` | `CourseController.java:97` |
| DELETE | `/api/v1/teacher/courses/{id}` | ✅ | TEACHER | Path: `id` | `204 No Content` | `CourseController.java:108` |
| PATCH | `/api/v1/teacher/courses/{id}/close` | ✅ | TEACHER | Path: `id` | `CourseDetailResponse` | `CourseController.java:77` |
| PATCH | `/api/v1/teacher/courses/{id}/open` | ✅ | TEACHER | Path: `id` | `CourseDetailResponse` | `CourseController.java:87` |
| PATCH | `/api/v1/teacher/courses/{id}/restore` | ✅ | TEACHER | Path: `id` | `CourseDetailResponse` | `CourseController.java:118` |
| GET | `/api/v1/teacher/courses` | ✅ | TEACHER | Query: `page`, `size`, `filter` | `PageResponse<CourseResponse>` | `CourseController.java:128` |

**Note:** `CourseResponse` shape: `{id, title, shortDescription, difficulty, thumbnailUrl, slug, isClosed, categoryId, categoryName, teacherId, teacherName, publicVersionId}`

---

### 4. CATEGORIES (`/api/v1/categories`)

| Method | Path | Auth | Role | Request Body/Params | Response Shape | Source File |
|--------|------|------|------|-------------------|-----------------|-------------|
| GET | `/api/v1/categories/tree` | ❌ | - | - | `List<CategoryResponseDto>` (nested tree) | `CategoryController.java:58` |
| GET | `/api/v1/categories/{id}` | ❌ | - | Path: `id` | `CategoryResponseDto`: `{id, name, code, description, visible, parentId, deletedAt, children[], slug, metaTitle, metaDescription, thumbnailUrl}` | `CategoryController.java:40` |
| GET | `/api/v1/categories/slug/{slug}` | ❌ | - | Path: `slug` | `CategoryResponseDto` | `CategoryController.java:105` |

---

### 5. TAGS (`/api/v1/tags`)

| Method | Path | Auth | Role | Request Body/Params | Response Shape | Source File |
|--------|------|------|------|-------------------|-----------------|-------------|
| GET | `/api/v1/tags` | ❌ | - | Query: `page`, `size` | `PageResponse<Tag>` | `TagController.java:39` |

---

### 6. COURSE REVIEWS (`/api/v1/courses/{courseId}/reviews`)

| Method | Path | Auth | Role | Request Body/Params | Response Shape | Source File |
|--------|------|------|------|-------------------|-----------------|-------------|
| GET | `/api/v1/courses/{courseId}/reviews` | ❌ | - | Path: `courseId`, Query: `page`, `size` | `PageResponse<CourseReviewResponse>` | `CourseReviewController.java:43` |
| GET | `/api/v1/courses/{courseId}/rating-summary` | ❌ | - | Path: `courseId` | `RatingSummaryResponse` | `CourseReviewController.java:78` |
| POST | `/api/v1/courses/{courseId}/reviews` | ✅ | STUDENT | Path: `courseId`, Body: `CourseReviewRequest`: `{rating, comment}` | `CourseReviewResponse` | `CourseReviewController.java:32` |
| PUT | `/api/v1/courses/{courseId}/reviews/{reviewId}` | ✅ | STUDENT | Path: `courseId`, `reviewId`, Body: `CourseReviewRequest` | `CourseReviewResponse` | `CourseReviewController.java:54` |
| DELETE | `/api/v1/courses/{courseId}/reviews/{reviewId}` | ✅ | STUDENT | Path: `courseId`, `reviewId` | `204 No Content` | `CourseReviewController.java:67` |

---

### 7. COURSE CONTENT (Chapters & Lessons)

#### Chapters (`/api/v1/courses/{courseId}/versions/{versionId}/chapters`)

| Method | Path | Auth | Role | Request Body/Params | Response Shape | Source File |
|--------|------|------|------|-------------------|-----------------|-------------|
| GET | `/api/v1/courses/{courseId}/versions/{versionId}/chapters` | ❌ | - | Path: `courseId`, `versionId` | `List<ChapterDto>` | `ChapterController.java:44` |
| GET | `/api/v1/courses/{courseId}/versions/{versionId}/chapters/{chapterId}` | ❌ | - | Path: `courseId`, `versionId`, `chapterId` | `ChapterDto` | `ChapterController.java:53` |
| POST | `/api/v1/courses/{courseId}/versions/{versionId}/chapters` | ✅ | TEACHER | Path: `courseId`, `versionId`, Body: `ChapterRequest` | `ChapterDto` | `ChapterController.java:32` |
| PUT | `/api/v1/courses/{courseId}/versions/{versionId}/chapters/{chapterId}` | ✅ | TEACHER | Path: `courseId`, `versionId`, `chapterId`, Body: `ChapterRequest` | `ChapterDto` | `ChapterController.java:65` |
| DELETE | `/api/v1/courses/{courseId}/versions/{versionId}/chapters/{chapterId}` | ✅ | TEACHER | Path: `courseId`, `versionId`, `chapterId` | `204 No Content` | `ChapterController.java:79` |
| POST | `/api/v1/courses/{courseId}/versions/{versionId}/chapters/reorder` | ✅ | TEACHER | Path: `courseId`, `versionId`, Body: `ChapterReorderRequest` | `200 OK` | `ChapterController.java:92` |

#### Lessons (`/api/v1/lessons`)

| Method | Path | Auth | Role | Request Body/Params | Response Shape | Source File |
|--------|------|------|------|-------------------|-----------------|-------------|
| GET | `/api/v1/chapters/{chapterId}/lessons` | ❌ | - | Path: `chapterId` | `List<LessonDTO>` | `LessonController.java:48` |
| GET | `/api/v1/lessons/{id}` | ❌ | - | Path: `id` | `LessonDTO` | `LessonController.java:58` |
| GET | `/api/v1/lessons/{lessonId}/video/stream-url` | ❌ | - | Path: `lessonId` | `{streamUrl: string}` | `LessonController.java:126` |
| POST | `/api/v1/chapters/{chapterId}/lessons` | ✅ | TEACHER | Path: `chapterId`, Body: `CreateLessonRequest` | `LessonDTO` | `LessonController.java:36` |
| PUT | `/api/v1/lessons/{id}` | ✅ | TEACHER | Path: `id`, Body: `UpdateLessonRequest` | `LessonDTO` | `LessonController.java:68` |
| DELETE | `/api/v1/lessons/{id}` | ✅ | TEACHER | Path: `id` | `204 No Content` | `LessonController.java:80` |
| POST | `/api/v1/chapters/{chapterId}/lessons/reorder` | ✅ | TEACHER | Path: `chapterId`, Body: `ReorderLessonsRequest` | `200 OK` | `LessonController.java:91` |
| GET | `/api/v1/lessons/{lessonId}/video/upload-url` | ✅ | TEACHER | Path: `lessonId` | `RequestUploadUrlResponse` | `LessonController.java:103` |
| POST | `/api/v1/lessons/{lessonId}/video/upload-complete` | ✅ | TEACHER | Path: `lessonId`, Body: `UpdateVideoRequest` | `LessonDTO` | `LessonController.java:114` |
| DELETE | `/api/v1/lessons/{lessonId}/video` | ✅ | TEACHER | Path: `lessonId` | `LessonDTO` | `LessonController.java:136` |

---

### 8. MY-COURSES / LEARNING

**⚠️ NOTE:** The learning controllers (`EnrollmentController`, `ProgressController`, `CertificateController`) are currently **EMPTY** (stub classes). These endpoints need to be implemented.

**Expected Endpoints (Not Yet Implemented):**
- `GET /api/v1/students/{id}/courses` - Get enrolled courses (✅ **Implemented in StudentController**)
- `GET /api/v1/students/{id}/progress` - Get learning progress (✅ **Implemented in StudentController**)
- `GET /api/v1/students/{id}/certificates` - Get certificates (✅ **Implemented in StudentController**)
- `POST /api/v1/enrollments` - Enroll in course (❌ **Not implemented**)
- `GET /api/v1/enrollments` - List enrollments (❌ **Not implemented**)
- `POST /api/v1/progress/lessons/{lessonId}/complete` - Mark lesson complete (❌ **Not implemented**)

---

### 9. STUDENT PROFILE (`/api/v1/students`)

| Method | Path | Auth | Role | Request Body/Params | Response Shape | Source File |
|--------|------|------|------|-------------------|-----------------|-------------|
| GET | `/api/v1/students/{id}` | ✅ | Any | Path: `id` | `StudentDetailResponse` | `StudentController.java:42` |
| GET | `/api/v1/students/code/{code}` | ✅ | Any | Path: `code` | `StudentDetailResponse` | `StudentController.java:57` |
| PUT | `/api/v1/students/{id}` | ✅ | STUDENT/ADMIN | Path: `id`, Body: `UpdateStudentRequest` | `StudentDetailResponse` | `StudentController.java:72` |
| PUT | `/api/v1/students/{id}/avatar` | ✅ | STUDENT/ADMIN | Path: `id`, `MultipartFile` | `UploadAvatarResponse` | `StudentController.java:89` |
| GET | `/api/v1/students/{id}/courses` | ✅ | Any | Path: `id`, Query: `page`, `size` | `PageResponse<StudentCourseResponse>` | `StudentController.java:106` |
| GET | `/api/v1/students/{id}/progress` | ✅ | Any | Path: `id` | `StudentProgressResponse` | `StudentController.java:123` |
| GET | `/api/v1/students/{id}/certificates` | ✅ | Any | Path: `id`, Query: `page`, `size` | `PageResponse<StudentCertificateResponse>` | `StudentController.java:138` |
| DELETE | `/api/v1/students/{id}` | ✅ | ADMIN | Path: `id` | `204 No Content` | `StudentController.java:155` |

**⚠️ GAP:** No `GET /api/v1/students/me` endpoint. Use `GET /api/v1/students/{id}` with student's own ID.

---

### 10. TEACHER PROFILE (`/api/v1/teachers`)

| Method | Path | Auth | Role | Request Body/Params | Response Shape | Source File |
|--------|------|------|------|-------------------|-----------------|-------------|
| GET | `/api/v1/teachers/me` | ✅ | TEACHER | - | `TeacherDetailResponse` | `TeacherController.java:46` |
| GET | `/api/v1/teachers/{id}` | ✅ | Any | Path: `id` | `TeacherDetailResponse` | `TeacherController.java:58` |
| GET | `/api/v1/teachers/code/{code}` | ✅ | Any | Path: `code` | `TeacherDetailResponse` | `TeacherController.java:73` |
| PUT | `/api/v1/teachers/{id}` | ✅ | TEACHER/ADMIN | Path: `id`, Body: `UpdateTeacherRequest` | `TeacherDetailResponse` | `TeacherController.java:88` |
| PUT | `/api/v1/teachers/{id}/avatar` | ✅ | TEACHER/ADMIN | Path: `id`, `MultipartFile` | `UploadAvatarResponse` | `TeacherController.java:105` |
| POST | `/api/v1/teachers/{id}/request-approval` | ✅ | TEACHER | Path: `id` | `TeacherDetailResponse` | `TeacherController.java:122` |
| POST | `/api/v1/teachers/{id}/approve` | ✅ | ADMIN | Path: `id`, Body: `ApproveTeacherRequest?` | `TeacherDetailResponse` | `TeacherController.java:137` |
| POST | `/api/v1/teachers/{id}/reject` | ✅ | ADMIN | Path: `id`, Body: `RejectTeacherRequest`: `{reason}` | `TeacherDetailResponse` | `TeacherController.java:155` |
| GET | `/api/v1/teachers/{id}/courses` | ✅ | Any | Path: `id`, Query: `page`, `size` | `PageResponse<CourseResponse>` | `TeacherController.java:172` |
| GET | `/api/v1/teachers/{id}/students` | ✅ | TEACHER/ADMIN | Path: `id`, Query: `page`, `size` | `PageResponse<StudentResponse>` | `TeacherController.java:189` |
| GET | `/api/v1/teachers/{id}/revenue` | ✅ | TEACHER/ADMIN | Path: `id` | `TeacherRevenueResponse` | `TeacherController.java:206` |
| GET | `/api/v1/teachers/{id}/stats` | ✅ | TEACHER/ADMIN | Path: `id` | `TeacherStatsResponse` | `TeacherController.java:221` |
| DELETE | `/api/v1/teachers/{id}` | ✅ | ADMIN | Path: `id` | `204 No Content` | `TeacherController.java:236` |

---

### 11. COMMUNITY (`/api/v1`)

#### Comments

| Method | Path | Auth | Role | Request Body/Params | Response Shape | Source File |
|--------|------|------|------|-------------------|-----------------|-------------|
| POST | `/api/v1/courses/{courseId}/comments` | ✅ | Any | Path: `courseId`, Body: `CommentCreateRequest`: `{content}` | `CommentResponse` | `CommentController.java:22` |
| POST | `/api/v1/lessons/{lessonId}/comments` | ✅ | Any | Path: `lessonId`, Body: `CommentCreateRequest` | `CommentResponse` | `CommentController.java:30` |
| POST | `/api/v1/comments/{id}/reply` | ✅ | Any | Path: `id`, Body: `CommentCreateRequest` | `CommentResponse` | `CommentController.java:38` |
| GET | `/api/v1/courses/{courseId}/comments` | ❌ | - | Path: `courseId` | `List<CommentResponse>` | `CommentController.java:46` |
| GET | `/api/v1/lessons/{lessonId}/comments` | ❌ | - | Path: `lessonId` | `List<CommentResponse>` | `CommentController.java:53` |
| GET | `/api/v1/comments/{id}/replies` | ❌ | - | Path: `id` | `List<CommentResponse>` | `CommentController.java:60` |
| PUT | `/api/v1/comments/{id}` | ✅ | Any | Path: `id`, Body: `CommentCreateRequest` | `CommentResponse` | `CommentController.java:67` |
| DELETE | `/api/v1/comments/{id}` | ✅ | Any | Path: `id` | `200 OK` | `CommentController.java:75` |

#### Notifications (`/api/v1/notifications`)

| Method | Path | Auth | Role | Request Body/Params | Response Shape | Source File |
|--------|------|------|------|-------------------|-----------------|-------------|
| GET | `/api/v1/notifications` | ✅ | Any | Query: `page`, `size` | `PageResponse<NotificationResponse>` | `NotificationController.java:25` |
| GET | `/api/v1/notifications/{id}` | ✅ | Any | Path: `id` | `NotificationResponse` | `NotificationController.java:50` |
| POST | `/api/v1/notifications/{id}/mark-read` | ✅ | Any | Path: `id` | `200 OK` | `NotificationController.java:57` |
| POST | `/api/v1/notifications/mark-all-read` | ✅ | Any | - | `200 OK` | `NotificationController.java:64` |
| DELETE | `/api/v1/notifications/{id}` | ✅ | Any | Path: `id` | `200 OK` | `NotificationController.java:71` |
| GET | `/api/v1/notifications/count-unread` | ✅ | Any | - | `{count: number}` | `NotificationController.java:78` |

#### Violation Reports (`/api/v1/reports`)

| Method | Path | Auth | Role | Request Body/Params | Response Shape | Source File |
|--------|------|------|------|-------------------|-----------------|-------------|
| POST | `/api/v1/reports` | ✅ | Any | `ViolationReportRequest` | `ViolationReportResponse` | `ViolationReportController.java:24` |
| GET | `/api/v1/reports` | ✅ | Any | Query: `page`, `size` | `PageResponse<ViolationReportResponse>` | `ViolationReportController.java:37` |
| GET | `/api/v1/admin/reports` | ✅ | ADMIN | Query: `page`, `size` | `PageResponse<ViolationReportDetailResponse>` | `ViolationReportController.java:57` |
| GET | `/api/v1/reports/{id}` | ✅ | Any | Path: `id` | `ViolationReportDetailResponse` | `ViolationReportController.java:76` |

---

### 12. PAYMENT / BILLING

**⚠️ CRITICAL GAP:** The `PaymentController` is **EMPTY** (stub class). Payment endpoints are **NOT IMPLEMENTED**.

**Expected Endpoints (Not Yet Implemented):**
- `POST /api/v1/payments/checkout` - Create payment order
- `POST /api/v1/payments/webhook` - Payment provider webhook
- `GET /api/v1/payments/{id}` - Get payment status
- `GET /api/v1/payments` - List payment history
- `POST /api/v1/payments/{id}/confirm` - Confirm payment

**Payment Status Enum:** `PENDING`, `SUCCESS`, `FAILED`, `REFUNDED` (defined in `PaymentStatus.java`)

---

### 13. RECOMMENDATIONS (`/`)

| Method | Path | Auth | Role | Request Body/Params | Response Shape | Source File |
|--------|------|------|------|-------------------|-----------------|-------------|
| GET | `/students/{studentId}/recommendations` | ❌ | - | Path: `studentId` | `ApiResponse<Recommendation[]>` | `RecommendationController.java:20` |
| POST | `/recommendations/{id}/feedback` | ✅ | STUDENT | Path: `id`, Body: `RecommendationFeedbackRequest` | `ApiResponse` | `RecommendationController.java:38` |
| GET | `/admin/recommendations/stats` | ✅ | ADMIN | - | `ApiResponse` | `RecommendationController.java:65` |

**Note:** Recommendation endpoints use root path `/` instead of `/api/v1/`.

---

## C) Frontend Integration Plan

### Service File Structure

```
frontend/src/features/
├── auth/
│   └── services/
│       └── auth.service.ts          ✅ Already exists
├── courses/
│   └── services/
│       └── courses.service.ts       ✅ Already exists (partial)
├── instructor/
│   └── services/
│       └── instructor.service.ts    ✅ Already exists (partial)
├── learner/
│   └── services/
│       └── learner.service.ts       ❌ TODO: Create
├── community/
│   └── services/
│       └── community.service.ts     ❌ TODO: Create
├── payment/
│   └── services/
│       └── payment.service.ts       ❌ TODO: Create (when BE implemented)
└── profile/
    └── services/
        └── profile.service.ts       ❌ TODO: Create
```

---

### Exact Axios Call Snippets

#### 1. Auth Service (`src/features/auth/services/auth.service.ts`)

```typescript
import { apiClient } from "@/services/core/api";
import { setAccessToken, setRefreshToken } from "@/services/core/token";

// ✅ Already implemented
export async function loginUser(payload: { login: string; password: string }) {
  const res = await apiClient.post<ResLoginDTO>("/api/v1/auth/login", payload, { skipAuth: true });
  setAccessToken(res.data.accessToken);
  setRefreshToken(res.data.refreshToken);
  return res.data;
}

// ✅ Already implemented
export async function getCurrentUserInfo() {
  const res = await apiClient.get<MeResponse>("/api/v1/auth/me");
  return res.data;
}

// ❌ TODO: Add refresh token endpoint
export async function refreshToken(refreshToken: string) {
  const res = await apiClient.post<ResLoginDTO>(
    "/api/v1/auth/refresh",
    { refreshToken },
    { skipAuth: true }
  );
  setAccessToken(res.data.accessToken);
  setRefreshToken(res.data.refreshToken);
  return res.data;
}

// ❌ TODO: Add logout
export async function logout(refreshToken: string) {
  await apiClient.post("/api/v1/auth/logout", { refreshToken }, { skipAuth: true });
  clearTokens();
}
```

---

#### 2. Courses Service (`src/features/courses/services/courses.service.ts`)

```typescript
import { apiClient } from "@/services/core/api";
import { PageResponse, CourseResponse, CourseDetailResponse } from "../types";

// ✅ Already implemented (partial)
export async function getCourseCatalog(params?: {
  page?: number;
  size?: number;
  category?: string;
  search?: string;
}) {
  const res = await apiClient.get<PageResponse<CourseResponse>>("/api/v1/courses", { params });
  return res.data;
}

// ✅ Already implemented
export async function getCourseBySlug(slug: string) {
  const res = await apiClient.get<CourseDetailResponse>(`/api/v1/courses/${slug}`);
  return res.data;
}

// ❌ TODO: Add category tree
export async function getCategoryTree() {
  const res = await apiClient.get<CategoryResponseDto[]>("/api/v1/categories/tree");
  return res.data;
}

// ❌ TODO: Add course reviews
export async function getCourseReviews(courseId: number, page = 0, size = 10) {
  const res = await apiClient.get<PageResponse<CourseReviewResponse>>(
    `/api/v1/courses/${courseId}/reviews`,
    { params: { page, size } }
  );
  return res.data;
}

// ❌ TODO: Add rating summary
export async function getCourseRatingSummary(courseId: number) {
  const res = await apiClient.get<RatingSummaryResponse>(
    `/api/v1/courses/${courseId}/rating-summary`
  );
  return res.data;
}
```

---

#### 3. Instructor Service (`src/features/instructor/services/instructor.service.ts`)

```typescript
import { apiClient } from "@/services/core/api";

// ✅ Already implemented
export async function getCurrentTeacher() {
  const res = await apiClient.get<TeacherDetailResponse>("/api/v1/teachers/me");
  return res.data;
}

// ❌ TODO: Add teacher stats
export async function getTeacherStats(teacherId: number) {
  const res = await apiClient.get<TeacherStatsResponse>(`/api/v1/teachers/${teacherId}/stats`);
  return res.data;
}

// ❌ TODO: Add teacher revenue
export async function getTeacherRevenue(teacherId: number) {
  const res = await apiClient.get<TeacherRevenueResponse>(`/api/v1/teachers/${teacherId}/revenue`);
  return res.data;
}

// ❌ TODO: Add teacher courses
export async function getTeacherCourses(teacherId: number, page = 0, size = 10) {
  const res = await apiClient.get<PageResponse<CourseResponse>>(
    `/api/v1/teachers/${teacherId}/courses`,
    { params: { page, size } }
  );
  return res.data;
}
```

---

#### 4. Learner Service (`src/features/learner/services/learner.service.ts`) - **NEW FILE**

```typescript
import { apiClient } from "@/services/core/api";
import { PageResponse } from "@/services/core/api";

// ❌ TODO: Create this file
export async function getStudentCourses(studentId: number, page = 0, size = 10) {
  const res = await apiClient.get<PageResponse<StudentCourseResponse>>(
    `/api/v1/students/${studentId}/courses`,
    { params: { page, size } }
  );
  return res.data;
}

export async function getStudentProgress(studentId: number) {
  const res = await apiClient.get<StudentProgressResponse>(
    `/api/v1/students/${studentId}/progress`
  );
  return res.data;
}

export async function getStudentCertificates(studentId: number, page = 0, size = 10) {
  const res = await apiClient.get<PageResponse<StudentCertificateResponse>>(
    `/api/v1/students/${studentId}/certificates`,
    { params: { page, size } }
  );
  return res.data;
}

// ⚠️ GAP: No enrollment endpoint yet
// export async function enrollInCourse(courseId: number) {
//   const res = await apiClient.post(`/api/v1/enrollments`, { courseId });
//   return res.data;
// }
```

---

#### 5. Community Service (`src/features/community/services/community.service.ts`) - **NEW FILE**

```typescript
import { apiClient } from "@/services/core/api";

// ❌ TODO: Create this file
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

---

#### 6. Profile Service (`src/features/profile/services/profile.service.ts`) - **NEW FILE**

```typescript
import { apiClient } from "@/services/core/api";
import { UploadAvatarResponse } from "../types";

// ❌ TODO: Create this file
export async function getProfile() {
  const res = await apiClient.get<AccountProfileResponse>("/api/v1/accounts/me");
  return res.data;
}

export async function updateProfile(payload: {
  fullName?: string;
  bio?: string;
  birthday?: string;
  gender?: string;
}) {
  const res = await apiClient.put<AccountProfileResponse>("/api/v1/accounts/me", payload);
  return res.data;
}

export async function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await apiClient.post<UploadAvatarResponse>(
    "/api/v1/accounts/me/avatar",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return res.data;
}
```

---

#### 7. Payment Service (`src/features/payment/services/payment.service.ts`) - **NEW FILE (BLOCKED)**

```typescript
// ⚠️ BLOCKED: Payment endpoints not implemented in backend
// Wait for backend implementation before creating this service

// Expected endpoints (when implemented):
// export async function createPaymentOrder(courseId: number) {
//   const res = await apiClient.post("/api/v1/payments/checkout", { courseId });
//   return res.data;
// }
```

---

## D) Gaps & Fixes

### Critical Gaps

1. **Payment Endpoints:** `PaymentController` is empty. No checkout, webhook, or payment history endpoints.
   - **Impact:** Cannot implement payment flow in frontend.
   - **Recommendation:** Implement payment endpoints in backend first.

2. **Enrollment Endpoints:** `EnrollmentController` is empty. No enrollment creation endpoint.
   - **Impact:** Cannot enroll students in courses.
   - **Recommendation:** Implement `POST /api/v1/enrollments` endpoint.

3. **Progress Tracking:** `ProgressController` is empty. No lesson completion tracking.
   - **Impact:** Cannot track student progress.
   - **Recommendation:** Implement progress endpoints.

4. **Certificate Endpoints:** `CertificateController` is empty. No certificate generation/retrieval.
   - **Impact:** Cannot display certificates (though `GET /api/v1/students/{id}/certificates` exists in StudentController).

5. **Student "Me" Endpoint:** No `GET /api/v1/students/me` endpoint.
   - **Workaround:** Use `GET /api/v1/students/{id}` with student's own ID from JWT.
   - **Recommendation:** Add `GET /api/v1/students/me` for consistency with teachers.

### Naming Inconsistencies

1. **Refresh Token Endpoint:** Frontend expects `/api/v1/auth/refresh-token`, but backend uses `/api/v1/auth/refresh`.
   - **Fix:** Update frontend `auth-refresh.ts` to use `/api/v1/auth/refresh`.

2. **Recommendation Endpoints:** Use root path `/` instead of `/api/v1/`.
   - **Fix:** Update frontend to call `/students/{id}/recommendations` (no `/api/v1` prefix).

### Response Shape Inconsistencies

1. **Account Profile Response:** `GET /api/v1/accounts/me` returns `ApiResponse<AccountProfileResponse>` (wrapped), while other endpoints return direct DTOs.
   - **Fix:** Handle wrapper in frontend service.

2. **Recommendation Response:** Uses custom `ApiResponse` wrapper instead of direct DTO.
   - **Fix:** Handle wrapper in frontend service.

### Missing Query Parameters

1. **Course Catalog Filtering:** Backend uses Spring Filter spec (complex), but frontend may need simple query params.
   - **Recommendation:** Document filter spec or add simple query param endpoints.

---

## Quick Reference: Response Types

### Common Response Wrappers

- **PageResponse<T>:** `{items: T[], page: number, size: number, totalItems: number, totalPages: number, hasNext: boolean, hasPrevious: boolean}`
- **ApiResponse<T>:** `{success: boolean, status: number, message: string, code: string, data: T, timestamp: Instant, meta: {...}}`

### Key DTOs

- **ResLoginDTO:** `{accessToken, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt, user: {id, username, email, role, fullName, avatarUrl, langKey}}`
- **MeResponse:** `{accountId, username, email, fullName, status, avatarUrl, role, birthday?, bio?, gender?, lastLoginAt}`
- **CourseResponse:** `{id, title, shortDescription, difficulty, thumbnailUrl, slug, isClosed, categoryId, categoryName, teacherId, teacherName, publicVersionId}`
- **CourseDetailResponse:** `{id, title, shortDescription, difficulty, thumbnailUrl, slug, canonicalUrl, metaTitle, metaDescription, seoKeywords, indexed, isClosed, category: {...}, teacherId, PublicVersionId, tags[]}`

---

## Next Steps

1. ✅ **Update frontend refresh token endpoint** to use `/api/v1/auth/refresh`
2. ❌ **Create learner service** (`src/features/learner/services/learner.service.ts`)
3. ❌ **Create community service** (`src/features/community/services/community.service.ts`)
4. ❌ **Create profile service** (`src/features/profile/services/profile.service.ts`)
5. ❌ **Add category tree endpoint** to courses service
6. ❌ **Add course reviews endpoints** to courses service
7. ⚠️ **Wait for backend:** Payment, enrollment, and progress endpoints
8. ❌ **Add student "me" endpoint** request to backend team (or use workaround)

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-XX

