# API Inventory

**Generated:** 2025-12-25  
**Base URL:** `http://localhost:8080/api/v1`  
**API Version:** v1  
**Documentation:** Swagger UI available at `/swagger-ui.html`

---

## Table of Contents

1. [Base URL & Versioning](#base-url--versioning)
2. [Authentication Flow](#authentication-flow)
3. [Standard Error Format](#standard-error-format)
4. [Pagination Format](#pagination-format)
5. [Upload Flow](#upload-flow)
6. [Endpoint Catalog](#endpoint-catalog)

---

## Base URL & Versioning

- **Base Path:** `/api/v1`
- **All endpoints** are prefixed with `/api/v1`
- **Versioning:** Currently v1. Future versions will use `/api/v2`, etc.

---

## Authentication Flow

### Token-Based Authentication (JWT)

The backend uses **JWT (JSON Web Tokens)** for authentication with OAuth2 Resource Server configuration.

#### Token Placement
- **Header:** `Authorization: Bearer <accessToken>`
- Tokens are **NOT** stored in cookies by default
- Frontend must include the token in the `Authorization` header for protected endpoints

#### Login Flow

**Endpoint:** `POST /api/v1/auth/login`

**Request:**
```json
{
  "login": "username_or_email",
  "password": "password"
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_string",
  "user": {
    "id": 1,
    "accountId": 1,
    "username": "student1",
    "email": "student@example.com",
    "role": "STUDENT"
  }
}
```

#### Refresh Token Flow

**Endpoint:** `POST /api/v1/auth/refresh`

**Request:**
```json
{
  "refreshToken": "refresh_token_string"
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "new_access_token",
  "refreshToken": "new_refresh_token",
  "user": { ... }
}
```

#### Logout Flow

**Endpoint:** `POST /api/v1/auth/logout`

**Request:**
```json
{
  "refreshToken": "refresh_token_to_revoke"
}
```

**Response:** `200 OK` (no body)

#### Get Current User

**Endpoint:** `GET /api/v1/auth/me`

**Auth:** Required (Bearer token)

**Response:** `200 OK`
```json
{
  "id": 1,
  "accountId": 1,
  "username": "student1",
  "email": "student@example.com",
  "role": "STUDENT"
}
```

### Roles

The system supports three roles:

1. **STUDENT** - Can enroll in courses, view lessons, submit assignments
2. **TEACHER** - Can create/manage courses, view students, manage content
3. **ADMIN** - Full system access, user management, course approval

**Role Enforcement:**
- `@AdminOnly` - Requires `ROLE_ADMIN`
- `@TeacherOnly` - Requires `ROLE_TEACHER`
- `@StudentOnly` - Requires `ROLE_STUDENT`
- Methods without annotations require authentication but no specific role

### Public Endpoints (No Auth Required)

The following endpoints are publicly accessible (whitelisted in `SecurityConfiguration`):

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/auth/verify-email`
- `POST /api/v1/auth/password/forgot`
- `POST /api/v1/auth/password/reset`
- `POST /api/v1/auth/resend-verification`
- `GET /api/v1/public/**`
- `/storage/**`
- `/swagger-ui/**`
- `/v3/api-docs/**`

All other endpoints require authentication.

---

## Standard Error Format

All errors follow a consistent `ApiResponse<T>` structure:

```json
{
  "success": false,
  "status": 400,
  "message": "Error description",
  "code": "ERROR_CODE",
  "timestamp": "2025-12-25T10:15:30Z",
  "data": null
}
```

### Error Codes by Status

#### 400 Bad Request
- `VALIDATION_ERROR` - Request validation failed
- `BAD_REQUEST` - General bad request
- `DUPLICATE_RESOURCE` - Resource already exists

**Example:**
```json
{
  "success": false,
  "status": 400,
  "message": "email: must be a well-formed email address; password: size must be between 8 and 50",
  "code": "VALIDATION_ERROR",
  "timestamp": "2025-12-25T10:15:30Z"
}
```

#### 401 Unauthorized
- `UNAUTHORIZED` - Missing or invalid token
- `INVALID_CREDENTIALS` - Wrong username/password
- `TOKEN_EXPIRED` - Access token expired
- `TOKEN_INVALID` - Invalid token format

**Example:**
```json
{
  "success": false,
  "status": 401,
  "message": "User not authenticated",
  "code": "UNAUTHORIZED",
  "timestamp": "2025-12-25T10:15:30Z"
}
```

#### 403 Forbidden
- `FORBIDDEN` - Insufficient permissions
- `ACCESS_DENIED` - Access denied for resource

**Example:**
```json
{
  "success": false,
  "status": 403,
  "message": "Access is denied",
  "code": "FORBIDDEN",
  "timestamp": "2025-12-25T10:15:30Z"
}
```

#### 404 Not Found
- `RESOURCE_NOT_FOUND` - Resource not found
- `ACCOUNT_NOT_FOUND` - Account not found
- `NOT_FOUND` - General not found

**Example:**
```json
{
  "success": false,
  "status": 404,
  "message": "404 Not Found. URL may not exist...:/api/v1/courses/999",
  "code": "NOT_FOUND",
  "timestamp": "2025-12-25T10:15:30Z"
}
```

#### 500 Internal Server Error
- `INTERNAL_ERROR` - Unexpected server error
- `DATABASE_ERROR` - Database operation failed

**Example:**
```json
{
  "success": false,
  "status": 500,
  "message": "Internal server error: Unexpected exception",
  "code": "INTERNAL_ERROR",
  "timestamp": "2025-12-25T10:15:30Z"
}
```

---

## Pagination Format

The backend uses Spring Data's `Pageable` interface with a custom `PageResponse<T>` wrapper.

### Request Parameters

- `page` (int, default: 0) - Page number (0-indexed)
- `size` (int, default: 20) - Items per page
- `sort` (string, optional) - Sort field and direction, e.g., `sort=createdAt,desc` or `sort=title,asc`

**Example Request:**
```
GET /api/v1/courses?page=0&size=20&sort=createdAt,desc
```

### Response Format

```json
{
  "items": [...],
  "page": 0,
  "size": 20,
  "totalItems": 100,
  "totalPages": 5,
  "hasNext": true,
  "hasPrevious": false
}
```

**Fields:**
- `items` (array) - List of items in current page
- `page` (int) - Current page number (0-indexed)
- `size` (int) - Items per page
- `totalItems` (long) - Total number of items across all pages
- `totalPages` (int) - Total number of pages
- `hasNext` (boolean) - Whether there is a next page
- `hasPrevious` (boolean) - Whether there is a previous page

### Filtering

Many endpoints support Spring Filter specification via `@Filter` annotation.

**Filter Syntax:**
- Equality: `categoryName=Design`
- Multiple filters: `categoryName=Design;difficulty=BEGINNER`
- Like: `title=like=React`
- Operators: `=`, `!=`, `>`, `<`, `>=`, `<=`, `like`, `in`, etc.

**Example:**
```
GET /api/v1/courses?filter=categoryName=Design;difficulty=BEGINNER&page=0&size=20
```

---

## Upload Flow

### Avatar Upload

**Endpoint:** `POST /api/v1/accounts/me/avatar`

**Content-Type:** `multipart/form-data`

**Request:**
- `file` (MultipartFile) - Image file

**Constraints:**
- **Max file size:** 10MB (10,485,760 bytes)
- **Allowed types:** `image/jpeg`, `image/png`, `image/webp`
- **Storage:** Cloudinary (configured via `CloudinaryConfig`)

**Response:** `200 OK`
```json
{
  "avatarUrl": "https://res.cloudinary.com/.../avatar.jpg",
  "message": "Avatar uploaded successfully"
}
```

### File Storage (MinIO)

**Endpoint:** `POST /api/v1/storage/upload`

**Content-Type:** `multipart/form-data`

**Request:**
- `file` (MultipartFile) - File to upload

**Storage:** MinIO (configured via `MinioConfig`)
- **Bucket:** `lms-videos` (configurable)
- **Max file size:** 2GB (configured in `application.yml`)

**Response:** `200 OK`
```json
{
  "fileId": 1,
  "fileName": "video.mp4",
  "fileSize": 1048576,
  "downloadUrl": "https://minio.example.com/...",
  "contentType": "video/mp4"
}
```

---

## Endpoint Catalog

### Authentication (`/api/v1/auth`)

| Method | Path | Summary | Auth | Request DTO (Key Fields) | Response DTO (Key Fields) | Errors | Code Reference |
|--------|------|---------|------|--------------------------|---------------------------|--------|----------------|
| POST | `/auth/register` | Register new account | Public | `RegisterRequest`: username, email, password, fullName | `RegisterResponse`: id, username, email | 400 | `AuthController.registerAccount()` |
| POST | `/auth/login` | Login and get tokens | Public | `ReqLoginDTO`: login, password | `ResLoginDTO`: accessToken, refreshToken, user (id, accountId, username, email, role) | 400, 401 | `AuthController.login()` |
| POST | `/auth/refresh` | Refresh access token | Public | `ReqRefreshTokenDTO`: refreshToken | `ResLoginDTO`: accessToken, refreshToken, user | 400, 401 | `AuthController.refreshAccessToken()` |
| POST | `/auth/logout` | Logout and revoke token | Public | `ReqRefreshTokenDTO`: refreshToken | `Void` | 400, 401 | `AuthController.logout()` |
| GET | `/auth/verify-email` | Verify email address | Public | Query: `token` | `Void` | 400 | `AuthController.verifyEmail()` |
| POST | `/auth/password/forgot` | Request password reset | Public | `ForgotPasswordDTO`: email | `Void` | 400 | `AuthController.forgotPassword()` |
| POST | `/auth/password/reset` | Reset password | Public | Query: `token`, Body: `ResetPasswordDTO`: password | `Void` | 400 | `AuthController.resetPassword()` |
| PUT | `/auth/password/change` | Change password | Required | `ChangePasswordDTO`: oldPassword, newPassword | `Void` | 400, 401 | `AuthController.changePassword()` |
| GET | `/auth/me` | Get current user info | Required | - | `MeResponse`: id, accountId, username, email, role | 401 | `AuthController.getCurrentUserInfo()` |
| POST | `/auth/resend-verification` | Resend verification email | Public | `ResendVerifyEmailRequest`: email | `Void` | 400 | `AuthController.resendVerificationEmail()` |

### Account Management (`/api/v1`)

| Method | Path | Summary | Auth | Request DTO | Response DTO | Errors | Code Reference |
|--------|------|---------|------|-------------|--------------|--------|----------------|
| GET | `/accounts/me` | Get current user profile | Required | - | `ApiResponse<AccountProfileResponse>` | 401 | `AccountController.getProfile()` |
| POST | `/accounts/me/avatar` | Upload avatar | Required | MultipartFile | `UploadAvatarResponse` | 400, 401 | `AccountController.uploadAvatar()` |
| PUT | `/accounts/me` | Update profile | Required | `UpdateProfileRequest` | `AccountProfileResponse` | 400, 401 | `AccountController.updateProfile()` |
| GET | `/admin/accounts` | Get all accounts (paginated) | Admin | Query: `filter`, `page`, `size` | `PageResponse<AccountResponse>` | 401, 403 | `AccountController.getAllAccounts()` |
| GET | `/admin/accounts/{id}` | Get account by ID | Admin | - | `ApiResponse<AccountProfileResponse>` | 401, 403, 404 | `AccountController.getAccountById()` |
| PATCH | `/admin/accounts/{id}/approve` | Approve teacher account | Admin | - | `ApiResponse<AccountProfileResponse>` | 401, 403, 404 | `AccountController.approveTeacherAccount()` |
| PATCH | `/admin/accounts/{id}/reject` | Reject teacher account | Admin | `RejectRequest` | `ApiResponse<AccountProfileResponse>` | 401, 403, 404 | `AccountController.rejectTeacherAccount()` |
| PATCH | `/admin/accounts/{id}/status` | Change account status | Admin | `UpdateStatusRequest` | `ApiResponse<AccountProfileResponse>` | 401, 403, 404 | `AccountController.changeAccountStatus()` |
| POST | `/admin/accounts/{id}/suspend` | Suspend account | Admin | `AccountActionRequest` (optional) | `ApiResponse<AccountProfileResponse>` | 401, 403, 404 | `AccountController.suspendAccount()` |
| POST | `/admin/accounts/{id}/unlock` | Unlock account | Admin | `AccountActionRequest` (optional) | `ApiResponse<AccountProfileResponse>` | 401, 403, 404 | `AccountController.unlockAccount()` |
| POST | `/admin/accounts/{id}/deactivate` | Deactivate account | Admin | `AccountActionRequest` (optional) | `ApiResponse<AccountProfileResponse>` | 401, 403, 404 | `AccountController.deactivateAccount()` |
| GET | `/admin/accounts/{id}/logs` | Get account activity logs | Admin | Query: `actionType`, `page`, `size` | `PageResponse<AccountActionLogResponse>` | 401, 403, 404 | `AccountController.getAccountActivityLogs()` |
| DELETE | `/admin/accounts/{id}` | Delete account | Admin | - | `Void` | 401, 403, 404 | `AccountController.deleteAccountById()` |

### Student Management (`/api/v1/students`)

| Method | Path | Summary | Auth | Request DTO | Response DTO | Errors | Pagination | Code Reference |
|--------|------|---------|------|-------------|--------------|--------|-------------|----------------|
| GET | `/students/{id}` | Get student by ID | Required | - | `StudentDetailResponse` | 401, 404 | N | `StudentController.getStudentById()` |
| GET | `/students/code/{code}` | Get student by code | Required | - | `StudentDetailResponse` | 401, 404 | N | `StudentController.getStudentByCode()` |
| PUT | `/students/{id}` | Update student | Required | `UpdateStudentRequest` | `StudentDetailResponse` | 400, 401, 403, 404 | N | `StudentController.updateStudent()` |
| PUT | `/students/{id}/avatar` | Upload student avatar | Required | MultipartFile | `UploadAvatarResponse` | 400, 401, 403 | N | `StudentController.uploadAvatar()` |
| GET | `/students/{id}/courses` | Get student's courses | Required | Query: `page`, `size` | `PageResponse<StudentCourseResponse>` | 401, 404 | Y | `StudentController.getStudentCourses()` |
| GET | `/students/{id}/certificates` | Get student's certificates | Required | Query: `page`, `size` | `PageResponse<StudentCertificateResponse>` | 401, 404 | Y | `StudentController.getStudentCertificates()` |
| DELETE | `/students/{id}` | Delete student (Admin) | Admin | - | `Void` | 401, 403, 404 | N | `StudentController.deleteStudent()` |
| GET | `/students/me` | Get current student profile | Required | - | `StudentDetailResponse` | 401, 404 | N | `StudentController.getCurrentStudent()` |

### Teacher Management (`/api/v1/teachers`)

| Method | Path | Summary | Auth | Request DTO | Response DTO | Errors | Pagination | Code Reference |
|--------|------|---------|------|-------------|--------------|--------|-------------|----------------|
| GET | `/teachers/{id}` | Get teacher by ID | Required | - | `TeacherDetailResponse` | 401, 404 | N | `TeacherController.getTeacherById()` |
| GET | `/teachers/code/{code}` | Get teacher by code | Required | - | `TeacherDetailResponse` | 401, 404 | N | `TeacherController.getTeacherByCode()` |
| PUT | `/teachers/{id}` | Update teacher | Required | `UpdateTeacherRequest` | `TeacherDetailResponse` | 400, 401, 403, 404 | N | `TeacherController.updateTeacher()` |
| PUT | `/teachers/{id}/avatar` | Upload teacher avatar | Required | MultipartFile | `UploadAvatarResponse` | 400, 401, 403 | N | `TeacherController.uploadAvatar()` |
| POST | `/teachers/{id}/request-approval` | Request approval | Required | - | `TeacherDetailResponse` | 401, 404 | N | `TeacherController.requestApproval()` |
| POST | `/teachers/{id}/approve` | Approve teacher | Admin | `ApproveTeacherRequest` (optional) | `TeacherDetailResponse` | 401, 403, 404 | N | `TeacherController.approveTeacher()` |
| POST | `/teachers/{id}/reject` | Reject teacher | Admin | `RejectTeacherRequest` | `TeacherDetailResponse` | 401, 403, 404 | N | `TeacherController.rejectTeacher()` |
| GET | `/teachers/{id}/courses` | Get teacher's courses | Required | Query: `page`, `size` | `PageResponse<CourseResponse>` | 401, 404 | Y | `TeacherController.getTeacherCourses()` |
| GET | `/teachers/{id}/students` | Get teacher's students | Required | Query: `page`, `size` | `PageResponse<StudentResponse>` | 401, 404 | Y | `TeacherController.getTeacherStudents()` |
| GET | `/teachers/{id}/revenue` | Get teacher revenue | Required | - | `TeacherRevenueResponse` | 401, 403, 404 | N | `TeacherController.getTeacherRevenue()` |
| GET | `/teachers/{id}/stats` | Get teacher statistics | Required | - | `TeacherStatsResponse` | 401, 403, 404 | N | `TeacherController.getTeacherStats()` |
| DELETE | `/teachers/{id}` | Delete teacher | Admin | - | `Void` | 401, 403, 404 | N | `TeacherController.deleteTeacher()` |
| GET | `/teachers/me` | Get current teacher profile | Required | - | `TeacherDetailResponse` | 401, 404 | N | `TeacherController.getCurrentTeacher()` |

### Course Management (`/api/v1`)

| Method | Path | Summary | Auth | Request DTO (Key Fields) | Response DTO (Key Fields) | Errors | Pagination | Code Reference |
|--------|------|---------|------|--------------------------|---------------------------|--------|-------------|----------------|
| POST | `/teacher/courses` | Create new course | Teacher | `CourseRequest`: title, shortDescription, categoryId, teacherId, difficulty, isClosed, metaTitle, metaDescription, seoKeywords, thumbnailUrl, tags | `CourseDetailResponse`: id, title, shortDescription, difficulty, slug, thumbnailUrl, category (id, name, code), teacherId, isClosed, tags | 400, 401, 403 | N | `CourseController.createNewCourse()` |
| GET | `/courses/{slug}` | Get course by slug | Public | - | `CourseDetailResponse`: id, title, shortDescription, difficulty, slug, thumbnailUrl, category, teacherId, isClosed, tags, metaTitle, metaDescription, seoKeywords | 404 | N | `CourseController.getCourseBySlug()` |
| GET | `/courses` | Get all active courses | Public | Query: `filter`, `page`, `size`, `sort` | `PageResponse<CourseResponse>`: items (id, title, shortDescription, difficulty, slug, categoryName, teacherName, isClosed), page, size, totalItems, totalPages | - | Y | `CourseController.getCoursesActive()` |
| GET | `/admin/courses` | Get all courses (Admin) | Admin | Query: `filter`, `page`, `size`, `sort` | `PageResponse<CourseResponse>`: items (id, title, shortDescription, difficulty, slug, categoryName, teacherName, isClosed), page, size, totalItems, totalPages | 401, 403 | Y | `CourseController.getAllCourses()` |
| PATCH | `/teacher/courses/{id}/close` | Close course | Teacher | - | `CourseDetailResponse`: id, title, isClosed=true | 401, 403, 404 | N | `CourseController.closeCourse()` |
| PATCH | `/teacher/courses/{id}/open` | Open course | Teacher | - | `CourseDetailResponse`: id, title, isClosed=false | 401, 403, 404 | N | `CourseController.openCourse()` |
| PUT | `/teacher/courses/{id}` | Update course | Teacher | `CourseUpdateRequest`: title, shortDescription, categoryId, difficulty, isClosed, metaTitle, metaDescription, seoKeywords, thumbnailUrl, tags | `CourseDetailResponse`: id, title, shortDescription, difficulty, slug, category, teacherId, isClosed, tags | 400, 401, 403, 404 | N | `CourseController.updateCourse()` |
| DELETE | `/teacher/courses/{id}` | Delete course | Teacher | - | `Void` | 401, 403, 404 | N | `CourseController.deleteCourse()` |
| PATCH | `/teacher/courses/{id}/restore` | Restore deleted course | Teacher | - | `CourseDetailResponse`: id, title, isClosed | 401, 403, 404 | N | `CourseController.restoreCourse()` |
| GET | `/teacher/courses` | Get my courses (Teacher) | Teacher | Query: `filter`, `page`, `size`, `sort` | `PageResponse<CourseResponse>`: items (id, title, shortDescription, difficulty, slug, categoryName, teacherName, isClosed), page, size, totalItems, totalPages | 401, 403 | Y | `CourseController.getMyCourses()` |

### Category Management (`/api/v1`)

| Method | Path | Summary | Auth | Request DTO | Response DTO | Errors | Code Reference |
|--------|------|---------|------|-------------|--------------|--------|----------------|
| POST | `/admin/categories` | Create category | Admin | `CategoryRequest` | `CategoryResponseDto` | 400, 401, 403 | `CategoryController.createCategory()` |
| GET | `/categories/{id}` | Get category by ID | Public | - | `CategoryResponseDto` | 404 | `CategoryController.getCategoryById()` |
| GET | `/admin/categories/{id}` | Get category by ID (Admin) | Admin | - | `CategoryResponseDto` | 401, 403, 404 | `CategoryController.getCategoryByIdForAdmin()` |
| GET | `/categories/tree` | Get category tree | Public | - | `List<CategoryResponseDto>` | - | `CategoryController.getCategoryTree()` |
| GET | `/admin/categories/deleted` | Get deleted categories | Admin | - | `List<CategoryResponseDto>` | 401, 403 | `CategoryController.getAllDeleted()` |
| DELETE | `/admin/categories/{id}` | Delete category | Admin | - | `Void` | 401, 403, 404 | `CategoryController.deleteCategory()` |
| PATCH | `/admin/categories/{id}/restore` | Restore category | Admin | - | `CategoryResponseDto` | 401, 403, 404 | `CategoryController.restoreCategory()` |
| PUT | `/admin/categories/{id}` | Update category | Admin | `CategoryRequest` | `CategoryResponseDto` | 400, 401, 403, 404 | `CategoryController.updateCategory()` |
| GET | `/categories/slug/{slug}` | Get category by slug | Public | - | `CategoryResponseDto` | 404 | `CategoryController.getCategoryBySlug()` |

### Enrollment Management (`/api/v1`)

| Method | Path | Summary | Auth | Request DTO | Response DTO | Errors | Pagination | Code Reference |
|--------|------|---------|------|-------------|--------------|--------|-------------|----------------|
| POST | `/courses/{courseId}/enroll` | Enroll in course | Student | `EnrollCourseRequest` | `EnrollmentDetailResponse` | 400, 401, 403 | N | `EnrollmentController.enrollCourse()` |
| GET | `/students/{studentId}/enrollments` | Get student enrollments | Student | Query: `page`, `size` | `PageResponse<EnrollmentResponse>` | 401, 403 | Y | `EnrollmentController.getStudentEnrollments()` |
| GET | `/courses/{courseId}/enrollments` | Get course enrollments | Teacher | Query: `page`, `size` | `PageResponse<EnrollmentResponse>` | 401, 403 | Y | `EnrollmentController.getCourseEnrollments()` |
| GET | `/enrollments/{id}` | Get enrollment details | Required | - | `EnrollmentDetailResponse` | 401, 404 | N | `EnrollmentController.getEnrollmentDetail()` |
| POST | `/enrollments/{id}/cancel` | Cancel enrollment | Student | `CancelEnrollmentRequest` | `EnrollmentDetailResponse` | 400, 401, 403, 404 | N | `EnrollmentController.cancelEnrollment()` |
| POST | `/enrollments/{id}/complete` | Complete enrollment | Teacher | - | `EnrollmentDetailResponse` | 401, 403, 404 | N | `EnrollmentController.completeEnrollment()` |
| GET | `/courses/{courseId}/enrollment-stats` | Get enrollment stats | Teacher | - | `EnrollmentStatsResponse` | 401, 403, 404 | N | `EnrollmentController.getEnrollmentStats()` |

### Progress Management (`/api/v1`)

| Method | Path | Summary | Auth | Request DTO | Response DTO | Errors | Code Reference |
|--------|------|---------|------|-------------|--------------|--------|----------------|
| GET | `/students/{studentId}/progress` | Get student overall progress | Student | - | `StudentProgressOverviewResponse` | 401, 403, 404 | `ProgressController.getStudentProgress()` |
| GET | `/students/{studentId}/courses/{courseId}/progress` | Get student course progress | Student | - | `CourseProgressResponse` | 401, 403, 404 | `ProgressController.getStudentCourseProgress()` |
| GET | `/students/{studentId}/lessons/{lessonId}/progress` | Get student lesson progress | Student | - | `LessonProgressResponse` | 401, 403, 404 | `ProgressController.getStudentLessonProgress()` |
| POST | `/lessons/{lessonId}/mark-viewed` | Mark lesson as viewed | Student | - | `LessonProgressResponse` | 401, 403, 404 | `ProgressController.markLessonAsViewed()` |
| POST | `/lessons/{lessonId}/mark-completed` | Mark lesson as completed | Student | - | `LessonProgressResponse` | 401, 403, 404 | `ProgressController.markLessonAsCompleted()` |
| GET | `/courses/{courseId}/progress-stats` | Get course progress stats | Teacher | - | `CourseProgressStatsResponse` | 401, 403, 404 | `ProgressController.getCourseProgressStats()` |

### Course Reviews (`/api/v1`)

| Method | Path | Summary | Auth | Request DTO | Response DTO | Errors | Pagination | Code Reference |
|--------|------|---------|------|-------------|--------------|--------|-------------|----------------|
| POST | `/courses/{courseId}/reviews` | Create review | Student | `CourseReviewRequest` | `CourseReviewResponse` | 400, 401, 403 | N | `CourseReviewController.createNewReview()` |
| GET | `/courses/{courseId}/reviews` | Get course reviews | Public | Query: `page`, `size` | `PageResponse<CourseReviewResponse>` | 404 | Y | `CourseReviewController.getCourseReviews()` |
| PUT | `/courses/{courseId}/reviews/{reviewId}` | Update review | Student | `CourseReviewRequest` | `CourseReviewResponse` | 400, 401, 403, 404 | N | `CourseReviewController.updateReview()` |
| DELETE | `/courses/{courseId}/reviews/{reviewId}` | Delete review | Student | - | `Void` | 401, 403, 404 | N | `CourseReviewController.deleteReview()` |
| GET | `/courses/{courseId}/rating-summary` | Get rating summary | Public | - | `RatingSummaryResponse` | 404 | N | `CourseReviewController.getRatingSummary()` |

### Recommendations (`/api/v1`)

| Method | Path | Summary | Auth | Request DTO | Response DTO | Errors | Code Reference |
|--------|------|---------|------|-------------|--------------|--------|----------------|
| GET | `/students/{studentId}/recommendations` | Get recommendations | Required | - | `ApiResponse<List<Recommendation>>` | 401, 404 | `RecommendationController.getRecommendations()` |
| POST | `/recommendations/{id}/feedback` | Submit feedback | Required | `RecommendationFeedbackRequest` | `ApiResponse<Void>` | 400, 401, 404 | `RecommendationController.giveFeedback()` |
| GET | `/admin/recommendations/stats` | Get recommendation stats | Admin | - | `ApiResponse<String>` | 401, 403 | `RecommendationController.getStats()` |

### Comments (`/api/v1`)

| Method | Path | Summary | Auth | Request DTO | Response DTO | Errors | Code Reference |
|--------|------|---------|------|-------------|--------------|--------|----------------|
| POST | `/courses/{courseId}/comments` | Create course comment | Required | `CommentCreateRequest` | `CommentResponse` | 400, 401 | `CommentController.createCourseComment()` |
| POST | `/lessons/{lessonId}/comments` | Create lesson comment | Required | `CommentCreateRequest` | `CommentResponse` | 400, 401 | `CommentController.createLessonComment()` |
| POST | `/comments/{id}/reply` | Reply to comment | Required | `CommentCreateRequest` | `CommentResponse` | 400, 401, 404 | `CommentController.replyToComment()` |
| GET | `/courses/{courseId}/comments` | Get course comments | Public | - | `List<CommentResponse>` | 404 | `CommentController.getCourseComments()` |
| GET | `/lessons/{lessonId}/comments` | Get lesson comments | Public | - | `List<CommentResponse>` | 404 | `CommentController.getLessonComments()` |
| GET | `/comments/{id}/replies` | Get comment replies | Public | - | `List<CommentResponse>` | 404 | `CommentController.getReplies()` |
| PUT | `/comments/{id}` | Update comment | Required | `CommentCreateRequest` | `CommentResponse` | 400, 401, 403, 404 | `CommentController.update()` |
| DELETE | `/comments/{id}` | Delete comment | Required | - | `ResponseEntity<?>` | 401, 403, 404 | `CommentController.delete()` |

### Assessment/Quiz (`/api/v1`)

| Method | Path | Summary | Auth | Request DTO | Response DTO | Errors | Code Reference |
|--------|------|---------|------|-------------|--------------|--------|----------------|
| POST | `/lessons/{lessonId}/quizzes` | Create quiz | Teacher/Admin | `QuizRequest` | `QuizResponse` | 400, 401, 403 | `QuizController.createQuiz()` |
| GET | `/lessons/{lessonId}/quizzes` | Get quizzes by lesson | Public | - | `List<QuizResponse>` | 404 | `QuizController.getAllQuizzes()` |
| GET | `/quizzes/{id}` | Get quiz by ID | Public | - | `QuizResponse` | 404 | `QuizController.getQuiz()` |
| PUT | `/quizzes/{id}` | Update quiz | Teacher/Admin | `QuizRequest` | `QuizResponse` | 400, 401, 403, 404 | `QuizController.updateQuiz()` |
| DELETE | `/quizzes/{id}` | Delete quiz | Teacher/Admin | - | `Void` | 401, 403, 404 | `QuizController.deleteQuiz()` |
| POST | `/quizzes/{id}/add-questions` | Add questions to quiz | Teacher/Admin | `AddQuestionsRequest` | `QuizResponse` | 400, 401, 403, 404 | `QuizController.addQuestionsToQuiz()` |
| DELETE | `/quizzes/{id}/questions/{questionId}` | Remove question from quiz | Teacher/Admin | - | `Void` | 401, 403, 404 | `QuizController.removeQuestionFromQuiz()` |

### Notifications (`/api/v1`)

| Method | Path | Summary | Auth | Request DTO | Response DTO | Errors | Pagination | Code Reference |
|--------|------|---------|------|-------------|--------------|--------|-------------|----------------|
| GET | `/notifications` | Get notifications | Required | Query: `page`, `size` | `PageResponse<NotificationResponse>` | 401 | Y | `NotificationController.getNotifications()` |
| GET | `/notifications/count-unread` | Get unread count | Required | - | `{ count: number }` | 401 | N | `NotificationController.getUnreadCount()` |
| POST | `/notifications/{id}/mark-read` | Mark as read | Required | - | `Void` | 401, 404 | N | `NotificationController.markAsRead()` |
| POST | `/notifications/mark-all-read` | Mark all as read | Required | - | `Void` | 401 | N | `NotificationController.markAllAsRead()` |
| DELETE | `/notifications/{id}` | Delete notification | Required | - | `Void` | 401, 404 | N | `NotificationController.deleteNotification()` |

---

## Notes

1. **Filter Specification:** Many endpoints support Spring Filter via `@Filter` annotation. Use `filter=field=value` syntax.
2. **Role-Based Access:** Check `@AdminOnly`, `@TeacherOnly`, `@StudentOnly` annotations for role requirements.
3. **File Uploads:** Avatar uploads use Cloudinary; other files use MinIO.
4. **Pagination Defaults:** Most paginated endpoints default to `page=0`, `size=20`.
5. **Error Handling:** All errors follow `ApiResponse<T>` format with consistent fields.

---

**Last Updated:** 2025-12-25  
**Maintained By:** Backend Team

