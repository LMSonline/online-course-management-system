# API Inventory

**Generated:** 2025-12-25  
**Documentation:** Swagger UI available at `/swagger-ui.html`

---

## Table of Contents

1. [Environment & Base URL](#environment--base-url)
2. [Authentication & Authorization](#authentication--authorization)
3. [Response & Error Format](#response--error-format)
4. [Pagination Format](#pagination-format)
5. [Upload Flow](#upload-flow)
6. [Endpoint Catalog](#endpoint-catalog)

---

## Environment & Base URL

### Service Architecture

**Single Spring Boot service in this repository.** No API gateway or microservices architecture is present.

### Base URL Configuration

- **BASE_URL:** `http://localhost:8080` (from `application.yml` `app.base-url`, configurable via `APP_BASE_URL` env var)
- **API_VERSION:** `/api/v1` (from `application.yml` `app.api-version`)
- **Full API Base URL:** `http://localhost:8080/api/v1`

**Code Reference:**
- Base URL: `backend/lms/src/main/resources/application.yml` (line 59)
- API Version: `backend/lms/src/main/resources/application.yml` (line 61)

### Example Endpoint URLs

- Login: `http://localhost:8080/api/v1/auth/login`
- Get Courses: `http://localhost:8080/api/v1/courses`
- Get Course by Slug: `http://localhost:8080/api/v1/courses/{slug}`

**Note:** For production, set `APP_BASE_URL` environment variable to the actual server URL.

---

## Authentication & Authorization

### JWT Token-Based Authentication

The backend uses **JWT (JSON Web Tokens)** with Spring Security OAuth2 Resource Server configuration.

**Code References:**
- Security Configuration: `backend/lms/src/main/java/vn/uit/lms/config/SecurityConfiguration.java`
- JWT Configuration: `backend/lms/src/main/java/vn/uit/lms/config/SecurityJwtConfiguration.java`

### Sending JWT Token

**For all protected endpoints**, include the JWT access token in the `Authorization` header:

```
Authorization: Bearer <accessToken>
```

**Example:**
```http
GET /api/v1/accounts/me HTTP/1.1
Host: localhost:8080
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Code Reference:** Tokens are validated by Spring Security JWT decoder configured in `SecurityJwtConfiguration.java` (line 73-86).

### Login Endpoint

**Endpoint:** `POST /api/v1/auth/login`

**Code Reference:** `backend/lms/src/main/java/vn/uit/lms/controller/auth/AuthController.java#login()`

**Request:**
```json
{
  "login": "username_or_email",
  "password": "password"
}
```

**Response:** `200 OK` (wrapped in `ApiResponse<ResLoginDTO>`)
```json
{
  "success": true,
  "status": 200,
  "message": "Request processed successfully: Login successful",
  "code": "SUCCESS",
  "timestamp": "2025-12-25T10:15:30Z",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_string",
    "user": {
      "id": 1,
      "accountId": 1,
      "username": "student1",
      "email": "student@example.com",
      "role": "STUDENT"
    }
  },
  "meta": {
    "author": "© 2025 Group 5 / VN.UIT.LMS",
    "license": "Proprietary API – All rights reserved",
    "version": "v1.0.0"
  }
}
```

### Refresh Token Endpoint

**Endpoint:** `POST /api/v1/auth/refresh`

**Code Reference:** `backend/lms/src/main/java/vn/uit/lms/controller/auth/AuthController.java#refreshAccessToken()`

**Status:** ✅ **Implemented** - Refresh token endpoint exists in code.

**Request:**
```json
{
  "refreshToken": "refresh_token_string"
}
```

**Response:** `200 OK` (same structure as login response with new tokens)

**Token Expiration:**
- Access Token: 86400 seconds (24 hours) - from `application.yml` `jwt.access-token.expiration`
- Refresh Token: 100000 seconds (~27.8 hours) - from `application.yml` `jwt.refresh-token.expiration`

### Logout Endpoint

**Endpoint:** `POST /api/v1/auth/logout`

**Code Reference:** `backend/lms/src/main/java/vn/uit/lms/controller/auth/AuthController.java#logout()`

**Request:**
```json
{
  "refreshToken": "refresh_token_to_revoke"
}
```

**Response:** `200 OK` (no body or empty response)

### Get Current User

**Endpoint:** `GET /api/v1/auth/me`

**Code Reference:** `backend/lms/src/main/java/vn/uit/lms/controller/auth/AuthController.java#getCurrentUserInfo()`

**Auth:** Required (Bearer token)

**Response:** `200 OK` (wrapped in `ApiResponse<MeResponse>`)
```json
{
  "success": true,
  "status": 200,
  "message": "Request processed successfully: Get current user info",
  "code": "SUCCESS",
  "timestamp": "2025-12-25T10:15:30Z",
  "data": {
    "id": 1,
    "accountId": 1,
    "username": "student1",
    "email": "student@example.com",
    "role": "STUDENT"
  }
}
```

### Role-Based Access Control

The system supports three roles:

1. **STUDENT** (`ROLE_STUDENT`) - Can enroll in courses, view lessons, submit assignments
2. **TEACHER** (`ROLE_TEACHER`) - Can create/manage courses, view students, manage content
3. **ADMIN** (`ROLE_ADMIN`) - Full system access, user management, course approval

**Role Enforcement:**

Role enforcement is implemented via custom annotations and Spring Security:

- `@AdminOnly` - Requires `ROLE_ADMIN` (code: `backend/lms/src/main/java/vn/uit/lms/shared/util/annotation/AdminOnly.java`)
- `@TeacherOnly` - Requires `ROLE_TEACHER` (code: `backend/lms/src/main/java/vn/uit/lms/shared/util/annotation/TeacherOnly.java`)
- `@StudentOnly` - Requires `ROLE_STUDENT` (code: `backend/lms/src/main/java/vn/uit/lms/shared/util/annotation/StudentOnly.java`)
- Methods without annotations require authentication but no specific role

**JWT Authority Mapping:**

JWT tokens contain a `role` claim that is mapped to Spring Security authorities with `ROLE_` prefix.

**Code Reference:** `backend/lms/src/main/java/vn/uit/lms/config/SecurityJwtConfiguration.java#jwtAuthenticationConverter()` (line 52-61)

### Public Endpoints (No Auth Required)

The following endpoints are publicly accessible (whitelisted in `SecurityConfiguration`):

**Code Reference:** `backend/lms/src/main/java/vn/uit/lms/config/SecurityConfiguration.java` (line 30-46)

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
- `/actuator/health`

All other endpoints require authentication (Bearer token in `Authorization` header).

---

## Response & Error Format

### Success Response Wrapper

All successful responses (200, 201, etc.) are automatically wrapped in `ApiResponse<T>` structure by `FormatRestResponse` advice.

**Code References:**
- Response Wrapper: `backend/lms/src/main/java/vn/uit/lms/shared/dto/ApiResponse.java`
- Response Formatter: `backend/lms/src/main/java/vn/uit/lms/shared/util/FormatRestResponse.java`

**Success Response Structure:**
```json
{
  "success": true,
  "status": 200,
  "message": "Request processed successfully: [optional message from @ApiMessage]",
  "code": "SUCCESS",
  "timestamp": "2025-12-25T10:15:30Z",
  "data": {
    // Actual response data (varies by endpoint)
  },
  "meta": {
    "author": "© 2025 Group 5 / VN.UIT.LMS",
    "license": "Proprietary API – All rights reserved",
    "version": "v1.0.0"
  }
}
```

**Example - Get Course:**
```json
{
  "success": true,
  "status": 200,
  "message": "Request processed successfully: Course retrieved successfully",
  "code": "SUCCESS",
  "timestamp": "2025-12-25T10:15:30Z",
  "data": {
    "id": 1,
    "title": "Introduction to Java Programming",
    "slug": "introduction-to-java-programming",
    "shortDescription": "Learn Java from scratch",
    "difficulty": "BEGINNER",
    "thumbnailUrl": "https://example.com/images/java-course.jpg"
  }
}
```

### Error Response Format

All errors follow the same `ApiResponse<Object>` structure with `success: false`.

**Code Reference:** `backend/lms/src/main/java/vn/uit/lms/shared/handler/GlobalException.java`

**Error Response Structure:**
```json
{
  "success": false,
  "status": <HTTP_STATUS_CODE>,
  "message": "<Error description>",
  "code": "<ERROR_CODE>",
  "timestamp": "2025-12-25T10:15:30Z",
  "data": null
}
```

### Error Examples by Status Code

#### 400 Bad Request

**Code Reference:** `GlobalException.java#handleBusinessExceptions()` (line 55-66) and `handleValidationError()` (line 71-90)

**Validation Error Example:**
```json
{
  "success": false,
  "status": 400,
  "message": "email: must be a well-formed email address; password: size must be between 8 and 50",
  "code": "VALIDATION_ERROR",
  "timestamp": "2025-12-25T10:15:30Z",
  "data": null
}
```

**Business Exception Example:**
```json
{
  "success": false,
  "status": 400,
  "message": "Exception occurred: Resource already exists",
  "code": "BAD_REQUEST",
  "timestamp": "2025-12-25T10:15:30Z",
  "data": null
}
```

**Error Codes:** `VALIDATION_ERROR`, `BAD_REQUEST`, `DUPLICATE_RESOURCE`

**Code Reference:** `backend/lms/src/main/java/vn/uit/lms/shared/constant/ErrorCode.java`

#### 401 Unauthorized

**Code Reference:** `GlobalException.java#handleUnauthorizedException()` (line 134-146)

**Example:**
```json
{
  "success": false,
  "status": 401,
  "message": "User not authenticated",
  "code": "UNAUTHORIZED",
  "timestamp": "2025-12-25T10:15:30Z",
  "data": null
}
```

**Error Codes:** `UNAUTHORIZED`, `INVALID_CREDENTIALS`, `TOKEN_EXPIRED`, `TOKEN_INVALID`

#### 403 Forbidden

**Code Reference:** `GlobalException.java#handleAccessDeniedException()` (line 151-163)

**Example:**
```json
{
  "success": false,
  "status": 403,
  "message": "Access is denied",
  "code": "FORBIDDEN",
  "timestamp": "2025-12-25T10:15:30Z",
  "data": null
}
```

**Error Codes:** `FORBIDDEN`, `ACCESS_DENIED`

#### 404 Not Found

**Code Reference:** `GlobalException.java#handleNoResourceFoundException()` (line 165-174)

**Example:**
```json
{
  "success": false,
  "status": 404,
  "message": "404 Not Found. URL may not exist...:/api/v1/courses/999",
  "code": "NOT_FOUND",
  "timestamp": "2025-12-25T10:15:30Z",
  "data": null
}
```

**Error Codes:** `NOT_FOUND`, `RESOURCE_NOT_FOUND`, `ACCOUNT_NOT_FOUND`

#### 422 Unprocessable Entity (Validation)

**Note:** Validation errors typically return 400 with `VALIDATION_ERROR` code. If Spring returns 422, it follows the same `ApiResponse` structure.

**Example:**
```json
{
  "success": false,
  "status": 422,
  "message": "field: validation message; anotherField: another validation message",
  "code": "VALIDATION_ERROR",
  "timestamp": "2025-12-25T10:15:30Z",
  "data": null
}
```

#### 500 Internal Server Error

**Code Reference:** `GlobalException.java#handleAllExceptions()` (line 117-129)

**Example:**
```json
{
  "success": false,
  "status": 500,
  "message": "Internal server error: Unexpected exception",
  "code": "INTERNAL_ERROR",
  "timestamp": "2025-12-25T10:15:30Z",
  "data": null
}
```

**Error Codes:** `INTERNAL_ERROR`, `DATABASE_ERROR`

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

| Method | Path | Summary | Auth | Request DTO (Key Fields) | Response DTO (Key Fields) | Errors | Code Reference |
|--------|------|---------|------|--------------------------|---------------------------|--------|----------------|
| POST | `/lessons/{lessonId}/quizzes` | Create quiz | Teacher/Admin | `QuizRequest`: title, description, totalPoints, timeLimitMinutes, maxAttempts, randomizeQuestions, randomizeOptions, passingScore | `QuizResponse`: id, title, description, totalPoints, timeLimitMinutes, maxAttempts, lessonId | 400, 401, 403 | `QuizController.createQuiz()` |
| GET | `/lessons/{lessonId}/quizzes` | Get quizzes by lesson | Public | - | `List<QuizResponse>`: id, title, description, totalPoints, timeLimitMinutes, maxAttempts, lessonId | 404 | `QuizController.getAllQuizzes()` |
| GET | `/quizzes/{id}` | Get quiz by ID | Public | - | `QuizResponse`: id, title, description, totalPoints, timeLimitMinutes, maxAttempts, lessonId, questions | 404 | `QuizController.getQuiz()` |
| PUT | `/quizzes/{id}` | Update quiz | Teacher/Admin | `QuizRequest`: title, description, totalPoints, timeLimitMinutes, maxAttempts, randomizeQuestions, randomizeOptions, passingScore | `QuizResponse`: id, title, description, totalPoints, timeLimitMinutes, maxAttempts | 400, 401, 403, 404 | `QuizController.updateQuiz()` |
| DELETE | `/quizzes/{id}` | Delete quiz | Teacher/Admin | - | `Void` | 401, 403, 404 | `QuizController.deleteQuiz()` |
| POST | `/quizzes/{id}/add-questions` | Add questions to quiz | Teacher/Admin | `AddQuestionsRequest`: questionIds | `QuizResponse`: id, title, questions | 400, 401, 403, 404 | `QuizController.addQuestionsToQuiz()` |
| DELETE | `/quizzes/{id}/questions/{questionId}` | Remove question from quiz | Teacher/Admin | - | `Void` | 401, 403, 404 | `QuizController.removeQuestionFromQuiz()` |
| POST | `/quizzes/{id}/start` | Start quiz attempt | Required | - | `QuizAttemptResponse`: id, quizId, studentId, startedAt, status | 401, 404 | `QuizAttemptController.startQuiz()` |
| POST | `/quizzes/{quizId}/attempts/{attemptId}/submit-answer` | Submit answer | Required | `SubmitAnswerRequest`: questionId, selectedOptionId, answerText, selectedOptionIds | `Void` | 400, 401, 404 | `QuizAttemptController.submitAnswer()` |
| POST | `/quizzes/{quizId}/attempts/{attemptId}/finish` | Finish quiz attempt | Required | - | `QuizAttemptResponse`: id, quizId, studentId, score, totalPoints, completedAt, status | 401, 404 | `QuizAttemptController.finishQuiz()` |
| GET | `/students/{studentId}/quiz-attempts` | Get student quiz attempts | Required | - | `List<QuizAttemptResponse>`: id, quizId, studentId, score, status, completedAt | 401, 404 | `QuizAttemptController.getStudentQuizAttempts()` |
| GET | `/quizzes/{id}/results` | Get quiz results | Required | - | `List<QuizAttemptResponse>`: id, studentId, score, totalPoints, completedAt | 401, 403, 404 | `QuizAttemptController.getQuizResults()` |
| POST | `/question-banks/{bankId}/questions` | Create question | Teacher/Admin | `QuestionRequest`: content, type, maxPoints, answerOptions (text, isCorrect, orderIndex) | `QuestionResponse`: id, content, type, maxPoints, answerOptions | 400, 401, 403 | `QuestionController.createQuestion()` |
| GET | `/question-banks/{bankId}/questions` | Get questions by bank | Teacher/Admin | - | `List<QuestionResponse>`: id, content, type, maxPoints, answerOptions | 401, 403 | `QuestionController.getAllQuestions()` |
| GET | `/questions/{id}` | Get question by ID | Teacher/Admin | - | `QuestionResponse`: id, content, type, maxPoints, answerOptions | 401, 403, 404 | `QuestionController.getQuestion()` |
| PUT | `/questions/{id}` | Update question | Teacher/Admin | `QuestionRequest`: content, type, maxPoints, answerOptions | `QuestionResponse`: id, content, type, maxPoints, answerOptions | 400, 401, 403, 404 | `QuestionController.updateQuestion()` |
| DELETE | `/questions/{id}` | Delete question | Teacher/Admin | - | `Void` | 401, 403, 404 | `QuestionController.deleteQuestion()` |
| POST | `/questions/{id}/answer-options` | Manage answer options | Teacher/Admin | `List<AnswerOptionRequest>`: text, isCorrect, orderIndex | `QuestionResponse`: id, answerOptions | 400, 401, 403, 404 | `QuestionController.manageAnswerOptions()` |
| POST | `/teachers/{teacherId}/question-banks` | Create question bank | Teacher/Admin | `QuestionBankRequest`: name, description | `QuestionBankResponse`: id, name, description, teacherId | 400, 401, 403 | `QuestionBankController.createQuestionBank()` |
| GET | `/teachers/{teacherId}/question-banks` | Get question banks by teacher | Teacher/Admin | - | `List<QuestionBankResponse>`: id, name, description, teacherId, questionCount | 401, 403 | `QuestionBankController.getAllQuestionBanks()` |
| GET | `/question-banks/{id}` | Get question bank by ID | Teacher/Admin | - | `QuestionBankResponse`: id, name, description, teacherId, questions | 401, 403, 404 | `QuestionBankController.getQuestionBank()` |
| PUT | `/question-banks/{id}` | Update question bank | Teacher/Admin | `QuestionBankRequest`: name, description | `QuestionBankResponse`: id, name, description | 400, 401, 403, 404 | `QuestionBankController.updateQuestionBank()` |
| DELETE | `/question-banks/{id}` | Delete question bank | Teacher/Admin | - | `Void` | 401, 403, 404 | `QuestionBankController.deleteQuestionBank()` |

### Notifications (`/api/v1`)

| Method | Path | Summary | Auth | Request DTO (Key Fields) | Response DTO (Key Fields) | Errors | Pagination | Code Reference |
|--------|------|---------|------|--------------------------|---------------------------|--------|-------------|----------------|
| GET | `/notifications` | Get notifications | Required | Query: `page`, `size` | `PageResponse<NotificationResponse>`: items (id, title, message, type, read, createdAt), page, size, totalItems, totalPages | 401 | Y | `NotificationController.getNotifications()` |
| GET | `/notifications/count-unread` | Get unread count | Required | - | `{ count: number }` | 401 | N | `NotificationController.getUnreadCount()` |
| POST | `/notifications/{id}/mark-read` | Mark as read | Required | - | `Void` | 401, 404 | N | `NotificationController.markAsRead()` |
| POST | `/notifications/mark-all-read` | Mark all as read | Required | - | `Void` | 401 | N | `NotificationController.markAllAsRead()` |
| DELETE | `/notifications/{id}` | Delete notification | Required | - | `Void` | 401, 404 | N | `NotificationController.deleteNotification()` |
| POST | `/admin/notifications/send-bulk` | Send bulk notifications | Admin | `SendBulkNotificationRequest`: title, message, targetRoles, targetUserIds | `Void` | 400, 401, 403 | N | `NotificationAdminController.sendBulk()` |
| POST | `/admin/notification-channels` | Create notification channel | Admin | `NotificationChannelCreateRequest`: notificationId, channel, status | `NotificationChannel`: id, notification, channel, status | 400, 401, 403 | N | `NotificationChannelController.create()` |
| GET | `/admin/notification-channels` | List notification channels | Admin | - | `List<NotificationChannel>`: id, notification, channel, status | 401, 403 | N | `NotificationChannelController.list()` |
| PUT | `/admin/notification-channels/{id}` | Update notification channel | Admin | `NotificationChannelCreateRequest`: notificationId, channel, status | `NotificationChannel`: id, notification, channel, status | 400, 401, 403, 404 | N | `NotificationChannelController.update()` |

### Assignments (`/api/v1`)

| Method | Path | Summary | Auth | Request DTO (Key Fields) | Response DTO (Key Fields) | Errors | Code Reference |
|--------|------|---------|------|--------------------------|---------------------------|--------|----------------|
| POST | `/lessons/{lessonId}/assignments` | Create assignment | Teacher | `AssignmentRequest`: title, assignmentType, description, totalPoints, timeLimitMinutes, maxAttempts | `AssignmentResponse`: id, lessonId, title, assignmentType, description, totalPoints, timeLimitMinutes, maxAttempts, createdAt | 400, 401, 403 | `AssignmentController.createAssignment()` |
| GET | `/lessons/{lessonId}/assignments` | Get assignments by lesson | Required | - | `List<AssignmentResponse>`: id, lessonId, title, assignmentType, description, totalPoints, createdAt | 404 | `AssignmentController.getAssignmentsByLesson()` |
| GET | `/assignments/{id}` | Get assignment by ID | Required | - | `AssignmentResponse`: id, lessonId, title, assignmentType, description, totalPoints, timeLimitMinutes, maxAttempts, createdAt, updatedAt | 404 | `AssignmentController.getAssignmentById()` |
| PUT | `/assignments/{id}` | Update assignment | Teacher | `AssignmentRequest`: title, assignmentType, description, totalPoints, timeLimitMinutes, maxAttempts | `AssignmentResponse`: id, lessonId, title, assignmentType, description, totalPoints, updatedAt | 400, 401, 403, 404 | `AssignmentController.updateAssignment()` |
| DELETE | `/assignments/{id}` | Delete assignment | Teacher | - | `Void` | 401, 403, 404 | `AssignmentController.deleteAssignment()` |
| GET | `/assignments/{id}/submissions` | Get assignment submissions | Teacher | - | `List<SubmissionResponse>`: id, assignmentId, studentId, studentName, submittedAt, content, score, status | 401, 403, 404 | `AssignmentController.getAssignmentSubmissions()` |
| POST | `/assignments/{assignmentId}/submit` | Submit assignment | Required | - | `SubmissionResponse`: id, assignmentId, studentId, submittedAt, content, status, attemptNumber | 400, 401, 403, 404 | `SubmissionController.submitAssignment()` |
| GET | `/assignments/{assignmentId}/submissions` | Get submissions by assignment | Required | - | `List<SubmissionResponse>`: id, assignmentId, studentId, studentName, submittedAt, content, score, status | 401, 404 | `SubmissionController.getSubmissionsByAssignment()` |
| GET | `/submissions/{id}` | Get submission by ID | Required | - | `SubmissionResponse`: id, assignmentId, studentId, studentName, submittedAt, content, score, gradedBy, gradedAt, feedback, attemptNumber, status, files | 401, 404 | `SubmissionController.getSubmissionById()` |
| POST | `/submissions/{id}/grade` | Grade submission | Teacher | `GradeSubmissionRequest`: grade, feedback | `SubmissionResponse`: id, score, gradedBy, gradedAt, feedback, status | 400, 401, 403, 404 | `SubmissionController.gradeSubmission()` |
| POST | `/submissions/{id}/feedback` | Add feedback to submission | Teacher | `FeedbackSubmissionRequest`: feedback | `SubmissionResponse`: id, feedback | 400, 401, 403, 404 | `SubmissionController.feedbackSubmission()` |
| GET | `/students/{studentId}/submissions` | Get student submissions | Required | - | `List<SubmissionResponse>`: id, assignmentId, studentId, submittedAt, score, status | 401, 403, 404 | `SubmissionController.getStudentSubmissions()` |
| DELETE | `/submissions/{id}` | Delete submission | Required | - | `Void` | 401, 403, 404 | `SubmissionController.deleteSubmission()` |
| GET | `/submissions/{submissionId}/files` | Get submission files | Required | - | `List<SubmissionFileResponse>`: id, fileName, fileSize, downloadUrl, uploadedAt | 401, 404 | `SubmissionFileController.getSubmissionFiles()` |
| DELETE | `/submissions/{submissionId}/files/{fileId}` | Delete submission file | Required | - | `Void` | 401, 403, 404 | `SubmissionFileController.deleteSubmissionFile()` |

### Course Content - Chapters (`/api/v1`)

| Method | Path | Summary | Auth | Request DTO (Key Fields) | Response DTO (Key Fields) | Errors | Code Reference |
|--------|------|---------|------|--------------------------|---------------------------|--------|----------------|
| POST | `/courses/{courseId}/versions/{versionId}/chapters` | Create chapter | Teacher | `ChapterRequest`: title | `ChapterDto`: id, title, orderIndex, courseVersionId | 400, 401, 403 | `ChapterController.createNewChapter()` |
| GET | `/courses/{courseId}/versions/{versionId}/chapters` | Get chapters | Public | - | `List<ChapterDto>`: id, title, orderIndex, lessons | 404 | `ChapterController.getListChapters()` |
| GET | `/courses/{courseId}/versions/{versionId}/chapters/{chapterId}` | Get chapter detail | Public | - | `ChapterDto`: id, title, orderIndex, lessons, courseVersionId | 404 | `ChapterController.getDetailChapter()` |
| PUT | `/courses/{courseId}/versions/{versionId}/chapters/{chapterId}` | Update chapter | Teacher | `ChapterRequest`: title | `ChapterDto`: id, title, orderIndex | 400, 401, 403, 404 | `ChapterController.updateChapter()` |
| DELETE | `/courses/{courseId}/versions/{versionId}/chapters/{chapterId}` | Delete chapter | Teacher | - | `Void` | 401, 403, 404 | `ChapterController.deleteChapter()` |
| POST | `/courses/{courseId}/versions/{versionId}/chapters/reorder` | Reorder chapters | Teacher | `ChapterReorderRequest`: chapterIds (ordered list) | `Void` | 400, 401, 403, 404 | `ChapterController.reorderChapters()` |

### Course Content - Lessons (`/api/v1`)

| Method | Path | Summary | Auth | Request DTO (Key Fields) | Response DTO (Key Fields) | Errors | Code Reference |
|--------|------|---------|------|--------------------------|---------------------------|--------|----------------|
| POST | `/chapters/{chapterId}/lessons` | Create lesson | Teacher | `CreateLessonRequest`: type, title, shortDescription | `LessonDTO`: id, chapterId, type, title, shortDescription, orderIndex, videoUrl, duration | 400, 401, 403 | `LessonController.createLesson()` |
| GET | `/chapters/{chapterId}/lessons` | Get lessons by chapter | Public | - | `List<LessonDTO>`: id, chapterId, type, title, shortDescription, orderIndex, videoUrl, duration | 404 | `LessonController.getLessonsByChapter()` |
| GET | `/lessons/{id}` | Get lesson by ID | Public | - | `LessonDTO`: id, chapterId, type, title, shortDescription, orderIndex, videoUrl, duration, resources | 404 | `LessonController.getLessonById()` |
| PUT | `/lessons/{id}` | Update lesson | Teacher | `UpdateLessonRequest`: title, shortDescription | `LessonDTO`: id, title, shortDescription, updatedAt | 400, 401, 403, 404 | `LessonController.updateLesson()` |
| DELETE | `/lessons/{id}` | Delete lesson | Teacher | - | `Void` | 401, 403, 404 | `LessonController.deleteLesson()` |
| POST | `/chapters/{chapterId}/lessons/reorder` | Reorder lessons | Teacher | `ReorderLessonsRequest`: lessonIds (ordered list) | `Void` | 400, 401, 403, 404 | `LessonController.reorderLessons()` |
| GET | `/lessons/{lessonId}/video/upload-url` | Get video upload URL | Teacher | - | `RequestUploadUrlResponse`: uploadUrl, fileKey, expiresIn | 401, 403, 404 | `LessonController.requestUploadUrl()` |
| POST | `/lessons/{lessonId}/video/upload-complete` | Complete video upload | Teacher | `UpdateVideoRequest`: fileKey, duration | `LessonDTO`: id, videoUrl, duration | 400, 401, 403, 404 | `LessonController.uploadComplete()` |
| GET | `/lessons/{lessonId}/video/stream-url` | Get video stream URL | Public | - | `{ streamUrl: string }` | 404 | `LessonController.getVideoStreamingUrl()` |
| DELETE | `/lessons/{lessonId}/video` | Delete lesson video | Teacher | - | `LessonDTO`: id, videoUrl=null | 401, 403, 404 | `LessonController.deleteVideo()` |

### Course Content - Lesson Resources (`/api/v1`)

| Method | Path | Summary | Auth | Request DTO (Key Fields) | Response DTO (Key Fields) | Errors | Code Reference |
|--------|------|---------|------|--------------------------|---------------------------|--------|----------------|
| POST | `/lessons/{lessonId}/resources` | Add link/embed resource | Teacher | `LessonResourceRequest`: type, title, description, url, isRequired | `LessonResourceResponse`: id, lessonId, type, title, description, url, isRequired, orderIndex | 400, 401, 403 | `LessonResourceController.addLinkResource()` |
| POST | `/lessons/{lessonId}/resources/file` | Add file resource | Teacher | MultipartFile + title, description, isRequired | `LessonResourceResponse`: id, lessonId, type=FILE, title, description, fileName, fileSize, downloadUrl, isRequired, orderIndex | 400, 401, 403 | `LessonResourceController.addFileResource()` |
| GET | `/lessons/{lessonId}/resources` | Get lesson resources | Public | - | `List<LessonResourceResponse>`: id, type, title, description, url, fileName, downloadUrl, isRequired, orderIndex | 404 | `LessonResourceController.getLessonResources()` |
| GET | `/lessons/{lessonId}/resources/{resourceId}` | Get resource by ID | Public | - | `LessonResourceResponse`: id, lessonId, type, title, description, url, fileName, downloadUrl, isRequired, orderIndex | 404 | `LessonResourceController.getResourceById()` |
| PUT | `/lessons/{lessonId}/resources/{resourceId}` | Update resource | Teacher | `LessonResourceRequest`: title, description, url, isRequired | `LessonResourceResponse`: id, title, description, url, isRequired | 400, 401, 403, 404 | `LessonResourceController.updateResource()` |
| PUT | `/lessons/{lessonId}/resources/{resourceId}/file` | Replace resource file | Teacher | MultipartFile | `LessonResourceResponse`: id, fileName, fileSize, downloadUrl | 400, 401, 403, 404 | `LessonResourceController.replaceResourceFile()` |
| DELETE | `/lessons/{lessonId}/resources/{resourceId}` | Delete resource | Teacher | - | `Void` | 401, 403, 404 | `LessonResourceController.deleteResource()` |
| POST | `/lessons/{lessonId}/resources/reorder` | Reorder resources | Teacher | `ReorderResourcesRequest`: resourceIds (ordered list) | `Void` | 400, 401, 403, 404 | `LessonResourceController.reorderResources()` |

### File Storage (`/api/v1`)

| Method | Path | Summary | Auth | Request DTO (Key Fields) | Response DTO (Key Fields) | Errors | Code Reference |
|--------|------|---------|------|--------------------------|---------------------------|--------|----------------|
| POST | `/files/upload` | Upload file | Required | MultipartFile + folderPath (optional), storageProvider (optional) | `FileStorageResponse`: fileId, fileName, fileSize, downloadUrl, contentType, storageProvider | 400, 401 | `FileStorageController.uploadFile()` |
| GET | `/files/{id}` | Get file details | Required | - | `FileStorageResponse`: fileId, fileName, fileSize, downloadUrl, contentType, storageProvider, createdAt | 401, 404 | `FileStorageController.getFileStorage()` |
| GET | `/files/{id}/download` | Get download URL | Required | Query: `expirySeconds` (default: 3600) | `{ downloadUrl: string }` | 401, 404 | `FileStorageController.getDownloadUrl()` |
| GET | `/files/{id}/details` | Get file with download URL | Required | Query: `expirySeconds` (default: 3600) | `FileStorageResponse`: fileId, fileName, fileSize, downloadUrl, contentType, storageProvider | 401, 404 | `FileStorageController.getFileStorageWithDownloadUrl()` |
| DELETE | `/files/{id}` | Delete file | Required | - | `Void` | 401, 403, 404 | `FileStorageController.deleteFile()` |

### Course Tags (`/api/v1`)

| Method | Path | Summary | Auth | Request DTO (Key Fields) | Response DTO (Key Fields) | Errors | Pagination | Code Reference |
|--------|------|---------|------|--------------------------|---------------------------|--------|-------------|----------------|
| POST | `/admin/tags` | Create tag | Admin | `TagRequest`: name | `Tag`: id, name, createdAt | 400, 401, 403 | N | `TagController.createTag()` |
| GET | `/tags` | Get active tags | Public | Query: `page`, `size` | `PageResponse<Tag>`: items (id, name), page, size, totalItems, totalPages | - | Y | `TagController.getTags()` |
| GET | `/admin/tags` | Get all tags (including deleted) | Admin | Query: `page`, `size` | `PageResponse<Tag>`: items (id, name, deletedAt), page, size, totalItems, totalPages | 401, 403 | Y | `TagController.getAllTags()` |
| PUT | `/admin/tags/{id}` | Update tag | Admin | `TagRequest`: name | `Tag`: id, name, updatedAt | 400, 401, 403, 404 | N | `TagController.updateTag()` |
| DELETE | `/admin/tags/{id}` | Delete tag | Admin | - | `Void` | 401, 403, 404 | N | `TagController.deleteTag()` |
| PATCH | `/admin/tags/{id}/restore` | Restore deleted tag | Admin | - | `Tag`: id, name, deletedAt=null | 401, 403, 404 | N | `TagController.restoreTag()` |

### Course Versions (`/api/v1`)

| Method | Path | Summary | Auth | Request DTO (Key Fields) | Response DTO (Key Fields) | Errors | Pagination | Code Reference |
|--------|------|---------|------|--------------------------|---------------------------|--------|-------------|----------------|
| POST | `/courses/{courseId}/versions` | Create course version | Teacher | `CourseVersionRequest`: versionNumber, description | `CourseVersionResponse`: id, courseId, versionNumber, description, status, createdAt | 400, 401, 403 | N | `CourseVersionController.createCourseVersion()` |
| GET | `/courses/{courseId}/versions` | Get course versions | Teacher | - | `List<CourseVersionResponse>`: id, versionNumber, description, status, createdAt | 401, 403 | N | `CourseVersionController.getCourseVersions()` |
| GET | `/courses/{courseId}/versions/deleted` | Get deleted versions | Teacher | - | `List<CourseVersionResponse>`: id, versionNumber, status=DELETED | 401, 403 | N | `CourseVersionController.getDeletedCourseVersion()` |
| GET | `/courses/{courseId}/versions/{versionId}` | Get version by ID | Teacher | - | `CourseVersionResponse`: id, courseId, versionNumber, description, status, chapters, createdAt | 401, 403, 404 | N | `CourseVersionController.getCourseVersionById()` |
| POST | `/courses/{courseId}/versions/{versionId}/submit-approval` | Submit for approval | Teacher | - | `CourseVersionResponse`: id, status=PENDING_APPROVAL | 401, 403, 404 | N | `CourseVersionController.submitApproval()` |
| POST | `/courses/{courseId}/versions/{versionId}/approve` | Approve version | Admin | - | `CourseVersionResponse`: id, status=APPROVED | 401, 403, 404 | N | `CourseVersionController.approveCourseVersion()` |
| POST | `/courses/{courseId}/versions/{versionId}/reject` | Reject version | Admin | `RejectRequest`: reason | `CourseVersionResponse`: id, status=REJECTED, rejectionReason | 400, 401, 403, 404 | N | `CourseVersionController.rejectCourseVersion()` |
| POST | `/courses/{courseId}/versions/{versionId}/publish` | Publish version | Teacher | - | `CourseVersionResponse`: id, status=PUBLISHED | 401, 403, 404 | N | `CourseVersionController.publishCourseVersion()` |
| GET | `/courses/admin/versions/pending` | Get pending versions (Admin) | Admin | Query: `filter`, `page`, `size`, `sort` | `PageResponse<CourseVersionResponse>`: items (id, courseId, versionNumber, status=PENDING_APPROVAL), page, size, totalItems, totalPages | 401, 403 | Y | `CourseVersionController.getAllPendingCourseVersions()` |

### Admin Operations (`/api/v1`)

| Method | Path | Summary | Auth | Request DTO (Key Fields) | Response DTO (Key Fields) | Errors | Pagination | Code Reference |
|--------|------|---------|------|--------------------------|---------------------------|--------|-------------|----------------|
| GET | `/admin/dashboard` | Get admin dashboard | Admin | - | `ApiResponse<Object>`: data="Dashboard summary" | 401, 403 | N | `DashboardController.dashboard()` |
| GET | `/admin/statistics` | Get system statistics | Admin | - | `ApiResponse<Object>`: data="System statistics" | 401, 403 | N | `DashboardController.statistics()` |
| GET | `/admin/reports/revenue` | Get revenue report | Admin | - | `ApiResponse<Object>`: data="Revenue report" | 401, 403 | N | `DashboardController.revenueReport()` |
| GET | `/admin/reports/users` | Get user report | Admin | - | `ApiResponse<Object>`: data="Users report" | 401, 403 | N | `DashboardController.userReport()` |
| GET | `/admin/reports/courses` | Get course report | Admin | - | `ApiResponse<Object>`: data="Courses report" | 401, 403 | N | `DashboardController.courseReport()` |
| GET | `/admin/users` | Get all users | Admin | Query: `keyword`, `role`, `status`, `teacherApproved`, `page`, `size`, `sortBy`, `sortDirection` | `PageResponse<AdminUserListResponse>`: items (id, username, email, role, status, createdAt), page, size, totalItems, totalPages | 401, 403 | Y | `UserManagementController.getAllUsers()` |
| GET | `/admin/users/stats` | Get user statistics | Admin | - | `UserStatsResponse`: totalUsers, activeUsers, roleStats (students, teachers, admins) | 401, 403 | N | `UserManagementController.getUserStats()` |
| POST | `/admin/users/export` | Export users | Admin | `ExportUsersRequest`: format (CSV/EXCEL), filters | CSV/Excel file download | 400, 401, 403 | N | `UserManagementController.exportUsers()` |
| GET | `/admin/audit-logs` | Get audit logs | Admin | Query: `page`, `size` | `ApiResponse<PageResponse<AuditLogResponse>>`: items (id, action, userId, timestamp, details), page, size, totalItems | 401, 403 | Y | `AuditLogController.getAll()` |
| GET | `/admin/audit-logs/search` | Search audit logs | Admin | Query: `keyword`, `page`, `size` | `ApiResponse<PageResponse<AuditLogResponse>>`: items (id, action, userId, keyword matches), page, size | 401, 403 | Y | `AuditLogController.search()` |
| GET | `/admin/audit-logs/export` | Export audit logs | Admin | - | CSV file download | 401, 403 | N | `AuditLogController.export()` |
| GET | `/admin/settings` | Get system settings | Admin | - | `ApiResponse<List<SystemSettingResponse>>`: items (id, key, value, description, type) | 401, 403 | N | `SystemSettingController.getAll()` |
| POST | `/admin/settings` | Create system setting | Admin | `SystemSettingRequest`: key, value, description, type | `ApiResponse<SystemSettingResponse>`: id, key, value, description, type | 400, 401, 403 | N | `SystemSettingController.create()` |
| PUT | `/admin/settings/{id}` | Update system setting | Admin | `SystemSettingRequest`: key, value, description, type | `ApiResponse<SystemSettingResponse>`: id, key, value, updatedAt | 400, 401, 403, 404 | N | `SystemSettingController.update()` |
| DELETE | `/admin/settings/{id}` | Delete system setting | Admin | - | `ApiResponse<Void>` | 401, 403, 404 | N | `SystemSettingController.delete()` |

### Violation Reports (`/api/v1`)

| Method | Path | Summary | Auth | Request DTO (Key Fields) | Response DTO (Key Fields) | Errors | Pagination | Code Reference |
|--------|------|---------|------|--------------------------|---------------------------|--------|-------------|----------------|
| POST | `/reports` | Create violation report | Required | `ViolationReportCreateRequest`: reportType, targetType, targetId, reason, description | `ViolationReportDetailResponse`: id, reportType, targetType, targetId, reason, description, status, createdAt | 400, 401 | N | `ViolationReportController.create()` |
| GET | `/reports` | Get my reports | Required | Query: `page`, `size` | `PageResponse<ViolationReportResponse>`: items (id, reportType, targetType, status, createdAt), page, size, totalItems, totalPages | 401 | Y | `ViolationReportController.getMyReports()` |
| GET | `/admin/reports` | Get all reports (Admin) | Admin | Query: `page`, `size` | `PageResponse<ViolationReportResponse>`: items (id, reportType, targetType, reporterId, status, createdAt), page, size, totalItems, totalPages | 401, 403 | Y | `ViolationReportController.getAll()` |
| GET | `/reports/{id}` | Get report detail | Required | - | `ViolationReportDetailResponse`: id, reportType, targetType, targetId, reason, description, status, reporterId, createdAt, reviewedAt | 401, 404 | N | `ViolationReportController.getDetail()` |

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

